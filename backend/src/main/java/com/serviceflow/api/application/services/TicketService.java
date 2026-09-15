package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.CategoriaRepositoryPort;
import com.serviceflow.api.application.ports.TicketRepositoryPort;
import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.adapters.in.dto.TicketResponse;
import com.serviceflow.api.domain.Categoria;
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

    private static final Duration NEAR_SLA_WINDOW = Duration.ofHours(24);

    private final TicketRepositoryPort ticketRepository;
    private final UsuarioRepositoryPort usuarioRepository;
    private final CategoriaRepositoryPort categoriaRepository;

    public TicketService(TicketRepositoryPort ticketRepository,
                         UsuarioRepositoryPort usuarioRepository,
                         CategoriaRepositoryPort categoriaRepository) {
        this.ticketRepository = ticketRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public Ticket createForRequester(String email, String title, String description, String categoryCode) {
        Usuario requester = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new TicketNotFoundException("User not found with email: " + email));
        Categoria category = resolveCategory(categoryCode);
        return create(title, description, category, requester.getId(), requester.getEmail());
    }

    public Ticket create(String title, String description, Categoria category,
                         UUID userId, String email) {
        boolean requiresApproval = category != null && category.isRequiresApproval();
        Ticket ticket = new Ticket(
                null,
                userId,
                email,
                title,
                category != null ? category.getCode() : null,
                description,
                PrioridadTicket.MEDIUM,
                EstadoTicket.SUBMITTED,
                requiresApproval,
                null,
                LocalDateTime.now().plus(SLA_BY_PRIORITY.get(PrioridadTicket.MEDIUM)),
                null,
                null,
                LocalDateTime.now()
        );
        ticket.setCodigo(generarCodigo(category));
        return ticketRepository.save(ticket);
    }

    private String generarCodigo(Categoria category) {
        String prefix = category != null ? prefijoCategoria(category.getCode()) : "TK";
        long next = ticketRepository.countByCategory(category != null ? category.getCode() : "") + 1;
        return prefix + "-" + String.format("%04d", next);
    }

    private String prefijoCategoria(String code) {
        if (code == null) {
            return "TK";
        }
        return switch (code.toUpperCase()) {
            case "IT" -> "IT";
            case "ACCESS" -> "ACC";
            case "HARDWARE" -> "HW";
            case "FACILITIES" -> "FAC";
            case "FINANCE" -> "FIN";
            case "PASSWORD_RECOVERY" -> "PR";
            default -> code.toUpperCase().substring(0, 2);
        };
    }

    private Categoria resolveCategory(String categoryCode) {
        if (categoryCode == null || categoryCode.isBlank()) {
            throw new InvalidTransitionException("A valid category is required");
        }
        Categoria category = categoriaRepository.findByCode(categoryCode)
                .orElseThrow(() -> new InvalidTransitionException("Category not found: " + categoryCode));
        if (!category.isActive()) {
            throw new InvalidTransitionException("Category is not active: " + categoryCode);
        }
        return category;
    }

    public Ticket findById(UUID id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
    }

    public TicketResponse toResponse(Ticket ticket) {
        String createdByName = usuarioRepository.findByEmail(ticket.getEmail())
                .map(Usuario::getName)
                .orElse(null);
        return TicketResponse.from(ticket, createdByName);
    }

    public List<Ticket> findAll() {
        return ticketRepository.findAll();
    }

    public Ticket categorize(UUID id, String categoryCode, RolUsuario actorRole) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Categoria category = resolveCategory(categoryCode);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.SUBMITTED);
        ticket.setCategory(category.getCode());
        ticket.setRequiresApproval(category.isRequiresApproval());
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

    public Map<String, Object> summaryStats(LocalDateTime month) {
        LocalDateTime start = month.withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusMonths(1);
        LocalDateTime prevStart = start.minusMonths(1);
        LocalDateTime prevEnd = start;
        LocalDateTime now = LocalDateTime.now();

        List<Ticket> all = ticketRepository.findAll();

        List<Ticket> active = all.stream()
                .filter(t -> t.getStatus() != EstadoTicket.RESOLVED && t.getStatus() != EstadoTicket.CLOSED)
                .toList();

        long activeTickets = active.size();
        long activePrev = activeCountAt(prevEnd);

        long nearSlaExpiry = active.stream()
                .filter(t -> t.getSlaDueAt() != null)
                .filter(t -> !t.getSlaDueAt().isBefore(now) && !t.getSlaDueAt().isAfter(now.plus(NEAR_SLA_WINDOW)))
                .count();

        long overdueSla = active.stream()
                .filter(t -> t.getSlaDueAt() != null && t.getSlaDueAt().isBefore(now))
                .count();

        List<Ticket> resolved = ticketRepository.findByResolvedAtBetween(start, end);
        List<Ticket> resolvedPrev = ticketRepository.findByResolvedAtBetween(prevStart, prevEnd);

        long resolvedOnTime = resolved.stream()
                .filter(t -> t.getSlaDueAt() != null && t.getResolvedAt() != null && !t.getResolvedAt().isAfter(t.getSlaDueAt()))
                .count();
        long resolvedOnTimePrev = resolvedPrev.stream()
                .filter(t -> t.getSlaDueAt() != null && t.getResolvedAt() != null && !t.getResolvedAt().isAfter(t.getSlaDueAt()))
                .count();

        double compliance = resolved.isEmpty() ? 0.0 : round2(resolvedOnTime * 100.0 / resolved.size());
        double compliancePrev = resolvedPrev.isEmpty() ? 0.0 : round2(resolvedOnTimePrev * 100.0 / resolvedPrev.size());

        List<Ticket> created = ticketRepository.findByCreatedAtBetween(start, end);
        List<Ticket> createdPrev = ticketRepository.findByCreatedAtBetween(prevStart, prevEnd);

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("month", start.toLocalDate().getYear() + "-" + String.format("%02d", start.toLocalDate().getMonthValue()));
        result.put("activeTickets", activeTickets);
        result.put("activePrevMonth", activePrev);
        result.put("activeDelta", activeTickets - activePrev);
        result.put("nearSlaExpiry", nearSlaExpiry);
        result.put("overdueSla", overdueSla);
        result.put("resolved", resolved.size());
        result.put("resolvedPrevMonth", resolvedPrev.size());
        result.put("resolvedOnTime", resolvedOnTime);
        result.put("resolvedOnTimePrev", resolvedOnTimePrev);
        result.put("slaCompliance", compliance);
        result.put("slaCompliancePrev", compliancePrev);
        result.put("created", created.size());
        result.put("createdPrevMonth", createdPrev.size());
        return result;
    }

    private long activeCountAt(LocalDateTime until) {
        return ticketRepository.findAll().stream()
                .filter(t -> t.getCreatedAt() != null && !t.getCreatedAt().isAfter(until))
                .filter(t -> t.getResolvedAt() == null || t.getResolvedAt().isAfter(until))
                .filter(t -> t.getClosedAt() == null || t.getClosedAt().isAfter(until))
                .count();
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
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
        List<Categoria> categories = categoriaRepository.findAll();
        Map<String, Long> result = new java.util.HashMap<>();
        for (Categoria category : categories) {
            result.put(category.getCode(), ticketRepository.countByCategory(category.getCode()));
        }
        return result;
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