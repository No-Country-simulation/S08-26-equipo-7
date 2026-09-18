package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public record Notificacion(
        UUID id,
        UUID usuarioId,
        UUID ticketId,
        String tipo,
        String mensaje,
        boolean leida,
        LocalDateTime creadoEn
) {
    public static Notificacion nueva(UUID usuarioId, UUID ticketId, String tipo, String mensaje) {
        return new Notificacion(null, usuarioId, ticketId, tipo, mensaje, false, LocalDateTime.now());
    }
}