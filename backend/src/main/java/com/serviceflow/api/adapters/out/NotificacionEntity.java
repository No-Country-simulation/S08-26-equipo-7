package com.serviceflow.api.adapters.out;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notificaciones")
public class NotificacionEntity {

    @Id
    private UUID id;

    @Column(name = "usuario_id", nullable = false)
    private UUID usuarioId;

    @Column(name = "ticket_id")
    private UUID ticketId;

    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false, length = 255)
    private String mensaje;

    @Column(nullable = false)
    private boolean leida;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    public NotificacionEntity() {
    }

    public NotificacionEntity(UUID id, UUID usuarioId, UUID ticketId, String tipo, String mensaje,
                              boolean leida, LocalDateTime creadoEn) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.ticketId = ticketId;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.leida = leida;
        this.creadoEn = creadoEn;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }

    public UUID getTicketId() { return ticketId; }
    public void setTicketId(UUID ticketId) { this.ticketId = ticketId; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }

    public boolean isLeida() { return leida; }
    public void setLeida(boolean leida) { this.leida = leida; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}