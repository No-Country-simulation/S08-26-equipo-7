package com.serviceflow.api.adapters.out;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ticket_eventos")
public class TicketEventoEntity {

    @Id
    private UUID id;

    @Column(name = "ticket_id", nullable = false)
    private UUID ticketId;

    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(name = "actor_email", length = 150)
    private String actorEmail;

    @Column(name = "actor_nombre", length = 100)
    private String actorNombre;

    @Column(nullable = false)
    private LocalDateTime fecha;

    public TicketEventoEntity() {
    }

    public TicketEventoEntity(UUID id, UUID ticketId, String tipo, String descripcion,
                              String actorEmail, String actorNombre, LocalDateTime fecha) {
        this.id = id;
        this.ticketId = ticketId;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.actorEmail = actorEmail;
        this.actorNombre = actorNombre;
        this.fecha = fecha;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getTicketId() { return ticketId; }
    public void setTicketId(UUID ticketId) { this.ticketId = ticketId; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getActorNombre() { return actorNombre; }
    public void setActorNombre(String actorNombre) { this.actorNombre = actorNombre; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
}