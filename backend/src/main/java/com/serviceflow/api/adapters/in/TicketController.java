package com.serviceflow.api.adapters.in;

import com.serviceflow.api.adapters.in.dto.TicketResponse;
import com.serviceflow.api.application.services.InvalidTransitionException;
import com.serviceflow.api.application.services.TicketNotFoundException;
import com.serviceflow.api.application.services.TicketService;
import com.serviceflow.api.application.services.UnauthorizedActionException;
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
        if (request.description() == null || request.description().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "description is required"));
        }
        Ticket ticket = ticketService.createForRequester(
                user.email(),
                request.description(),
                request.category() != null ? com.serviceflow.api.domain.CategoriaTicket.valueOf(request.category()) : null,
                request.priority() != null ? com.serviceflow.api.domain.PrioridadTicket.valueOf(request.priority()) : null,
                Boolean.TRUE.equals(request.requiresApproval())
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(TicketResponse.from(ticket));
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) String status,
                                  @RequestParam(required = false) String category,
                                  @RequestParam(required = false) String priority) {
        List<Ticket> all = ticketService.findAll();
        if (status != null) {
            all = all.stream().filter(t -> t.getStatus().name().equalsIgnoreCase(status)).toList();
        }
        if (category != null) {
            all = all.stream().filter(t -> t.getCategory().name().equalsIgnoreCase(category)).toList();
        }
        if (priority != null) {
            all = all.stream().filter(t -> t.getPriority().name().equalsIgnoreCase(priority)).toList();
        }
        return ResponseEntity.ok(all.stream().map(TicketResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable UUID id) {
        return safeGet(() -> TicketResponse.from(ticketService.findById(id)));
    }

    @PostMapping("/{id}/categorize")
    public ResponseEntity<?> categorize(@PathVariable UUID id, @RequestParam String category, Authentication auth) {
        return safeTransition(() -> ticketService.categorize(
                id, com.serviceflow.api.domain.CategoriaTicket.valueOf(category), role(auth)));
    }

    @PostMapping("/{id}/prioritize")
    public ResponseEntity<?> prioritize(@PathVariable UUID id, @RequestParam String priority, Authentication auth) {
        return safeTransition(() -> ticketService.prioritize(
                id, com.serviceflow.api.domain.PrioridadTicket.valueOf(priority), role(auth)));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assign(@PathVariable UUID id, @RequestParam String assignedTo, Authentication auth) {
        return safeTransition(() -> ticketService.assign(id, UUID.fromString(assignedTo), role(auth)));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable UUID id, Authentication auth) {
        return safeTransition(() -> ticketService.approve(id, role(auth)));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<?> start(@PathVariable UUID id, Authentication auth) {
        return safeTransition(() -> ticketService.start(id, role(auth)));
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<?> escalate(@PathVariable UUID id, Authentication auth) {
        return safeTransition(() -> ticketService.escalate(id, role(auth)));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<?> resolve(@PathVariable UUID id, Authentication auth) {
        return safeTransition(() -> ticketService.resolve(id, role(auth)));
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

    private RolUsuario role(Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        return RolUsuario.valueOf(user.role());
    }

    private ResponseEntity<?> safeTransition(Supplier<Ticket> action) {
        try {
            return ResponseEntity.ok(TicketResponse.from(action.get()));
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

    public record CreateTicketRequest(String description, String category, String priority, Boolean requiresApproval) {
    }
}