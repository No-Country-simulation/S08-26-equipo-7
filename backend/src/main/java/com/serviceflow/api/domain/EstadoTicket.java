package com.serviceflow.api.domain;

import java.util.Map;

public enum EstadoTicket {
    SUBMITTED,
    CATEGORIZED,
    PRIORITIZED,
    ASSIGNED,
    APPROVED,
    IN_PROGRESS,
    ESCALATED,
    RESOLVED,
    CLOSED;

    private static final Map<EstadoTicket, GrupoEstado> GRUPOS = Map.of(
            SUBMITTED,    GrupoEstado.PENDIENTE,
            CATEGORIZED,  GrupoEstado.PENDIENTE,
            PRIORITIZED,  GrupoEstado.PENDIENTE,
            ASSIGNED,     GrupoEstado.EN_PROCESO,
            IN_PROGRESS,  GrupoEstado.EN_PROCESO,
            APPROVED,     GrupoEstado.EN_APROBACION,
            ESCALATED,    GrupoEstado.EXPIRADO,
            RESOLVED,     GrupoEstado.RESUELTO,
            CLOSED,       GrupoEstado.RESUELTO
    );

    public GrupoEstado getGrupo() {
        return GRUPOS.getOrDefault(this, GrupoEstado.PENDIENTE);
    }
}