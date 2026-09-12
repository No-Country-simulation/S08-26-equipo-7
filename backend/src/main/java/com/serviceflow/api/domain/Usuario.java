package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Usuario {

    private final UUID id;
    private final String name;
    private final String email;
    private final String passwordHash;
    private final RolUsuario role;
    private final LocalDateTime createdAt;

    public Usuario(UUID id, String name, String email, String passwordHash, RolUsuario role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public RolUsuario getRole() {
        return role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}