package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Ticket {

    private UUID id;
    private UUID userId;
    private String email;
    private CategoriaTicket category;
    private String description;
    private PrioridadTicket priority;
    private EstadoTicket status;
    private boolean requiresApproval;
    private UUID assignedTo;
    private LocalDateTime slaDueAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private LocalDateTime createdAt;

    public Ticket(UUID id, UUID userId, String email, CategoriaTicket category, String description,
                  PrioridadTicket priority, EstadoTicket status, boolean requiresApproval,
                  UUID assignedTo, LocalDateTime slaDueAt, LocalDateTime resolvedAt,
                  LocalDateTime closedAt, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.email = email;
        this.category = category;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.requiresApproval = requiresApproval;
        this.assignedTo = assignedTo;
        this.slaDueAt = slaDueAt;
        this.resolvedAt = resolvedAt;
        this.closedAt = closedAt;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public CategoriaTicket getCategory() { return category; }
    public void setCategory(CategoriaTicket category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PrioridadTicket getPriority() { return priority; }
    public void setPriority(PrioridadTicket priority) { this.priority = priority; }

    public EstadoTicket getStatus() { return status; }
    public void setStatus(EstadoTicket status) { this.status = status; }

    public boolean isRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(boolean requiresApproval) { this.requiresApproval = requiresApproval; }

    public UUID getAssignedTo() { return assignedTo; }
    public void setAssignedTo(UUID assignedTo) { this.assignedTo = assignedTo; }

    public LocalDateTime getSlaDueAt() { return slaDueAt; }
    public void setSlaDueAt(LocalDateTime slaDueAt) { this.slaDueAt = slaDueAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}