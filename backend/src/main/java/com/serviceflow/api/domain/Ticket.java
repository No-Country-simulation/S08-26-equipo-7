package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Ticket {

    private UUID id;
    private UUID usuarioId;
    private String email;
    private CategoriaTicket categoria;
    private String descripcion;
    private PrioridadTicket prioridad;
    private EstadoTicket estado;
    private boolean requiereAprobacion;
    private LocalDateTime creadoEn;

    public Ticket(UUID id, UUID usuarioId, String email, CategoriaTicket categoria, String descripcion,
                  PrioridadTicket prioridad, EstadoTicket estado, boolean requiereAprobacion, LocalDateTime creadoEn) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.email = email;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.estado = estado;
        this.requiereAprobacion = requiereAprobacion;
        this.creadoEn = creadoEn;
    }

    public UUID getId() {
        return id;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public String getEmail() {
        return email;
    }

    public CategoriaTicket getCategoria() {
        return categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public PrioridadTicket getPrioridad() {
        return prioridad;
    }

    public EstadoTicket getEstado() {
        return estado;
    }

    public boolean isRequiereAprobacion() {
        return requiereAprobacion;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }
}