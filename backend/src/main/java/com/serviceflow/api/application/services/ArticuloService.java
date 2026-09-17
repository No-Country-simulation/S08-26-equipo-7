package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.ArticuloRepositoryPort;
import com.serviceflow.api.domain.Articulo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ArticuloService {

    private final ArticuloRepositoryPort articuloRepository;

    public ArticuloService(ArticuloRepositoryPort articuloRepository) {
        this.articuloRepository = articuloRepository;
    }

    public List<Articulo> listActive() {
        return articuloRepository.findAllActive();
    }

    public Articulo findById(UUID id) {
        return articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"));
    }

    public Articulo create(String titulo, String descripcion, String contenido, String categoria) {
        if (titulo == null || titulo.isBlank() || categoria == null || categoria.isBlank()) {
            throw new IllegalArgumentException("titulo and categoria are required");
        }
        return articuloRepository.save(new Articulo(
                null, titulo, descripcion, contenido, categoria,
                0L, true, null, null
        ));
    }

    public Articulo update(UUID id, String titulo, String descripcion, String contenido,
                           String categoria, Boolean activo) {
        Articulo existing = articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"));
        return articuloRepository.save(new Articulo(
                existing.getId(),
                titulo != null && !titulo.isBlank() ? titulo : existing.getTitulo(),
                descripcion != null ? descripcion : existing.getDescripcion(),
                contenido != null ? contenido : existing.getContenido(),
                categoria != null && !categoria.isBlank() ? categoria : existing.getCategoria(),
                existing.getVisualizaciones(),
                activo != null ? activo : existing.isActivo(),
                existing.getCreatedAt(),
                LocalDateTime.now()
        ));
    }

    public long registerView(UUID id) {
        Articulo existing = articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"));
        Articulo updated = articuloRepository.save(new Articulo(
                existing.getId(),
                existing.getTitulo(),
                existing.getDescripcion(),
                existing.getContenido(),
                existing.getCategoria(),
                existing.getVisualizaciones() + 1,
                existing.isActivo(),
                existing.getCreatedAt(),
                LocalDateTime.now()
        ));
        return updated.getVisualizaciones();
    }
}