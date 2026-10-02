package com.serviceflow.api.adapters.in;

import com.serviceflow.api.adapters.in.dto.CategoriaResponse;
import com.serviceflow.api.application.services.CategoriaService;
import com.serviceflow.api.application.services.CategoryNotFoundException;
import com.serviceflow.api.application.services.DuplicateCategoryException;
import com.serviceflow.api.domain.Categoria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public ResponseEntity<?> listActive() {
        List<CategoriaResponse> response = categoriaService.listActive().stream()
                .map(CategoriaResponse::from).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<?> listAll() {
        return ResponseEntity.ok(categoriaService.listAll().stream().map(CategoriaResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(CategoriaResponse.from(categoriaService.findById(id)));
        } catch (CategoryNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateCategoryRequest request) {
        try {
            Categoria created = categoriaService.create(
                    request.code(), request.name(), request.description(),
                    Boolean.TRUE.equals(request.requiresApproval()),
                    parsePrioridad(request.prioridadDefecto())
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(CategoriaResponse.from(created));
        } catch (DuplicateCategoryException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable UUID id, @RequestBody UpdateCategoryRequest request) {
        try {
            Categoria updated = categoriaService.update(
                    id, request.name(), request.description(), request.active(), request.requiresApproval(),
                    parsePrioridad(request.prioridadDefecto())
            );
            return ResponseEntity.ok(CategoriaResponse.from(updated));
        } catch (CategoryNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<?> toggle(@PathVariable UUID id) {
        try {
            categoriaService.toggleActive(id);
            return ResponseEntity.ok(Map.of("message", "Category toggled"));
        } catch (CategoryNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    private com.serviceflow.api.domain.PrioridadTicket parsePrioridad(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return com.serviceflow.api.domain.PrioridadTicket.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid prioridadDefecto: " + value);
        }
    }

    public record CreateCategoryRequest(String code, String name, String description, Boolean requiresApproval,
                                        String prioridadDefecto) {
    }

    public record UpdateCategoryRequest(String name, String description, Boolean active, Boolean requiresApproval,
                                        String prioridadDefecto) {
    }
}