package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.ArticuloRepositoryPort;
import com.serviceflow.api.application.ports.ArticuloVotoRepositoryPort;
import com.serviceflow.api.domain.Articulo;
import com.serviceflow.api.domain.ArticuloVoto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ArticuloService {

    private final ArticuloRepositoryPort articuloRepository;
    private final ArticuloVotoRepositoryPort articuloVotoRepository;

    public ArticuloService(ArticuloRepositoryPort articuloRepository,
                           ArticuloVotoRepositoryPort articuloVotoRepository) {
        this.articuloRepository = articuloRepository;
        this.articuloVotoRepository = articuloVotoRepository;
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
                0L, 0L, 0L,
                true, null, null
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
                existing.getMegusta(),
                existing.getNomegusta(),
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
                existing.getMegusta(),
                existing.getNomegusta(),
                existing.isActivo(),
                existing.getCreatedAt(),
                LocalDateTime.now()
        ));
        return updated.getVisualizaciones();
    }

    public Articulo registrarVoto(UUID id, boolean megusta) {
        Articulo existing = articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"));
        long nuevoMegusta = existing.getMegusta() + (megusta ? 1 : 0);
        long nuevoNomegusta = existing.getNomegusta() + (megusta ? 0 : 1);
        Articulo updated = articuloRepository.save(new Articulo(
                existing.getId(),
                existing.getTitulo(),
                existing.getDescripcion(),
                existing.getContenido(),
                existing.getCategoria(),
                existing.getVisualizaciones(),
                nuevoMegusta,
                nuevoNomegusta,
                existing.isActivo(),
                existing.getCreatedAt(),
                LocalDateTime.now()
        ));
        return updated;
    }

    public double calcularSatisfaccion(Articulo articulo) {
        long total = articulo.getMegusta() + articulo.getNomegusta();
        if (total == 0) return 0.0;
        return (articulo.getMegusta() * 100.0) / total;
    }

    public int calcularTiempoLecturaMin(Articulo articulo) {
        if (articulo.getContenido() == null || articulo.getContenido().isBlank()) return 1;
        int palabras = articulo.getContenido().trim().split("\\s+").length;
        return Math.max(1, (int) Math.ceil(palabras / 200.0));
    }

    // --- Votos de usuario ---
    @Transactional
    public ArticuloVoto votar(UUID articuloId, UUID usuarioId, Boolean megusta) {
        if (megusta == null) {
            throw new IllegalArgumentException("megusta es requerido (true/false)");
        }
        Optional<ArticuloVoto> existente = articuloVotoRepository.findByArticuloIdAndUsuarioId(articuloId, usuarioId);
        if (existente.isPresent()) {
            ArticuloVoto v = existente.get();
            return articuloVotoRepository.save(new ArticuloVoto(
                    v.getId(), articuloId, usuarioId, megusta, v.getCreadoEn(), LocalDateTime.now()));
        }
        ArticuloVoto nuevo = new ArticuloVoto(
                null, articuloId, usuarioId, megusta, null, null
        );
        return articuloVotoRepository.save(nuevo);
    }

    public Optional<ArticuloVoto> obtenerVotoUsuario(UUID articuloId, UUID usuarioId) {
        return articuloVotoRepository.findByArticuloIdAndUsuarioId(articuloId, usuarioId);
    }

    public long contarMegusta(UUID articuloId) {
        return articuloVotoRepository.countMegusta(articuloId);
    }

    public long contarNoMegusta(UUID articuloId) {
        return articuloVotoRepository.countNoMegusta(articuloId);
    }

    @Transactional
    public void quitarVoto(UUID articuloId, UUID usuarioId) {
        articuloVotoRepository.deleteByArticuloIdAndUsuarioId(articuloId, usuarioId);
    }
}