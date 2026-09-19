package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.ArticuloRepositoryPort;
import com.serviceflow.api.domain.Articulo;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class ArticuloRepositoryAdapter implements ArticuloRepositoryPort {

    private final ArticuloJpaRepository jpaRepository;

    public ArticuloRepositoryAdapter(ArticuloJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Articulo save(Articulo articulo) {
        UUID id = articulo.getId() != null ? articulo.getId() : UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();
        ArticuloEntity entity = jpaRepository.save(new ArticuloEntity(
                id,
                articulo.getTitulo(),
                articulo.getDescripcion(),
                articulo.getContenido(),
                articulo.getCategoria(),
                articulo.getVisualizaciones(),
                articulo.getMegusta(),
                articulo.getNomegusta(),
                articulo.isActivo(),
                articulo.getCreatedAt() != null ? articulo.getCreatedAt() : now,
                articulo.getUpdatedAt() != null ? articulo.getUpdatedAt() : now
        ));
        return toDomain(entity);
    }

    @Override
    public Optional<Articulo> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Articulo> findAllActive() {
        return jpaRepository.findByActivoTrueOrderByUpdatedAtDesc().stream().map(this::toDomain).toList();
    }

    private Articulo toDomain(ArticuloEntity entity) {
        return new Articulo(
                entity.getId(),
                entity.getTitulo(),
                entity.getDescripcion(),
                entity.getContenido(),
                entity.getCategoria(),
                entity.getVisualizaciones(),
                entity.getMegusta(),
                entity.getNomegusta(),
                entity.isActivo(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}