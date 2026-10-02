package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketEvento(
        UUID id,
        UUID ticketId,
        String tipo,
        String descripcion,
        String actorEmail,
        String actorNombre,
        LocalDateTime fecha
) {
    public static TicketEvento nuevo(UUID ticketId, String tipo, String descripcion,
                                     String actorEmail, String actorNombre) {
        return new TicketEvento(null, ticketId, tipo, descripcion, actorEmail, actorNombre, LocalDateTime.now());
    }
}