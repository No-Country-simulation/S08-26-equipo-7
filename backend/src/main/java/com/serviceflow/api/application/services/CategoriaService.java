package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.CategoriaRepositoryPort;
import com.serviceflow.api.domain.Categoria;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CategoriaService {

    private final CategoriaRepositoryPort categoriaRepository;

    public CategoriaService(CategoriaRepositoryPort categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listActive() {
        return categoriaRepository.findAllActive();
    }

    public List<Categoria> listAll() {
        return categoriaRepository.findAll();
    }

    public Categoria create(String code, String name, String description, boolean requiresApproval) {
        return create(code, name, description, requiresApproval, null);
    }

    public Categoria create(String code, String name, String description, boolean requiresApproval,
                            com.serviceflow.api.domain.PrioridadTicket prioridadDefecto) {
        if (code == null || code.isBlank() || name == null || name.isBlank()) {
            throw new IllegalArgumentException("code and name are required");
        }
        if (categoriaRepository.existsByCode(code.toUpperCase())) {
            throw new DuplicateCategoryException("Category already exists: " + code);
        }
        return categoriaRepository.save(new Categoria(
                null, code.toUpperCase(), name, description, true, requiresApproval,
                prioridadDefecto != null ? prioridadDefecto : com.serviceflow.api.domain.PrioridadTicket.MEDIUM,
                null
        ));
    }

    public Categoria update(UUID id, String name, String description, Boolean active, Boolean requiresApproval) {
        return update(id, name, description, active, requiresApproval, null);
    }

    public Categoria update(UUID id, String name, String description, Boolean active, Boolean requiresApproval,
                            com.serviceflow.api.domain.PrioridadTicket prioridadDefecto) {
        Categoria existing = categoriaRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        String newName = name != null && !name.isBlank() ? name : existing.getName();
        boolean newActive = active != null ? active : existing.isActive();
        boolean newRequiresApproval = requiresApproval != null ? requiresApproval : existing.isRequiresApproval();
        com.serviceflow.api.domain.PrioridadTicket newPrioridad = prioridadDefecto != null
                ? prioridadDefecto
                : existing.getPrioridadDefecto();
        return categoriaRepository.save(new Categoria(
                existing.getId(),
                existing.getCode(),
                newName,
                description != null ? description : existing.getDescription(),
                newActive,
                newRequiresApproval,
                newPrioridad,
                existing.getCreatedAt()
        ));
    }

    public void toggleActive(UUID id) {
        Categoria existing = categoriaRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        categoriaRepository.save(new Categoria(
                existing.getId(),
                existing.getCode(),
                existing.getName(),
                existing.getDescription(),
                !existing.isActive(),
                existing.isRequiresApproval(),
                existing.getCreatedAt()
        ));
    }

    public Categoria findById(UUID id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
    }

    public Categoria findByCode(String code) {
        return categoriaRepository.findByCode(code)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found: " + code));
    }
}