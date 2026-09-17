package com.serviceflow.api.adapters.in.dto;

import com.serviceflow.api.domain.TicketEvento;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketEventoResponse(
        UUID id,
        UUID ticketId,
        String tipo,
        String descripcion,
        String actorEmail,
        String actorNombre,
        LocalDateTime fecha
) {
    public static TicketEventoResponse from(TicketEvento e) {
        return new TicketEventoResponse(
                e.id(),
                e.ticketId(),
                e.tipo(),
                e.descripcion(),
                e.actorEmail(),
                e.actorNombre(),
                e.fecha()
        );
    }
}