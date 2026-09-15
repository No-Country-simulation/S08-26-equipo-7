package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.Articulo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticuloRepositoryPort {

    Articulo save(Articulo articulo);

    Optional<Articulo> findById(UUID id);

    List<Articulo> findAllActive();
}