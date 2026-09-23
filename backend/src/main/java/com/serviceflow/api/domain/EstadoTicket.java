package com.serviceflow.api.domain;

import java.util.Map;

public enum EstadoTicket {
    SUBMITTED,
    CATEGORIZED,
    PRIORITIZED,
    ASSIGNED,
    PENDING_APPROVAL,
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
            PENDING_APPROVAL, GrupoEstado.EN_APROBACION,
            IN_PROGRESS,  GrupoEstado.EN_PROCESO,
            APPROVED,     GrupoEstado.EN_APROBACION,
            ESCALATED,    GrupoEstado.EXPIRADO,
            RESOLVED,     GrupoEstado.RESUELTO,
            CLOSED,       GrupoEstado.CERRADO
    );

    public GrupoEstado getGrupo() {
        return GRUPOS.getOrDefault(this, GrupoEstado.PENDIENTE);
    }
}