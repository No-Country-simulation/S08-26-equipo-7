package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Ticket {

    private final UUID id;
    private final UUID userId;
    private final String email;
    private final CategoriaTicket category;
    private final String description;
    private final PrioridadTicket priority;
    private final EstadoTicket status;
    private final boolean requiresApproval;
    private final LocalDateTime createdAt;

    public Ticket(UUID id, UUID userId, String email, CategoriaTicket category, String description,
                  PrioridadTicket priority, EstadoTicket status, boolean requiresApproval, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.email = email;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.requiresApproval = requiresApproval;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public CategoriaTicket getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public PrioridadTicket getPriority() {
        return priority;
    }

    public EstadoTicket getStatus() {
        return status;
    }

    public boolean isRequiresApproval() {
        return requiresApproval;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}