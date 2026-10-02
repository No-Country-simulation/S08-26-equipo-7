package com.serviceflow.api.adapters.out;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "articulo_votos", uniqueConstraints = @UniqueConstraint(name = "uk_articulo_usuario_voto", columnNames = {"articulo_id", "usuario_id"}))
public class ArticuloVotoEntity {

    @Id
    private UUID id;

    @Column(name = "articulo_id", nullable = false)
    private UUID articuloId;

    @Column(name = "usuario_id", nullable = false)
    private UUID usuarioId;

    @Column(name = "megusta", nullable = false)
    private Boolean megusta;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;

    public ArticuloVotoEntity() {}

    public ArticuloVotoEntity(UUID id, UUID articuloId, UUID usuarioId, Boolean megusta,
                              LocalDateTime creadoEn, LocalDateTime actualizadoEn) {
        this.id = id;
        this.articuloId = articuloId;
        this.usuarioId = usuarioId;
        this.megusta = megusta;
        this.creadoEn = creadoEn;
        this.actualizadoEn = actualizadoEn;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getArticuloId() { return articuloId; }
    public void setArticuloId(UUID articuloId) { this.articuloId = articuloId; }

    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }

    public Boolean getMegusta() { return megusta; }
    public void setMegusta(Boolean megusta) { this.megusta = megusta; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }

    public LocalDateTime getActualizadoEn() { return actualizadoEn; }
    public void setActualizadoEn(LocalDateTime actualizadoEn) { this.actualizadoEn = actualizadoEn; }
}