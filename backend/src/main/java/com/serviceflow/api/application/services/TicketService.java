package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.CategoriaRepositoryPort;
import com.serviceflow.api.application.ports.NotificacionRepositoryPort;
import com.serviceflow.api.application.ports.TicketEventoRepositoryPort;
import com.serviceflow.api.application.ports.TicketMensajeRepositoryPort;
import com.serviceflow.api.application.ports.TicketRepositoryPort;
import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.adapters.in.dto.TicketResponse;
import com.serviceflow.api.domain.Categoria;
import com.serviceflow.api.domain.EstadoTicket;
import com.serviceflow.api.domain.PrioridadTicket;
import com.serviceflow.api.domain.RolUsuario;
import com.serviceflow.api.domain.Ticket;
import com.serviceflow.api.domain.TicketEvento;
import com.serviceflow.api.domain.TicketMensaje;
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

    private static final Duration NEAR_SLA_WINDOW = Duration.ofHours(12);

    private final TicketRepositoryPort ticketRepository;
    private final UsuarioRepositoryPort usuarioRepository;
    private final CategoriaRepositoryPort categoriaRepository;
    private final TicketEventoRepositoryPort eventoRepository;
    private final TicketMensajeRepositoryPort mensajeRepository;
    private final NotificacionService notificacionService;

    public TicketService(TicketRepositoryPort ticketRepository,
                         UsuarioRepositoryPort usuarioRepository,
                         CategoriaRepositoryPort categoriaRepository,
                         TicketEventoRepositoryPort eventoRepository,
                         TicketMensajeRepositoryPort mensajeRepository,
                         NotificacionService notificacionService) {
        this.ticketRepository = ticketRepository;
        this.usuarioRepository = usuarioRepository;
        this.categoriaRepository = categoriaRepository;
        this.eventoRepository = eventoRepository;
        this.mensajeRepository = mensajeRepository;
        this.notificacionService = notificacionService;
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
        PrioridadTicket prioridad = category != null && category.getPrioridadDefecto() != null
                ? category.getPrioridadDefecto()
                : PrioridadTicket.MEDIUM;
        Ticket ticket = new Ticket(
                null,
                userId,
                email,
                title,
                category != null ? category.getCode() : null,
                description,
                prioridad,
                EstadoTicket.SUBMITTED,
                requiresApproval,
                null,
                LocalDateTime.now().plus(SLA_BY_PRIORITY.get(prioridad)),
                null,
                null,
                LocalDateTime.now()
        );
        ticket.setCodigo(generarCodigo(category));
        Ticket saved = ticketRepository.save(ticket);
        String creadorNombre = usuarioRepository.findByEmail(email).map(Usuario::getName).orElse(null);
        eventoRepository.save(TicketEvento.nuevo(saved.getId(), "CREATED", "Ticket creado", email, creadorNombre));

        saved = autoCategorizar(saved, category);
        saved = autoPriorizar(saved, prioridad);
        saved = autoAsignar(saved, requiresApproval, email);
        return saved;
    }

    private Ticket autoCategorizar(Ticket ticket, Categoria category) {
        ticket.setCategory(category.getCode());
        ticket.setRequiresApproval(category.isRequiresApproval());
        ticket.setStatus(EstadoTicket.CATEGORIZED);
        Ticket saved = ticketRepository.save(ticket);
        eventoRepository.save(TicketEvento.nuevo(saved.getId(), "CATEGORIZED",
                "Categoría asignada automáticamente: " + category.getCode(), null, "Sistema"));
        return saved;
    }

    private Ticket autoPriorizar(Ticket ticket, PrioridadTicket prioridad) {
        ticket.setPriority(prioridad);
        ticket.setSlaDueAt(ticket.getSlaDueAt() != null
                ? ticket.getSlaDueAt()
                : LocalDateTime.now().plus(SLA_BY_PRIORITY.get(prioridad)));
        ticket.setStatus(EstadoTicket.PRIORITIZED);
        Ticket saved = ticketRepository.save(ticket);
        eventoRepository.save(TicketEvento.nuevo(saved.getId(), "PRIORITIZED",
                "Prioridad asignada automáticamente: " + prioridad + " (SLA " + SLA_BY_PRIORITY.get(prioridad).toHours() + "h)",
                null, "Sistema"));
        return saved;
    }

    private Ticket autoAsignar(Ticket ticket, boolean requiereAprobacion, String requesterEmail) {
        List<Usuario> agentes = usuarioRepository.findByRole(RolUsuario.AGENT);
        if (agentes.isEmpty()) {
            return ticket;
        }
        Usuario agente = agenteConMenosCarga(agentes);
        ticket.setAssignedTo(agente.getId());
        ticket.setStatus(EstadoTicket.ASSIGNED);
        Ticket saved = ticketRepository.save(ticket);
        eventoRepository.save(TicketEvento.nuevo(saved.getId(), "ASSIGNED",
                "Asignado automáticamente al agente " + agente.getName(), null, "Sistema"));
        notificacionService.notificar(agente.getId(), saved.getId(), "TICKET_ASIGNADO",
                "Se te asignó el ticket " + saved.getCodigo() + ": " + saved.getTitle());
        if (requiereAprobacion) {
            eventoRepository.save(TicketEvento.nuevo(saved.getId(), "APPROVAL_REQUIRED",
                    "Requiere autorización gerencial obligatoria", null, "Sistema"));
            notificacionService.notificarSupervisores(saved.getId(), "APROBACION_REQUERIDA",
                    "El ticket " + saved.getCodigo() + " de " + requesterEmail + " requiere aprobación");
        }
        return saved;
    }

    private Usuario agenteConMenosCarga(List<Usuario> agentes) {
        List<Ticket> activos = ticketRepository.findAll().stream()
                .filter(t -> t.getStatus() != EstadoTicket.RESOLVED && t.getStatus() != EstadoTicket.CLOSED)
                .toList();
        Usuario mejor = agentes.get(0);
        long mejorCarga = Long.MAX_VALUE;
        for (Usuario agente : agentes) {
            long carga = activos.stream().filter(t -> agente.getId().equals(t.getAssignedTo())).count();
            if (carga < mejorCarga) {
                mejorCarga = carga;
                mejor = agente;
            }
        }
        return mejor;
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

    public record TicketSearchData(Ticket ticket, String createdByName, String assignedToName) {
    }

    public List<TicketSearchData> findAllWithNames() {
        return ticketRepository.findAll().stream()
                .map(t -> new TicketSearchData(
                        t,
                        usuarioRepository.findByEmail(t.getEmail()).map(Usuario::getName).orElse(""),
                        t.getAssignedTo() != null
                                ? usuarioRepository.findById(t.getAssignedTo()).map(Usuario::getName).orElse("")
                                : ""))
                .toList();
    }

    public Ticket categorize(UUID id, String categoryCode, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Categoria category = resolveCategory(categoryCode);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.SUBMITTED);
        ticket.setCategory(category.getCode());
        ticket.setRequiresApproval(category.isRequiresApproval());
        ticket.setStatus(EstadoTicket.CATEGORIZED);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "CATEGORIZED", "Categoría asignada: " + category.getCode(), actorEmail);
        return saved;
    }

    public Ticket prioritize(UUID id, PrioridadTicket priority, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.CATEGORIZED);
        ticket.setPriority(priority);
        ticket.setSlaDueAt(LocalDateTime.now().plus(SLA_BY_PRIORITY.get(priority)));
        ticket.setStatus(EstadoTicket.PRIORITIZED);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "PRIORITIZED", "Prioridad asignada: " + priority + " (SLA " + SLA_BY_PRIORITY.get(priority).toHours() + "h)", actorEmail);
        return saved;
    }

    public Ticket assign(UUID id, UUID assignedTo, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.PRIORITIZED);
        ticket.setAssignedTo(assignedTo);
        ticket.setStatus(EstadoTicket.ASSIGNED);
        Ticket saved = ticketRepository.save(ticket);
        String asignadoNombre = usuarioRepository.findById(assignedTo).map(Usuario::getName).orElse(null);
        registrarEvento(saved, "ASSIGNED", "Asignado al agente " + (asignadoNombre != null ? asignadoNombre : assignedTo), actorEmail);
        notificacionService.notificar(assignedTo, saved.getId(), "TICKET_ASIGNADO",
                "Se te asignó el ticket " + saved.getCodigo() + ": " + saved.getTitle());
        if (saved.isRequiresApproval()) {
            notificacionService.notificarSupervisores(saved.getId(), "APROBACION_REQUERIDA",
                    "El ticket " + saved.getCodigo() + " requiere aprobación");
        }
        return saved;
    }

    public Ticket approve(UUID id, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.ASSIGNED);
        if (!ticket.isRequiresApproval()) {
            throw new InvalidTransitionException("This ticket does not require approval");
        }
        ticket.setStatus(EstadoTicket.APPROVED);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "APPROVED", "Ticket aprobado", actorEmail);
        notificacionService.notificarPorEmail(saved.getEmail(), saved.getId(), "TICKET_APROBADO",
                "Tu ticket " + saved.getCodigo() + " fue aprobado");
        if (saved.getAssignedTo() != null) {
            notificacionService.notificar(saved.getAssignedTo(), saved.getId(), "TICKET_APROBADO",
                    "El ticket " + saved.getCodigo() + " fue aprobado, ya podés arrancar");
        }
        return saved;
    }

    public Ticket start(UUID id, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        if (!EnumSet.of(EstadoTicket.ASSIGNED, EstadoTicket.APPROVED).contains(ticket.getStatus())) {
            throw new InvalidTransitionException("Ticket must be assigned (and approved if required) before starting");
        }
        ticket.setStatus(EstadoTicket.IN_PROGRESS);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "STARTED", "Trabajo iniciado", actorEmail);
        return saved;
    }

    public Ticket escalate(UUID id, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.IN_PROGRESS);
        ticket.setStatus(EstadoTicket.ESCALATED);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "ESCALATED", "Ticket escalado manualmente", actorEmail);
        notificarEscalado(saved);
        return saved;
    }

    public Ticket resolve(UUID id, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.AGENT, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        if (!EnumSet.of(EstadoTicket.IN_PROGRESS, EstadoTicket.ESCALATED).contains(ticket.getStatus())) {
            throw new InvalidTransitionException("Ticket must be in progress or escalated before resolving");
        }
        ticket.setResolvedAt(LocalDateTime.now());
        ticket.setStatus(EstadoTicket.RESOLVED);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "RESOLVED", "Ticket resuelto", actorEmail);
        notificacionService.notificarPorEmail(saved.getEmail(), saved.getId(), "TICKET_RESUELTO",
                "Tu ticket " + saved.getCodigo() + " fue resuelto");
        return saved;
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
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "CLOSED", "Ticket cerrado", actorEmail);
        if (!isRequester) {
            notificacionService.notificarPorEmail(saved.getEmail(), saved.getId(), "TICKET_CERRADO",
                    "Tu ticket " + saved.getCodigo() + " fue cerrado");
        }
        return saved;
    }

    public TicketMensaje agregarMensaje(UUID ticketId, String autorEmail, String mensajeTexto) {
        Ticket ticket = findById(ticketId);
        if (mensajeTexto == null || mensajeTexto.isBlank()) {
            throw new InvalidTransitionException("El mensaje no puede estar vacío");
        }
        String autorNombre = usuarioRepository.findByEmail(autorEmail).map(Usuario::getName).orElse(null);
        TicketMensaje guardado = mensajeRepository.save(
                TicketMensaje.nuevo(ticketId, autorEmail, autorNombre, mensajeTexto.trim()));
        eventoRepository.save(TicketEvento.nuevo(ticketId, "MESSAGE",
                "Mensaje de " + (autorNombre != null ? autorNombre : autorEmail) + ": " + mensajeTexto.trim(),
                autorEmail, autorNombre));
        return guardado;
    }

    public List<TicketMensaje> mensajes(UUID ticketId) {
        findById(ticketId);
        return mensajeRepository.findByTicketId(ticketId);
    }

    private void notificarEscalado(Ticket ticket) {
        notificacionService.notificarPorEmail(ticket.getEmail(), ticket.getId(), "TICKET_ESCALADO",
                "Tu ticket " + ticket.getCodigo() + " fue escalado por vencimiento");
        if (ticket.getAssignedTo() != null) {
            notificacionService.notificar(ticket.getAssignedTo(), ticket.getId(), "TICKET_ESCALADO",
                    "El ticket " + ticket.getCodigo() + " fue escalado");
        }
        notificacionService.notificarSupervisores(ticket.getId(), "TICKET_ESCALADO",
                "El ticket " + ticket.getCodigo() + " se escaló por SLA vencido");
    }

    public List<TicketEvento> timeline(UUID id) {
        findById(id);
        return eventoRepository.findByTicketId(id);
    }

    private void registrarEvento(Ticket ticket, String tipo, String descripcion, String actorEmail) {
        if (actorEmail == null || actorEmail.isBlank()) {
            eventoRepository.save(TicketEvento.nuevo(ticket.getId(), tipo, descripcion, null, null));
            return;
        }
        String nombre = usuarioRepository.findByEmail(actorEmail).map(Usuario::getName).orElse(null);
        eventoRepository.save(TicketEvento.nuevo(ticket.getId(), tipo, descripcion, actorEmail, nombre));
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