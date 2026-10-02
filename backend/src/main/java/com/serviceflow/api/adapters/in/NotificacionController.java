package com.serviceflow.api.adapters.in;

import com.serviceflow.api.application.services.NotificacionService;
import com.serviceflow.api.domain.Notificacion;
import com.serviceflow.api.infrastructure.security.UsuarioAutenticado;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @GetMapping
    public ResponseEntity<?> list(Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        List<Notificacion> notificaciones = notificacionService.listByEmail(user.email());
        return ResponseEntity.ok(Map.of(
                "items", notificaciones,
                "unread", notificacionService.countNoLeidasByEmail(user.email())
        ));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        return ResponseEntity.ok(Map.of("unread", notificacionService.countNoLeidasByEmail(user.email())));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable UUID id, Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        notificacionService.marcarLeida(id, user.email());
        return ResponseEntity.ok(Map.of("message", "Notificación marcada como leída"));
    }

    @PostMapping("/read-all")
    public ResponseEntity<?> markAllRead(Authentication auth) {
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        notificacionService.marcarTodasLeidas(user.email());
        return ResponseEntity.ok(Map.of("message", "Todas las notificaciones marcadas como leídas"));
    }
}