package com.serviceflow.api.adapters.out;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class UsuarioEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private com.serviceflow.api.domain.RolUsuario rol;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    public UsuarioEntity() {
    }

    public UsuarioEntity(UUID id, String nombre, String email, String passwordHash, com.serviceflow.api.domain.RolUsuario rol, LocalDateTime creadoEn) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.passwordHash = passwordHash;
        this.rol = rol;
        this.creadoEn = creadoEn;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public com.serviceflow.api.domain.RolUsuario getRol() { return rol; }
    public void setRol(com.serviceflow.api.domain.RolUsuario rol) { this.rol = rol; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}