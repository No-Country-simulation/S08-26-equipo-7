package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.TicketRepositoryPort;
import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.domain.CategoriaTicket;
import com.serviceflow.api.domain.EstadoTicket;
import com.serviceflow.api.domain.PrioridadTicket;
import com.serviceflow.api.domain.RolUsuario;
import com.serviceflow.api.domain.Ticket;
import com.serviceflow.api.domain.Usuario;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TicketService {

    private static final Map<PrioridadTicket, Duration> SLA_BY_PRIORITY = Map.of(
            PrioridadTicket.LOW, Duration.ofHours(72),
            PrioridadTicket.MEDIUM, Duration.ofHours(24),
            PrioridadTicket.HIGH, Duration.ofHours(8),
            PrioridadTicket.URGENT, Duration.ofHours(4)
    );

    private final TicketRepositoryPort ticketRepository;
    private final UsuarioRepositoryPort usuarioRepository;

    public TicketService(TicketRepositoryPort ticketRepository, UsuarioRepositoryPort usuarioRepository) {
        this.ticketRepository = ticketRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Ticket createForRequester(String email, String description, CategoriaTicket category,
                                     PrioridadTicket priority, boolean requiresApproval) {
        Usuario requester = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new TicketNotFoundException("User not found with email: " + email));
        return create(category, description, priority, requiresApproval, requester.getId(), requester.getEmail());
    }

    public Ticket create(CategoriaTicket category, String description, PrioridadTicket priority,
                         boolean requiresApproval, UUID userId, String email) {
        PrioridadTicket effectivePriority = priority != null ? priority : PrioridadTicket.MEDIUM;
        Ticket ticket = new Ticket(
                null,
                userId,
                email,
                category != null ? category : CategoriaTicket.QUERY,
                description,
                effectivePriority,
                EstadoTicket.SUBMITTED,
                requiresApproval,
                null,
                LocalDateTime.now().plus(SLA_BY_PRIORITY.get(effectivePriority)),
                null,
                null,
                LocalDateTime.now()
        );
        return ticketRepository.save(ticket);
    }

    public Ticket findById(UUID id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
    }

    public List<Ticket> findAll() {
        return ticketRepository.findAll();
    }

    public Ticket categorize(UUID id, CategoriaTicket category, RolUsuario actorRole) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.SUBMITTED);
        ticket.setCategory(category);
        ticket.setStatus(EstadoTicket.CATEGORIZED);
        return ticketRepository.save(ticket);
    }

    public Ticket prioritize(UUID id, PrioridadTicket priority, RolUsuario actorRole) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.CATEGORIZED);
        ticket.setPriority(priority);
        ticket.setSlaDueAt(LocalDateTime.now().plus(SLA_BY_PRIORITY.get(priority)));
        ticket.setStatus(EstadoTicket.PRIORITIZED);
        return ticketRepository.save(ticket);
    }

    public Ticket assign(UUID id, UUID assignedTo, RolUsuario actorRole) {
        requireRole(actorRole, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.PRIORITIZED);
        ticket.setAssignedTo(assignedTo);
        ticket.setStatus(EstadoTicket.ASSIGNED);
        return ticketRepository.save(ticket);
    }

    public Ticket approve(UUID id, RolUsuario actorRole) {
        requireRole(actorRole, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.ASSIGNED);
        if (!ticket.isRequiresApproval()) {
            throw new InvalidTransitionException("This ticket does not require approval");
        }
        ticket.setStatus(EstadoTicket.APPROVED);
        return ticketRepository.save(ticket);
    }

    public Ticket start(UUID id, RolUsuario actorRole) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        if (!EnumSet.of(EstadoTicket.ASSIGNED, EstadoTicket.APPROVED).contains(ticket.getStatus())) {
            throw new InvalidTransitionException("Ticket must be assigned (and approved if required) before starting");
        }
        ticket.setStatus(EstadoTicket.IN_PROGRESS);
        return ticketRepository.save(ticket);
    }

    public Ticket escalate(UUID id, RolUsuario actorRole) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.IN_PROGRESS);
        ticket.setStatus(EstadoTicket.ESCALATED);
        return ticketRepository.save(ticket);
    }

    public Ticket resolve(UUID id, RolUsuario actorRole) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        if (!EnumSet.of(EstadoTicket.IN_PROGRESS, EstadoTicket.ESCALATED).contains(ticket.getStatus())) {
            throw new InvalidTransitionException("Ticket must be in progress or escalated before resolving");
        }
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setStatus(EstadoTicket.RESOLVED);
        return ticketRepository.save(ticket);
    }

    public Ticket close(UUID id, RolUsuario actorRole, String actorEmail) {
        Ticket ticket = findById(id);
        boolean isRequester = ticket.getEmail().equalsIgnoreCase(actorEmail);
        if (!EnumSet.of(RolUsuario.SUPERVISOR, RolUsuario.ADMIN).contains(actorRole) && !isRequester) {
            throw new UnauthorizedActionException("Only the requester, a supervisor or an admin can close the ticket");
        }
        requireStatus(ticket, EstadoTicket.RESOLVED);
        ticket.setClosedAt(LocalDateTime.now());
        ticket.setStatus(EstadoTicket.CLOSED);
        return ticketRepository.save(ticket);
    }

    public Map<String, Object> monthlyStats(LocalDateTime yearMonth) {
        LocalDateTime start = yearMonth.withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusMonths(1);

        List<Ticket> created = ticketRepository.findByCreatedAtBetween(start, end);
        List<Ticket> resolved = ticketRepository.findByResolvedAtBetween(start, end);

        long resolvedOnTime = resolved.stream()
                .filter(t -> t.getSlaDueAt() != null && !t.getResolvedAt().isAfter(t.getSlaDueAt()))
                .count();

        double avgResolutionHours = resolved.stream()
                .filter(t -> t.getCreatedAt() != null)
                .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getResolvedAt()).toHours())
                .average()
                .orElse(0.0);

        return Map.of(
                "created", created.size(),
                "resolved", resolved.size(),
                "resolvedOnTime", resolvedOnTime,
                "resolvedLate", resolved.size() - resolvedOnTime,
                "avgResolutionHours", Math.round(avgResolutionHours * 10.0) / 10.0,
                "byStatus", statusBreakdown(),
                "byCategory", categoryBreakdown()
        );
    }

    private Map<String, Long> statusBreakdown() {
        return Map.of(
                "SUBMITTED", ticketRepository.countByStatus(EstadoTicket.SUBMITTED.name()),
                "CATEGORIZED", ticketRepository.countByStatus(EstadoTicket.CATEGORIZED.name()),
                "PRIORITIZED", ticketRepository.countByStatus(EstadoTicket.PRIORITIZED.name()),
                "ASSIGNED", ticketRepository.countByStatus(EstadoTicket.ASSIGNED.name()),
                "APPROVED", ticketRepository.countByStatus(EstadoTicket.APPROVED.name()),
                "IN_PROGRESS", ticketRepository.countByStatus(EstadoTicket.IN_PROGRESS.name()),
                "ESCALATED", ticketRepository.countByStatus(EstadoTicket.ESCALATED.name()),
                "RESOLVED", ticketRepository.countByStatus(EstadoTicket.RESOLVED.name()),
                "CLOSED", ticketRepository.countByStatus(EstadoTicket.CLOSED.name())
        );
    }

    private Map<String, Long> categoryBreakdown() {
        return Map.of(
                "PASSWORD_RECOVERY", ticketRepository.countByCategory(CategoriaTicket.PASSWORD_RECOVERY.name()),
                "QUERY", ticketRepository.countByCategory(CategoriaTicket.QUERY.name()),
                "SYSTEM_ERROR", ticketRepository.countByCategory(CategoriaTicket.SYSTEM_ERROR.name()),
                "OTHER", ticketRepository.countByCategory(CategoriaTicket.OTHER.name())
        );
    }

    private void requireStatus(Ticket ticket, EstadoTicket expected) {
        if (ticket.getStatus() != expected) {
            throw new InvalidTransitionException("Invalid transition: current status is " + ticket.getStatus()
                    + ", expected " + expected);
        }
    }

    private void requireRole(RolUsuario actorRole, RolUsuario... allowed) {
        if (Arrays.stream(allowed).noneMatch(r -> r == actorRole)) {
            throw new UnauthorizedActionException("Your role does not allow this action");
        }
    }
}