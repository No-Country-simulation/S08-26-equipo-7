package com.serviceflow.api.adapters.in.dto;

import com.serviceflow.api.domain.Categoria;

import java.util.UUID;

public record CategoriaResponse(
        UUID id,
        String code,
        String name,
        String description,
        boolean active,
        boolean requiresApproval
) {
    public static CategoriaResponse from(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getCode(),
                categoria.getName(),
                categoria.getDescription(),
                categoria.isActive(),
                categoria.isRequiresApproval()
        );
    }
}