package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketMensaje(
        UUID id,
        UUID ticketId,
        String autorEmail,
        String autorNombre,
        String mensaje,
        LocalDateTime creadoEn
) {
    public static TicketMensaje nuevo(UUID ticketId, String autorEmail, String autorNombre, String mensaje) {
        return new TicketMensaje(null, ticketId, autorEmail, autorNombre, mensaje, LocalDateTime.now());
    }
}