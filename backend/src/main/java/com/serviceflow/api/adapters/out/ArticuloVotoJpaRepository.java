package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ArticuloVotoJpaRepository extends JpaRepository<ArticuloVotoEntity, UUID> {

    Optional<ArticuloVotoEntity> findByArticuloIdAndUsuarioId(UUID articuloId, UUID usuarioId);

    long countByArticuloIdAndMegustaTrue(UUID articuloId);

    long countByArticuloIdAndMegustaFalse(UUID articuloId);

    void deleteByArticuloIdAndUsuarioId(UUID articuloId, UUID usuarioId);
}