package com.serviceflow.api.adapters.in;

import com.serviceflow.api.application.services.InvalidTransitionException;
import com.serviceflow.api.application.services.TicketNotFoundException;
import com.serviceflow.api.application.services.TicketService;
import com.serviceflow.api.application.services.UnauthorizedActionException;
import com.serviceflow.api.domain.EstadoTicket;
import com.serviceflow.api.domain.RolUsuario;
import com.serviceflow.api.domain.Ticket;
import com.serviceflow.api.infrastructure.security.UsuarioAutenticado;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateTicketRequest request, Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        if (request.title() == null || request.title().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "title is required"));
        }
        if (request.description() == null || request.description().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "description is required"));
        }
        if (request.category() == null || request.category().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "category is required"));
        }
        Ticket ticket;
        try {
            ticket = ticketService.createForRequester(
                    user.email(),
                    request.title().trim(),
                    request.description().trim(),
                    request.category().trim()
            );
        } catch (InvalidTransitionException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.toResponse(ticket));
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) Boolean active,
                                  @RequestParam(required = false) String status,
                                  @RequestParam(required = false) String group,
                                  @RequestParam(required = false) String category,
                                  @RequestParam(required = false) String priority,
                                  @RequestParam(required = false) String search,
                                  @RequestParam(required = false) String q,
                                  @RequestParam(required = false) String sort,
                                  @RequestParam(required = false) Integer limit,
                                  @RequestParam(required = false) Integer offset) {
        List<Ticket> all = ticketService.findAllWithNames().stream()
                .map(TicketService.TicketSearchData::ticket)
                .toList();
        boolean onlyActive = active != null
                ? active
                : status == null && group == null;
        if (onlyActive) {
            all = all.stream()
                    .filter(t -> t.getStatus() != EstadoTicket.RESOLVED && t.getStatus() != EstadoTicket.CLOSED)
                    .toList();
        }
        if (status != null) {
            all = all.stream().filter(t -> t.getStatus().name().equalsIgnoreCase(status)).toList();
        }
        if (group != null) {
            all = all.stream().filter(t -> t.getStatus().getGrupo().name().equalsIgnoreCase(group)).toList();
        }
        if (category != null) {
            all = all.stream().filter(t -> t.getCategory() != null && t.getCategory().equalsIgnoreCase(category)).toList();
        }
        if (priority != null) {
            all = all.stream().filter(t -> t.getPriority().name().equalsIgnoreCase(priority)).toList();
        }
        String term = search != null ? search : q;
        if (term != null && !term.isBlank()) {
            String needle = term.trim().toLowerCase();
            List<TicketService.TicketSearchData> allData = ticketService.findAllWithNames();
            java.util.Set<UUID> matches = allData.stream()
                    .filter(d -> matches(d, needle))
                    .map(d -> d.ticket().getId())
                    .collect(java.util.stream.Collectors.toSet());
            all = all.stream().filter(t -> matches.contains(t.getId())).toList();
        }
        all = new java.util.ArrayList<>(all);
        boolean asc = "asc".equalsIgnoreCase(sort);
        if (sort != null) {
            java.util.Comparator<Ticket> byUpdated = java.util.Comparator.comparing(
                    Ticket::getUpdatedAt, java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()));
            all.sort(asc ? byUpdated : byUpdated.reversed());
        }
        long total = all.size();
        List<Ticket> page = all;
        if (limit != null || offset != null) {
            int start = offset != null ? Math.max(0, offset) : 0;
            int end = limit != null ? start + Math.max(1, limit) : all.size();
            page = all.subList(Math.min(start, all.size()), Math.min(end, all.size()));
            Map<String, Object> body = new java.util.HashMap<>();
            body.put("total", total);
            body.put("offset", offset != null ? offset : 0);
            body.put("limit", limit);
            body.put("sort", sort != null ? sort : "desc");
            body.put("items", page.stream().map(ticketService::toResponse).toList());
            return ResponseEntity.ok(body);
        }
        return ResponseEntity.ok(all.stream().map(ticketService::toResponse).toList());
    }

    @GetMapping("/meta/groups")
    public ResponseEntity<?> groups() {
        return ResponseEntity.ok(java.util.Arrays.stream(com.serviceflow.api.domain.GrupoEstado.values())
                .map(g -> {
                    java.util.List<String> estados = java.util.Arrays.stream(com.serviceflow.api.domain.EstadoTicket.values())
                            .filter(e -> e.getGrupo() == g)
                            .map(Enum::name)
                            .toList();
                    return java.util.Map.of(
                            "name", g.name(),
                            "label", label(g),
                            "states", estados
                    );
                })
                .toList());
    }

    @GetMapping("/meta/priorities")
    public ResponseEntity<?> priorities() {
        return ResponseEntity.ok(java.util.Arrays.stream(com.serviceflow.api.domain.PrioridadTicket.values())
                .map(p -> java.util.Map.of("name", p.name(), "label", label(p)))
                .toList());
    }

    private String label(com.serviceflow.api.domain.GrupoEstado g) {
        return switch (g) {
            case PENDIENTE -> "Pendiente";
            case EN_PROCESO -> "En proceso";
            case EN_APROBACION -> "En aprobación";
            case EXPIRADO -> "Expirado";
            case RESUELTO -> "Resuelto";
        };
    }

    private String label(com.serviceflow.api.domain.PrioridadTicket p) {
        return switch (p) {
            case LOW -> "Baja";
            case MEDIUM -> "Media";
            case HIGH -> "Alta";
            case URGENT -> "Urgente";
        };
    }

    private boolean matches(TicketService.TicketSearchData d, String needle) {
        Ticket t = d.ticket();
        boolean codigo = t.getCodigo() != null && t.getCodigo().toLowerCase().contains(needle);
        boolean title = t.getTitle() != null && t.getTitle().toLowerCase().contains(needle);
        boolean id = t.getId() != null && t.getId().toString().toLowerCase().contains(needle);
        boolean creator = d.createdByName() != null && d.createdByName().toLowerCase().contains(needle);
        boolean assignee = d.assignedToName() != null && d.assignedToName().toLowerCase().contains(needle);
        return codigo || title || id || creator || assignee;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable UUID id) {
        return safeGet(() -> ticketService.toResponse(ticketService.findById(id)));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<?> timeline(@PathVariable UUID id, Authentication auth) {
        return safeGet(() -> ticketService.timeline(id));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<?> messages(@PathVariable UUID id) {
        return safeGet(() -> ticketService.mensajes(id));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<?> addMessage(@PathVariable UUID id, @RequestBody MessageRequest request, Authentication auth) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ticketService.agregarMensaje(id, email(auth), request.message()));
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (InvalidTransitionException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/categorize")
    public ResponseEntity<?> categorize(@PathVariable UUID id, @RequestParam String category, Authentication auth) {
        return safeTransition(() -> ticketService.categorize(id, category, role(auth), email(auth)));
    }

    @PostMapping("/{id}/prioritize")
    public ResponseEntity<?> prioritize(@PathVariable UUID id, @RequestParam String priority, Authentication auth) {
        return safeTransition(() -> ticketService.prioritize(
                id, com.serviceflow.api.domain.PrioridadTicket.valueOf(priority), role(auth), email(auth)));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assign(@PathVariable UUID id, @RequestParam String assignedTo, Authentication auth) {
        return safeTransition(() -> ticketService.assign(id, UUID.fromString(assignedTo), role(auth), email(auth)));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable UUID id, Authentication auth) {
        return safeTransition(() -> ticketService.approve(id, role(auth), email(auth)));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<?> start(@PathVariable UUID id, Authentication auth) {
        return safeTransition(() -> ticketService.start(id, role(auth), email(auth)));
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<?> escalate(@PathVariable UUID id, Authentication auth) {
        return safeTransition(() -> ticketService.escalate(id, role(auth), email(auth)));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> resolve(@PathVariable UUID id, Authentication auth) {
        return safeTransition(() -> ticketService.resolve(id, role(auth), email(auth)));
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<?> close(@PathVariable UUID id, Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        return safeTransition(() -> ticketService.close(id, role(auth), user.email()));
    }

    @GetMapping("/stats/monthly")
    public ResponseEntity<?> monthly(@RequestParam(required = false) String month) {
        LocalDateTime input = month != null
                ? LocalDate.parse(month + "-01").atStartOfDay()
                : LocalDateTime.now();
        return ResponseEntity.ok(ticketService.monthlyStats(input));
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<?> summary(@RequestParam(required = false) String month) {
        LocalDateTime input = month != null
                ? LocalDate.parse(month + "-01").atStartOfDay()
                : LocalDateTime.now();
        return ResponseEntity.ok(ticketService.summaryStats(input));
    }

    private RolUsuario role(Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        return RolUsuario.valueOf(user.role());
    }

    private String email(Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        return user.email();
    }

    private ResponseEntity<?> safeTransition(Supplier<Ticket> action) {
        try {
            return ResponseEntity.ok(ticketService.toResponse(action.get()));
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (InvalidTransitionException | UnauthorizedActionException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    private ResponseEntity<?> safeGet(Supplier<Object> action) {
        try {
            return ResponseEntity.ok(action.get());
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    public record CreateTicketRequest(String title, String description, String category) {
    }

    public record MessageRequest(String message) {
    }
}