package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class ArticuloVoto {

    private final UUID id;
    private final UUID articuloId;
    private final UUID usuarioId;
    private final Boolean megusta; // true = útil, false = no útil, null = sin voto
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;

    public ArticuloVoto(UUID id, UUID articuloId, UUID usuarioId, Boolean megusta,
                        LocalDateTime creadoEn, LocalDateTime actualizadoEn) {
        this.id = id;
        this.articuloId = articuloId;
        this.usuarioId = usuarioId;
        this.megusta = megusta;
        this.creadoEn = creadoEn;
        this.actualizadoEn = actualizadoEn;
    }

    public UUID getId() { return id; }
    public UUID getArticuloId() { return articuloId; }
    public UUID getUsuarioId() { return usuarioId; }
    public Boolean getMegusta() { return megusta; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
    public LocalDateTime getActualizadoEn() { return actualizadoEn; }
}