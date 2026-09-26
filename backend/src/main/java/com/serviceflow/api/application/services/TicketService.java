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
        // Por área del ticket (categoría); si no hay agentes de esa área, cae al general
        List<Usuario> delArea = ticket.getCategory() != null
                ? agentes.stream()
                        .filter(a -> a.getArea() != null && a.getArea().equalsIgnoreCase(ticket.getCategory()))
                        .toList()
                : List.of();
        Usuario agente = agenteConMenosCarga(delArea.isEmpty() ? agentes : delArea);
        ticket.setAssignedTo(agente.getId());
        ticket.setStatus(EstadoTicket.ASSIGNED);
        Ticket saved = ticketRepository.save(ticket);
        eventoRepository.save(TicketEvento.nuevo(saved.getId(), "ASSIGNED",
                "Asignado automáticamente al agente " + agente.getName(), null, "Sistema"));
        notificacionService.notificar(agente.getId(), saved.getId(), "TICKET_ASIGNADO",
                "Se te asignó el ticket " + saved.getCodigo() + ": " + saved.getTitle());
        if (requiereAprobacion) {
            ticket.setStatus(EstadoTicket.PENDING_APPROVAL);
            saved = ticketRepository.save(ticket);
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
        String assignedToName = ticket.getAssignedTo() != null
                ? usuarioRepository.findById(ticket.getAssignedTo()).map(Usuario::getName).orElse(null)
                : null;
        return TicketResponse.from(ticket, createdByName, assignedToName);
    }

    public List<Ticket> findAll() {
        return ticketRepository.findAll();
    }

    public record TicketSearchData(Ticket ticket, String createdByName, String assignedToName) {
    }

    public List<TicketSearchData> findAllWithNamesScoped(String email, RolUsuario role) {
        List<TicketSearchData> all = findAllWithNames();
        if (role == RolUsuario.ADMIN) {
            return all;
        }
        if (role == RolUsuario.REQUESTER) {
            return all.stream().filter(d -> email.equalsIgnoreCase(d.ticket().getEmail())).toList();
        }
        if (role == RolUsuario.AGENT) {
            UUID id = usuarioRepository.findByEmail(email).map(Usuario::getId).orElse(null);
            if (id == null) {
                return List.of();
            }
            return all.stream().filter(d -> id.equals(d.ticket().getAssignedTo())).toList();
        }
        String area = usuarioRepository.findByEmail(email).map(Usuario::getArea).orElse(null);
        if (area == null || area.isBlank()) {
            return all;
        }
        return all.stream().filter(d -> area.equalsIgnoreCase(d.ticket().getCategory())).toList();
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
        requireRole(actorRole, RolUsuario.ADMIN);
        Categoria category = resolveCategory(categoryCode);
        Ticket ticket = findById(id);
        if (ticket.getStatus() == EstadoTicket.CLOSED) {
            throw new InvalidTransitionException("Cannot change the category of a closed ticket");
        }
        ticket.setCategory(category.getCode());
        ticket.setRequiresApproval(category.isRequiresApproval());
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "CATEGORIZED", "Categoría cambiada a: " + category.getCode(), actorEmail);
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

    public Ticket reassign(UUID id, UUID assignedTo, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        if (ticket.getStatus() == EstadoTicket.RESOLVED || ticket.getStatus() == EstadoTicket.CLOSED) {
            throw new InvalidTransitionException("Cannot reassign a resolved or closed ticket");
        }
        Usuario nuevo = usuarioRepository.findById(assignedTo)
                .orElseThrow(() -> new InvalidTransitionException("Assignee not found: " + assignedTo));
        ticket.setAssignedTo(assignedTo);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "REASSIGNED", "Reasignado al agente " + nuevo.getName(), actorEmail);
        notificacionService.notificar(assignedTo, saved.getId(), "TICKET_ASIGNADO",
                "Se te reasignó el ticket " + saved.getCodigo() + ": " + saved.getTitle());
        return saved;
    }

    public Ticket setStatus(UUID id, EstadoTicket nuevoEstado, RolUsuario actorRole, String actorEmail) {
        Ticket ticket = findById(id);
        if (ticket.getStatus() == EstadoTicket.CLOSED) {
            throw new InvalidTransitionException("Cannot change the status of a closed ticket");
        }
        if (nuevoEstado == EstadoTicket.CLOSED) {
            throw new InvalidTransitionException("Use reject or close to close a ticket");
        }
        switch (actorRole) {
            case ADMIN -> {
                if (!EnumSet.of(EstadoTicket.SUBMITTED, EstadoTicket.CATEGORIZED, EstadoTicket.PRIORITIZED,
                        EstadoTicket.ASSIGNED, EstadoTicket.PENDING_APPROVAL, EstadoTicket.APPROVED,
                        EstadoTicket.IN_PROGRESS, EstadoTicket.ESCALATED, EstadoTicket.RESOLVED).contains(nuevoEstado)) {
                    throw new InvalidTransitionException("Invalid target status: " + nuevoEstado);
                }
            }
            case SUPERVISOR -> {
                if (!EnumSet.of(EstadoTicket.PENDING_APPROVAL, EstadoTicket.APPROVED,
                        EstadoTicket.RESOLVED).contains(nuevoEstado)) {
                    throw new InvalidTransitionException("Supervisors can only set approval or resolved states");
                }
            }
            case AGENT -> {
                if (nuevoEstado != EstadoTicket.RESOLVED) {
                    throw new InvalidTransitionException("Agents can only resolve tickets");
                }
            }
            default -> throw new UnauthorizedActionException("Requesters cannot change ticket status");
        }
        if (nuevoEstado == EstadoTicket.RESOLVED && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
        }
        ticket.setStatus(nuevoEstado);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "STATUS_CHANGED", "Estado cambiado a " + nuevoEstado, actorEmail);
        return saved;
    }

    public Ticket reopen(UUID id, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        requireStatus(ticket, EstadoTicket.CLOSED);
        ticket.setStatus(ticket.isRequiresApproval() ? EstadoTicket.PENDING_APPROVAL : EstadoTicket.ASSIGNED);
        ticket.setResolvedAt(null);
        ticket.setClosedAt(null);
        ticket.setSlaDueAt(LocalDateTime.now().plus(SLA_BY_PRIORITY.get(ticket.getPriority())));
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "REOPENED",
                ticket.isRequiresApproval()
                        ? "Ticket reabierto, requiere aprobación de nuevo"
                        : "Ticket reabierto con SLA reiniciado",
                actorEmail);
        notificacionService.notificarPorEmail(saved.getEmail(), saved.getId(), "TICKET_REABIERTO",
                "Tu ticket " + saved.getCodigo() + " fue reabierto");
        if (saved.getAssignedTo() != null) {
            notificacionService.notificar(saved.getAssignedTo(), saved.getId(), "TICKET_REABIERTO",
                    "El ticket " + saved.getCodigo() + " fue reabierto");
        }
        return saved;
    }

    public Ticket approve(UUID id, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        if (!EnumSet.of(EstadoTicket.ASSIGNED, EstadoTicket.PENDING_APPROVAL).contains(ticket.getStatus())) {
            throw new InvalidTransitionException("Ticket must be assigned before approval");
        }
        if (!ticket.isRequiresApproval()) {
            throw new InvalidTransitionException("This ticket does not require approval");
        }
        ticket.setStatus(EstadoTicket.IN_PROGRESS);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "APPROVED", "Ticket aprobado", actorEmail);
        registrarEvento(saved, "STARTED", "Trabajo iniciado automáticamente tras aprobación", actorEmail);
        notificacionService.notificarPorEmail(saved.getEmail(), saved.getId(), "TICKET_APROBADO",
                "Tu ticket " + saved.getCodigo() + " fue aprobado y está en proceso");
        if (saved.getAssignedTo() != null) {
            notificacionService.notificar(saved.getAssignedTo(), saved.getId(), "TICKET_APROBADO",
                    "El ticket " + saved.getCodigo() + " fue aprobado y pasó a en proceso");
        }
        return saved;
    }

    public Ticket reject(UUID id, RolUsuario actorRole, String actorEmail) {
        requireRole(actorRole, RolUsuario.SUPERVISOR, RolUsuario.ADMIN);
        Ticket ticket = findById(id);
        if (!EnumSet.of(EstadoTicket.ASSIGNED, EstadoTicket.PENDING_APPROVAL).contains(ticket.getStatus())) {
            throw new InvalidTransitionException("Ticket must be assigned before rejection");
        }
        if (!ticket.isRequiresApproval()) {
            throw new InvalidTransitionException("This ticket does not require approval");
        }
        ticket.setStatus(EstadoTicket.CLOSED);
        Ticket saved = ticketRepository.save(ticket);
        registrarEvento(saved, "REJECTED", "Ticket rechazado por falta de autorización, cerrado", actorEmail);
        notificacionService.notificarPorEmail(saved.getEmail(), saved.getId(), "TICKET_RECHAZADO",
                "Tu ticket " + saved.getCodigo() + " fue rechazado, creá uno nuevo si corresponde");
        if (saved.getAssignedTo() != null) {
            notificacionService.notificar(saved.getAssignedTo(), saved.getId(), "TICKET_RECHAZADO",
                    "El ticket " + saved.getCodigo() + " fue rechazado y cerrado");
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
        String texto = mensajeTexto.trim();
        TicketMensaje guardado = mensajeRepository.save(
                TicketMensaje.nuevo(ticketId, autorEmail, autorNombre, texto));
        eventoRepository.save(TicketEvento.nuevo(ticketId, "MESSAGE",
                "Mensaje de " + (autorNombre != null ? autorNombre : autorEmail) + ": " + texto,
                autorEmail, autorNombre));
        notificarMensaje(ticket, autorEmail, autorNombre, texto);
        return guardado;
    }

    private void notificarMensaje(Ticket ticket, String autorEmail, String autorNombre, String texto) {
        String resumen = texto.length() > 120 ? texto.substring(0, 117) + "..." : texto;
        boolean esSolicitante = ticket.getEmail() != null && ticket.getEmail().equalsIgnoreCase(autorEmail);
        if (esSolicitante) {
            if (ticket.getAssignedTo() != null) {
                notificacionService.notificar(ticket.getAssignedTo(), ticket.getId(), "TICKET_MENSAJE",
                        "Nuevo mensaje del solicitante en " + ticket.getCodigo() + ": " + resumen);
            }
        } else {
            notificacionService.notificarPorEmail(ticket.getEmail(), ticket.getId(), "TICKET_MENSAJE",
                    "Nuevo mensaje de " + (autorNombre != null ? autorNombre : autorEmail)
                            + " en el ticket " + ticket.getCodigo() + ": " + resumen);
        }
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
        return monthlyStats(yearMonth, null);
    }

    public Map<String, Object> monthlyStats(LocalDateTime yearMonth, String requesterEmail) {
        LocalDateTime start = yearMonth.withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusMonths(1);
        String area = areaScope(requesterEmail);

        List<Ticket> created = ticketRepository.findByCreatedAtBetween(start, end).stream()
                .filter(t -> enArea(t, area)).toList();
        List<Ticket> resolved = ticketRepository.findByResolvedAtBetween(start, end).stream()
                .filter(t -> enArea(t, area)).toList();

        long resolvedOnTime = resolved.stream()
                .filter(t -> t.getSlaDueAt() != null && !t.getResolvedAt().isAfter(t.getSlaDueAt()))
                .count();

        double avgResolutionHours = resolved.stream()
                .filter(t -> t.getCreatedAt() != null)
                .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getResolvedAt()).toHours())
                .average()
                .orElse(0.0);

        Map<String, Object> monthly = new java.util.HashMap<>();
        monthly.put("created", created.size());
        monthly.put("resolved", resolved.size());
        monthly.put("resolvedOnTime", resolvedOnTime);
        monthly.put("resolvedLate", resolved.size() - resolvedOnTime);
        monthly.put("avgResolutionHours", Math.round(avgResolutionHours * 10.0) / 10.0);
        monthly.put("byStatus", area != null ? statusBreakdown(area) : statusBreakdown());
        monthly.put("byCategory", area != null ? categoryBreakdown(area) : categoryBreakdown());
        monthly.put("area", area);
        return monthly;
    }

    public Map<String, Object> summaryStats(LocalDateTime month) {
        return summaryStats(month, null);
    }

    public Map<String, Object> summaryStats(LocalDateTime month, String requesterEmail) {
        LocalDateTime start = month.withDayOfMonth(1).toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusMonths(1);
        LocalDateTime prevStart = start.minusMonths(1);
        LocalDateTime prevEnd = start;
        LocalDateTime now = LocalDateTime.now();
        String area = areaScope(requesterEmail);

        List<Ticket> all = ticketRepository.findAll().stream()
                .filter(t -> enArea(t, area)).toList();

        List<Ticket> active = all.stream()
                .filter(t -> t.getStatus() != EstadoTicket.RESOLVED && t.getStatus() != EstadoTicket.CLOSED)
                .toList();

        long activeTickets = active.size();
        long activePrev = activeCountAt(prevEnd, area);

        long nearSlaExpiry = active.stream()
                .filter(t -> t.getSlaDueAt() != null)
                .filter(t -> !t.getSlaDueAt().isBefore(now) && !t.getSlaDueAt().isAfter(now.plus(NEAR_SLA_WINDOW)))
                .count();

        long overdueSla = active.stream()
                .filter(t -> t.getSlaDueAt() != null && t.getSlaDueAt().isBefore(now))
                .count();

        List<Ticket> resolved = ticketRepository.findByResolvedAtBetween(start, end).stream()
                .filter(t -> enArea(t, area)).toList();
        List<Ticket> resolvedPrev = ticketRepository.findByResolvedAtBetween(prevStart, prevEnd).stream()
                .filter(t -> enArea(t, area)).toList();

        // SLA Compliance CORREGIDO: denominador = tickets evaluables (resueltos + vencidos activos)
        long resolvedOnTime = resolved.stream()
                .filter(t -> t.getSlaDueAt() != null && t.getResolvedAt() != null && !t.getResolvedAt().isAfter(t.getSlaDueAt()))
                .count();

        // Tickets evaluables en el periodo = resueltos en el mes + activos vencidos (overdue) en el mes
        long evaluables = resolved.size() + overdueSla;
        long evaluablesPrev = resolvedPrev.size() + countOverdueAt(prevEnd, area);

        long resolvedOnTimePrev = resolvedPrev.stream()
                .filter(t -> t.getSlaDueAt() != null && t.getResolvedAt() != null && !t.getResolvedAt().isAfter(t.getSlaDueAt()))
                .count();

        double compliance = evaluables == 0 ? 0.0 : round2(resolvedOnTime * 100.0 / evaluables);
        long overduePrev = countOverdueAt(prevEnd, area);
        long evaluablesPrevTotal = resolvedPrev.size() + overduePrev;
        double compliancePrev = evaluablesPrevTotal == 0 ? 0.0 : round2(resolvedOnTimePrev * 100.0 / evaluablesPrevTotal);

        List<Ticket> created = ticketRepository.findByCreatedAtBetween(start, end).stream()
                .filter(t -> enArea(t, area)).toList();
        List<Ticket> createdPrev = ticketRepository.findByCreatedAtBetween(prevStart, prevEnd).stream()
                .filter(t -> enArea(t, area)).toList();

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("area", area);
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

    private long countOverdueAt(LocalDateTime until) {
        return countOverdueAt(until, null);
    }

    private long countOverdueAt(LocalDateTime until, String area) {
        return ticketRepository.findAll().stream()
                .filter(t -> enArea(t, area))
                .filter(t -> t.getSlaDueAt() != null && t.getSlaDueAt().isBefore(until))
                .filter(t -> t.getStatus() != EstadoTicket.RESOLVED && t.getStatus() != EstadoTicket.CLOSED)
                .count();
    }

    private long activeCountAt(LocalDateTime until) {
        return activeCountAt(until, null);
    }

    private long activeCountAt(LocalDateTime until, String area) {
        return ticketRepository.findAll().stream()
                .filter(t -> enArea(t, area))
                .filter(t -> t.getCreatedAt() != null && !t.getCreatedAt().isAfter(until))
                .filter(t -> t.getResolvedAt() == null || t.getResolvedAt().isAfter(until))
                .filter(t -> t.getClosedAt() == null || t.getClosedAt().isAfter(until))
                .count();
    }

    private String areaScope(String email) {
        if (email == null) {
            return null;
        }
        return usuarioRepository.findByEmail(email)
                .filter(u -> u.getRole() == RolUsuario.SUPERVISOR)
                .map(Usuario::getArea)
                .filter(a -> a != null && !a.isBlank())
                .orElse(null);
    }

    private boolean enArea(Ticket t, String area) {
        return area == null || (t.getCategory() != null && t.getCategory().equalsIgnoreCase(area));
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private Map<String, Long> statusBreakdown() {
        return statusBreakdown(null);
    }

    private Map<String, Long> statusBreakdown(String area) {
        if (area == null) {
            return Map.of(
                    "SUBMITTED", ticketRepository.countByStatus(EstadoTicket.SUBMITTED.name()),
                    "CATEGORIZED", ticketRepository.countByStatus(EstadoTicket.CATEGORIZED.name()),
                    "PRIORITIZED", ticketRepository.countByStatus(EstadoTicket.PRIORITIZED.name()),
                    "ASSIGNED", ticketRepository.countByStatus(EstadoTicket.ASSIGNED.name()),
                    "PENDING_APPROVAL", ticketRepository.countByStatus(EstadoTicket.PENDING_APPROVAL.name()),
                    "APPROVED", ticketRepository.countByStatus(EstadoTicket.APPROVED.name()),
                    "IN_PROGRESS", ticketRepository.countByStatus(EstadoTicket.IN_PROGRESS.name()),
                    "ESCALATED", ticketRepository.countByStatus(EstadoTicket.ESCALATED.name()),
                    "RESOLVED", ticketRepository.countByStatus(EstadoTicket.RESOLVED.name()),
                    "CLOSED", ticketRepository.countByStatus(EstadoTicket.CLOSED.name())
            );
        }
        List<Ticket> scoped = ticketRepository.findAll().stream().filter(t -> enArea(t, area)).toList();
        Map<String, Long> result = new java.util.HashMap<>();
        for (EstadoTicket e : EstadoTicket.values()) {
            result.put(e.name(), scoped.stream().filter(t -> t.getStatus() == e).count());
        }
        return result;
    }

    private Map<String, Long> categoryBreakdown() {
        return categoryBreakdown(null);
    }

    private Map<String, Long> categoryBreakdown(String area) {
        List<Categoria> categories = categoriaRepository.findAll();
        Map<String, Long> result = new java.util.HashMap<>();
        for (Categoria category : categories) {
            if (area != null && !category.getCode().equalsIgnoreCase(area)) {
                continue;
            }
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