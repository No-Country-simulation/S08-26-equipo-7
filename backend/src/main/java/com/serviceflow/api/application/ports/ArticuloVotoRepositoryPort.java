package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.ArticuloVoto;

import java.util.Optional;
import java.util.UUID;

public interface ArticuloVotoRepositoryPort {

    ArticuloVoto save(ArticuloVoto voto);

    Optional<ArticuloVoto> findByArticuloIdAndUsuarioId(UUID articuloId, UUID usuarioId);

    void deleteByArticuloIdAndUsuarioId(UUID articuloId, UUID usuarioId);

    long countMegusta(UUID articuloId);

    long countNoMegusta(UUID articuloId);
}