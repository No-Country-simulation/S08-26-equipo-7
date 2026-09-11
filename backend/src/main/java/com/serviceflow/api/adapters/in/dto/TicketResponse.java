package com.serviceflow.api.adapters.in.dto;

import com.serviceflow.api.domain.Ticket;

import java.time.LocalDateTime;
import java.util.UUID;

public record TicketResponse(
        UUID id,
        String email,
        String category,
        String description,
        String priority,
        String status,
        boolean requiresApproval,
        UUID assignedTo,
        LocalDateTime slaDueAt,
        LocalDateTime resolvedAt,
        LocalDateTime closedAt,
        LocalDateTime createdAt
) {
    public static TicketResponse from(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getEmail(),
                ticket.getCategory().name(),
                ticket.getDescription(),
                ticket.getPriority().name(),
                ticket.getStatus().name(),
                ticket.isRequiresApproval(),
                ticket.getAssignedTo(),
                ticket.getSlaDueAt(),
                ticket.getResolvedAt(),
                ticket.getClosedAt(),
                ticket.getCreatedAt()
        );
    }
}