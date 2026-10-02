package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.Notificacion;
import java.util.List;
import java.util.UUID;

public interface NotificacionRepositoryPort {

    Notificacion save(Notificacion notificacion);

    List<Notificacion> findByUsuarioId(UUID usuarioId);

    List<Notificacion> findByUsuarioIdAndLeidaFalse(UUID usuarioId);

    void markLeida(UUID notificacionId, UUID usuarioId);

    void markAllLeidas(UUID usuarioId);

    long countNoLeidas(UUID usuarioId);

    boolean existsByUsuarioIdTicketAndTipo(UUID usuarioId, UUID ticketId, String tipo);
}