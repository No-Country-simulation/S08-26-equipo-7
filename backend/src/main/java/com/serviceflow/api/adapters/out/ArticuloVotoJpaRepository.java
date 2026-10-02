package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ArticuloVotoJpaRepository extends JpaRepository<ArticuloVotoEntity, UUID> {

    // 1. Buscar voto por artículo y usuario
    Optional<ArticuloVotoEntity> findByArticuloIdAndUsuarioId(UUID articuloId, UUID usuarioId);

    // 2. Contar "me gusta"
    long countByArticuloIdAndMegustaTrue(UUID articuloId);

    // 3. Contar "no me gusta"
    long countByArticuloIdAndMegustaFalse(UUID articuloId);

    // 4. Eliminar voto por artículo y usuario
    void deleteByArticuloIdAndUsuarioId(UUID articuloId, UUID usuarioId);
}