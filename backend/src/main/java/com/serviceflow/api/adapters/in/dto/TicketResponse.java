package com.serviceflow.api.adapters.in.dto;

import com.serviceflow.api.domain.Ticket;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketResponse(
        UUID id,
        String codigo,
        String email,
        String createdByName,
        String title,
        String category,
        String description,
        String priority,
        String status,
        boolean requiresApproval,
        UUID assignedTo,
        LocalDateTime slaDueAt,
        LocalDateTime resolvedAt,
        LocalDateTime closedAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TicketResponse from(Ticket ticket) {
        return from(ticket, null);
    }

    public static TicketResponse from(Ticket ticket, String createdByName) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getCodigo(),
                ticket.getEmail(),
                createdByName,
                ticket.getTitle(),
                ticket.getCategory(),
                ticket.getDescription(),
                ticket.getPriority().name(),
                ticket.getStatus().name(),
                ticket.isRequiresApproval(),
                ticket.getAssignedTo(),
                ticket.getSlaDueAt(),
                ticket.getResolvedAt(),
                ticket.getClosedAt(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}