package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Categoria {

    private final UUID id;
    private final String code;
    private final String name;
    private final String description;
    private final boolean active;
    private final boolean requiresApproval;
    private final PrioridadTicket prioridadDefecto;
    private final LocalDateTime createdAt;

    public Categoria(UUID id, String code, String name, String description,
                     boolean active, boolean requiresApproval, LocalDateTime createdAt) {
        this(id, code, name, description, active, requiresApproval, PrioridadTicket.MEDIUM, createdAt);
    }

    public Categoria(UUID id, String code, String name, String description,
                     boolean active, boolean requiresApproval, PrioridadTicket prioridadDefecto,
                     LocalDateTime createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.active = active;
        this.requiresApproval = requiresApproval;
        this.prioridadDefecto = prioridadDefecto;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public boolean isActive() { return active; }
    public boolean isRequiresApproval() { return requiresApproval; }
    public PrioridadTicket getPrioridadDefecto() { return prioridadDefecto; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}