package com.serviceflow.api.adapters.out;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "categorias")
public class CategoriaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "requires_approval", nullable = false)
    private boolean requiresApproval;

    @Column(name = "prioridad_defecto", nullable = false, length = 20)
    private String prioridadDefecto;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime createdAt;

    public CategoriaEntity() {
    }

    public CategoriaEntity(UUID id, String code, String name, String description,
                           boolean active, boolean requiresApproval, LocalDateTime createdAt) {
        this(id, code, name, description, active, requiresApproval, "MEDIUM", createdAt);
    }

    public CategoriaEntity(UUID id, String code, String name, String description,
                           boolean active, boolean requiresApproval, String prioridadDefecto,
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
    public void setId(UUID id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public boolean isRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(boolean requiresApproval) { this.requiresApproval = requiresApproval; }

    public String getPrioridadDefecto() { return prioridadDefecto; }
    public void setPrioridadDefecto(String prioridadDefecto) { this.prioridadDefecto = prioridadDefecto; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}