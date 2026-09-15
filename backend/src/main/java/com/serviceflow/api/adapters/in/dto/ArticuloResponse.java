package com.serviceflow.api.adapters.in.dto;

import com.serviceflow.api.domain.Articulo;

import java.util.UUID;

public record ArticuloResponse(
        UUID id,
        String titulo,
        String descripcion,
        String contenido,
        String categoria,
        long visualizaciones,
        boolean activo
) {
    public static ArticuloResponse from(Articulo articulo) {
        return new ArticuloResponse(
                articulo.getId(),
                articulo.getTitulo(),
                articulo.getDescripcion(),
                articulo.getContenido(),
                articulo.getCategoria(),
                articulo.getVisualizaciones(),
                articulo.isActivo()
        );
    }
}