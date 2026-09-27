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

    public List<Articulo> listInactive() {
        return articuloRepository.findAllInactive();
    }

    public Articulo findById(UUID id) {
        return articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"));
    }

    public Articulo create(String titulo, String descripcion, String contenido, String categoria) {
        return create(titulo, descripcion, contenido, categoria, null, null);
    }

    public Articulo create(String titulo, String descripcion, String contenido, String categoria,
                           java.util.Map<String, Object> layoutConfig) {
        return create(titulo, descripcion, contenido, categoria, layoutConfig, null);
    }

    public Articulo create(String titulo, String descripcion, String contenido, String categoria,
                           java.util.Map<String, Object> layoutConfig, Integer tiempoLecturaMin) {
        if (titulo == null || titulo.isBlank() || categoria == null || categoria.isBlank()) {
            throw new IllegalArgumentException("titulo and categoria are required");
        }
        return articuloRepository.save(new Articulo(
                null, titulo, descripcion, contenido, categoria, layoutConfig, tiempoLecturaMin,
                0L, 0L, 0L,
                true, null, null
        ));
    }

    public Articulo update(UUID id, String titulo, String descripcion, String contenido,
                           String categoria, Boolean activo) {
        return update(id, titulo, descripcion, contenido, categoria, activo, null, null);
    }

    public Articulo update(UUID id, String titulo, String descripcion, String contenido,
                           String categoria, Boolean activo,
                           java.util.Map<String, Object> layoutConfig) {
        return update(id, titulo, descripcion, contenido, categoria, activo, layoutConfig, null);
    }

    public Articulo update(UUID id, String titulo, String descripcion, String contenido,
                           String categoria, Boolean activo,
                           java.util.Map<String, Object> layoutConfig, Integer tiempoLecturaMin) {
        Articulo existing = articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"));
        return articuloRepository.save(new Articulo(
                existing.getId(),
                titulo != null && !titulo.isBlank() ? titulo : existing.getTitulo(),
                descripcion != null ? descripcion : existing.getDescripcion(),
                contenido != null ? contenido : existing.getContenido(),
                categoria != null && !categoria.isBlank() ? categoria : existing.getCategoria(),
                layoutConfig != null ? layoutConfig : existing.getLayoutConfig(),
                tiempoLecturaMin != null ? tiempoLecturaMin : existing.getTiempoLecturaMinGuardado(),
                existing.getVisualizaciones(),
                existing.getMegusta(),
                existing.getNomegusta(),
                activo != null ? activo : existing.isActivo(),
                existing.getCreatedAt(),
                LocalDateTime.now()
        ));
    }

    public void delete(UUID id) {
        articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"));
        articuloRepository.deleteById(id);
    }

    @Transactional
    public long registerView(UUID id) {
        articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"));
        articuloRepository.incrementarVisualizaciones(id);
        return articuloRepository.findById(id)
                .orElseThrow(() -> new ArticuloNotFoundException("Article not found"))
                .getVisualizaciones();
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
        ArticuloVoto guardado;
        if (existente.isPresent()) {
            ArticuloVoto v = existente.get();
            guardado = articuloVotoRepository.save(new ArticuloVoto(
                    v.getId(), articuloId, usuarioId, megusta, v.getCreadoEn(), LocalDateTime.now()));
        } else {
            ArticuloVoto nuevo = new ArticuloVoto(
                    null, articuloId, usuarioId, megusta, null, null
            );
            guardado = articuloVotoRepository.save(nuevo);
        }
        sincronizarContadores(articuloId);
        return guardado;
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
        sincronizarContadores(articuloId);
    }

    private void sincronizarContadores(UUID articuloId) {
        Articulo a = articuloRepository.findById(articuloId).orElse(null);
        if (a == null) {
            return;
        }
        articuloRepository.save(new Articulo(
                a.getId(), a.getTitulo(), a.getDescripcion(), a.getContenido(), a.getCategoria(),
                a.getLayoutConfig(), a.getTiempoLecturaMinGuardado(),
                a.getVisualizaciones(),
                articuloVotoRepository.countMegusta(articuloId),
                articuloVotoRepository.countNoMegusta(articuloId),
                a.isActivo(), a.getCreatedAt(), LocalDateTime.now()
        ));
    }
}