package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.CategoriaRepositoryPort;
import com.serviceflow.api.domain.Categoria;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class CategoriaRepositoryAdapter implements CategoriaRepositoryPort {

    private final CategoriaJpaRepository jpaRepository;

    public CategoriaRepositoryAdapter(CategoriaJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Categoria save(Categoria categoria) {
        UUID id = categoria.getId() != null ? categoria.getId() : UUID.randomUUID();
        LocalDateTime createdAt = categoria.getCreatedAt() != null ? categoria.getCreatedAt() : LocalDateTime.now();
        CategoriaEntity entity = jpaRepository.save(new CategoriaEntity(
                id,
                categoria.getCode(),
                categoria.getName(),
                categoria.getDescription(),
                categoria.isActive(),
                categoria.isRequiresApproval(),
                createdAt
        ));
        return toDomain(entity);
    }

    @Override
    public Optional<Categoria> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Categoria> findByCode(String code) {
        return jpaRepository.findByCode(code).map(this::toDomain);
    }

    @Override
    public boolean existsByCode(String code) {
        return jpaRepository.existsByCode(code);
    }

    @Override
    public List<Categoria> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public List<Categoria> findAllActive() {
        return jpaRepository.findByActiveTrueOrderByName().stream().map(this::toDomain).toList();
    }

    private Categoria toDomain(CategoriaEntity entity) {
        return new Categoria(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getDescription(),
                entity.isActive(),
                entity.isRequiresApproval(),
                entity.getCreatedAt()
        );
    }
}