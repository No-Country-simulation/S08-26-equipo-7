package com.serviceflow.api.adapters.in.dto;

import com.serviceflow.api.domain.Articulo;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record ArticuloResponse(
        UUID id,
        String titulo,
        String descripcion,
        String contenido,
        String categoria,
        Map<String, Object> layoutConfig,
        long visualizaciones,
        long megusta,
        long nomegusta,
        double satisfaccion,
        int tiempoLecturaMin,
        boolean activo,
        LocalDateTime actualizadoEn
) {
    public static ArticuloResponse from(Articulo articulo) {
        long megusta = articulo.getMegusta();
        long nomegusta = articulo.getNomegusta();
        long total = megusta + nomegusta;
        double satisfaccion = total > 0 ? (megusta * 100.0) / total : 0.0;
        int palabras = articulo.getContenido() != null ? articulo.getContenido().trim().split("\\s+").length : 0;
        int tiempoLecturaMin = Math.max(1, (int) Math.ceil(palabras / 200.0));
        return new ArticuloResponse(
                articulo.getId(),
                articulo.getTitulo(),
                articulo.getDescripcion(),
                articulo.getContenido(),
                articulo.getCategoria(),
                articulo.getLayoutConfig() != null ? articulo.getLayoutConfig() : Map.of(),
                articulo.getVisualizaciones(),
                megusta,
                nomegusta,
                satisfaccion,
                tiempoLecturaMin,
                articulo.isActivo(),
                articulo.getUpdatedAt()
        );
    }
}