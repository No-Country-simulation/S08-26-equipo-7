package com.serviceflow.api.adapters.in;

import com.serviceflow.api.adapters.in.dto.ArticuloResponse;
import com.serviceflow.api.application.services.ArticuloNotFoundException;
import com.serviceflow.api.application.services.ArticuloService;
import com.serviceflow.api.domain.Articulo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/knowledge")
public class ArticuloController {

    private final ArticuloService articuloService;

    public ArticuloController(ArticuloService articuloService) {
        this.articuloService = articuloService;
    }

    @GetMapping
    public ResponseEntity<?> listActive() {
        List<ArticuloResponse> response = articuloService.listActive().stream()
                .map(ArticuloResponse::from).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(ArticuloResponse.from(articuloService.findById(id)));
        } catch (ArticuloNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> registerView(@PathVariable UUID id) {
        try {
            long views = articuloService.registerView(id);
            return ResponseEntity.ok(Map.of("id", id.toString(), "visualizaciones", views));
        } catch (ArticuloNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateArticleRequest request) {
        try {
            Articulo created = articuloService.create(
                    request.titulo(), request.descripcion(), request.contenido(), request.categoria()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(ArticuloResponse.from(created));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody UpdateArticleRequest request) {
        try {
            Articulo updated = articuloService.update(
                    id, request.titulo(), request.descripcion(), request.contenido(),
                    request.categoria(), request.activo()
            );
            return ResponseEntity.ok(ArticuloResponse.from(updated));
        } catch (ArticuloNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    public record CreateArticleRequest(String titulo, String descripcion, String contenido, String categoria) {
    }

    public record UpdateArticleRequest(String titulo, String descripcion, String contenido,
                                       String categoria, Boolean activo) {
    }
}