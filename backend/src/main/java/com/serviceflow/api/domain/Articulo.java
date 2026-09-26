package com.serviceflow.api.domain;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public class Articulo {

    private final UUID id;
    private final String titulo;
    private final String descripcion;
    private final String contenido;
    private final String categoria;
    private final Map<String, Object> layoutConfig;
    private final long visualizaciones;
    private final long megusta;
    private final long nomegusta;
    private final boolean activo;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public Articulo(UUID id, String titulo, String descripcion, String contenido, String categoria,
                    long visualizaciones, long megusta, long nomegusta,
                    boolean activo, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this(id, titulo, descripcion, contenido, categoria, null,
                visualizaciones, megusta, nomegusta, activo, createdAt, updatedAt);
    }

    public Articulo(UUID id, String titulo, String descripcion, String contenido, String categoria,
                    Map<String, Object> layoutConfig,
                    long visualizaciones, long megusta, long nomegusta,
                    boolean activo, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.contenido = contenido;
        this.categoria = categoria;
        this.layoutConfig = layoutConfig;
        this.visualizaciones = visualizaciones;
        this.megusta = megusta;
        this.nomegusta = nomegusta;
        this.activo = activo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getDescripcion() { return descripcion; }
    public String getContenido() { return contenido; }
    public String getCategoria() { return categoria; }
    public Map<String, Object> getLayoutConfig() { return layoutConfig; }
    public long getVisualizaciones() { return visualizaciones; }
    public long getMegusta() { return megusta; }
    public long getNomegusta() { return nomegusta; }
    public boolean isActivo() { return activo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}