package com.serviceflow.api.adapters.out;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "articulos")
public class ArticuloEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(length = 500)
    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false, length = 50)
    private String categoria;

    @Column(nullable = false)
    private long visualizaciones;

    @Column(nullable = false)
    private boolean activo;

    @Column(name = "creado_en", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime updatedAt;

    public ArticuloEntity() {
    }

    public ArticuloEntity(UUID id, String titulo, String descripcion, String contenido, String categoria,
                          long visualizaciones, boolean activo, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.contenido = contenido;
        this.categoria = categoria;
        this.visualizaciones = visualizaciones;
        this.activo = activo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public long getVisualizaciones() { return visualizaciones; }
    public void setVisualizaciones(long visualizaciones) { this.visualizaciones = visualizaciones; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}