package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Usuario {

    private UUID id;
    private String nombre;
    private String email;
    private String passwordHash;
    private RolUsuario rol;
    private LocalDateTime creadoEn;

    public Usuario(UUID id, String nombre, String email, String passwordHash, RolUsuario rol, LocalDateTime creadoEn) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.passwordHash = passwordHash;
        this.rol = rol;
        this.creadoEn = creadoEn;
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public RolUsuario getRol() {
        return rol;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }
}