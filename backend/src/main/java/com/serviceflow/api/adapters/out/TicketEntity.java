package com.serviceflow.api.adapters.out;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
public class TicketEntity {

    @Id
    private UUID id;

    @Column(name = "usuario_id")
    private UUID userId;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "categoria", nullable = false, length = 50)
    private String category;

    @Column(name = "descripcion", length = 255)
    private String description;

    @Column(name = "prioridad", nullable = false, length = 20)
    private String priority;

    @Column(name = "estado", nullable = false, length = 20)
    private String status;

    @Column(name = "requiere_aprobacion", nullable = false)
    private boolean requiresApproval;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime createdAt;

    public TicketEntity() {
    }

    public TicketEntity(UUID id, UUID userId, String email, String category, String description,
                        String priority, String status, boolean requiresApproval, LocalDateTime createdAt) {
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

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isRequiresApproval() { return requiresApproval; }
    public void setRequiresApproval(boolean requiresApproval) { this.requiresApproval = requiresApproval; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}