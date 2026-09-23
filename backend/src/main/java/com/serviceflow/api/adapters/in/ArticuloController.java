package com.serviceflow.api.adapters.in;

import com.serviceflow.api.adapters.in.dto.ArticuloResponse;
import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.application.services.ArticuloNotFoundException;
import com.serviceflow.api.application.services.ArticuloService;
import com.serviceflow.api.domain.Articulo;
import com.serviceflow.api.domain.ArticuloVoto;
import com.serviceflow.api.domain.Usuario;
import com.serviceflow.api.infrastructure.security.UsuarioAutenticado;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/knowledge")
public class ArticuloController {

    private final ArticuloService articuloService;
    private final UsuarioRepositoryPort usuarioRepository;

    public ArticuloController(ArticuloService articuloService, UsuarioRepositoryPort usuarioRepository) {
        this.articuloService = articuloService;
        this.usuarioRepository = usuarioRepository;
    }

    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return null;
        }
        UsuarioAutenticado user = (UsuarioAutenticado) auth.getPrincipal();
        return usuarioRepository.findByEmail(user.email()).map(Usuario::getId).orElse(null);
    }

    private int tiempoLecturaMin(UUID id) {
        try {
            Articulo articulo = articuloService.findById(id);
            String contenido = articulo.getContenido();
            int palabras = contenido != null && !contenido.isBlank() ? contenido.trim().split("\\s+").length : 0;
            return Math.max(1, (int) Math.ceil(palabras / 200.0));
        } catch (ArticuloNotFoundException e) {
            return 1;
        }
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

    @PostMapping("/{id}/votar")
    public ResponseEntity<?> votar(@PathVariable UUID id, @RequestBody VotarRequest request) {
        try {
            UUID usuarioId = getCurrentUserId();
            if (usuarioId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuario no autenticado"));
            }
            ArticuloVoto voto = articuloService.votar(id, usuarioId, request.megusta());
            long megusta = articuloService.contarMegusta(id);
            long nomegusta = articuloService.contarNoMegusta(id);
            double satisfaccion = megusta + nomegusta > 0 ? (megusta * 100.0) / (megusta + nomegusta) : 0.0;
            return ResponseEntity.ok(Map.of(
                    "id", id.toString(),
                    "megusta", megusta,
                    "nomegusta", nomegusta,
                    "satisfaccion", Math.round(satisfaccion * 100.0) / 100.0,
                    "tiempoLecturaMin", tiempoLecturaMin(id),
                    "miVoto", request.megusta()
            ));
        } catch (ArticuloNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/mi-voto")
    public ResponseEntity<?> miVoto(@PathVariable UUID id) {
        try {
            UUID usuarioId = getCurrentUserId();
            if (usuarioId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuario no autenticado"));
            }
            Optional<ArticuloVoto> voto = articuloService.obtenerVotoUsuario(id, usuarioId);
            long megusta = articuloService.contarMegusta(id);
            long nomegusta = articuloService.contarNoMegusta(id);
            double satisfaccion = megusta + nomegusta > 0 ? (megusta * 100.0) / (megusta + nomegusta) : 0.0;
            Map<String, Object> body = new java.util.HashMap<>();
            body.put("articuloId", id.toString());
            body.put("megusta", voto.map(ArticuloVoto::getMegusta).orElse(null));
            body.put("satisfaccion", Math.round(satisfaccion * 100.0) / 100.0);
            body.put("tiempoLecturaMin", tiempoLecturaMin(id));
            return ResponseEntity.ok(body);
        } catch (ArticuloNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/votar")
    public ResponseEntity<?> quitarVoto(@PathVariable UUID id) {
        try {
            UUID usuarioId = getCurrentUserId();
            if (usuarioId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuario no autenticado"));
            }
            articuloService.quitarVoto(id, usuarioId);
            long megusta = articuloService.contarMegusta(id);
            long nomegusta = articuloService.contarNoMegusta(id);
            double satisfaccion = megusta + nomegusta > 0 ? (megusta * 100.0) / (megusta + nomegusta) : 0.0;
            Map<String, Object> body = new java.util.HashMap<>();
            body.put("id", id.toString());
            body.put("megusta", megusta);
            body.put("nomegusta", nomegusta);
            body.put("satisfaccion", Math.round(satisfaccion * 100.0) / 100.0);
            body.put("tiempoLecturaMin", tiempoLecturaMin(id));
            body.put("miVoto", null);
            return ResponseEntity.ok(body);
        } catch (ArticuloNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    public record VotarRequest(boolean megusta) {
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateArticleRequest request) {
        try {
            Articulo created = articuloService.create(
                    request.titulo(), request.descripcion(), request.contenido(), request.categoria(),
                    request.layoutConfig()
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
                    request.categoria(), request.activo(), request.layoutConfig()
            );
            return ResponseEntity.ok(ArticuloResponse.from(updated));
        } catch (ArticuloNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    public record CreateArticleRequest(String titulo, String descripcion, String contenido, String categoria,
                                       java.util.Map<String, Object> layoutConfig) {
    }

    public record UpdateArticleRequest(String titulo, String descripcion, String contenido,
                                       String categoria, Boolean activo,
                                       java.util.Map<String, Object> layoutConfig) {
    }
}