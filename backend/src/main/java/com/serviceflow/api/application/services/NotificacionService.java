package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.NotificacionRepositoryPort;
import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.domain.Notificacion;
import com.serviceflow.api.domain.RolUsuario;
import com.serviceflow.api.domain.Usuario;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificacionService {

    private final NotificacionRepositoryPort notificacionRepository;
    private final UsuarioRepositoryPort usuarioRepository;

    public NotificacionService(NotificacionRepositoryPort notificacionRepository,
                               UsuarioRepositoryPort usuarioRepository) {
        this.notificacionRepository = notificacionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public void notificar(UUID usuarioId, UUID ticketId, String tipo, String mensaje) {
        if (usuarioId == null) {
            return;
        }
        notificacionRepository.save(Notificacion.nueva(usuarioId, ticketId, tipo, mensaje));
    }

    public void notificarSinDuplicar(UUID usuarioId, UUID ticketId, String tipo, String mensaje) {
        if (usuarioId == null) {
            return;
        }
        if (notificacionRepository.existsByUsuarioIdTicketAndTipo(usuarioId, ticketId, tipo)) {
            return;
        }
        notificar(usuarioId, ticketId, tipo, mensaje);
    }

    public void notificarPorEmail(String email, UUID ticketId, String tipo, String mensaje) {
        if (email == null || email.isBlank()) {
            return;
        }
        usuarioRepository.findByEmail(email).ifPresent(u -> notificar(u.getId(), ticketId, tipo, mensaje));
    }

    public void notificarSupervisores(UUID ticketId, String tipo, String mensaje) {
        List<Usuario> supervisores = usuarioRepository.findByRole(RolUsuario.SUPERVISOR);
        List<Usuario> admins = usuarioRepository.findByRole(RolUsuario.ADMIN);
        java.util.LinkedHashSet<UUID> destinatarios = new java.util.LinkedHashSet<>();
        for (Usuario u : supervisores) {
            destinatarios.add(u.getId());
        }
        for (Usuario u : admins) {
            destinatarios.add(u.getId());
        }
        for (UUID id : destinatarios) {
            notificar(id, ticketId, tipo, mensaje);
        }
    }

    public List<Notificacion> listByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(u -> notificacionRepository.findByUsuarioId(u.getId()))
                .orElse(List.of());
    }

    public long countNoLeidasByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .map(u -> notificacionRepository.countNoLeidas(u.getId()))
                .orElse(0L);
    }

    public void marcarLeida(UUID notificacionId, String email) {
        usuarioRepository.findByEmail(email)
                .ifPresent(u -> notificacionRepository.markLeida(notificacionId, u.getId()));
    }

    public void marcarTodasLeidas(String email) {
        usuarioRepository.findByEmail(email)
                .ifPresent(u -> notificacionRepository.markAllLeidas(u.getId()));
    }
}