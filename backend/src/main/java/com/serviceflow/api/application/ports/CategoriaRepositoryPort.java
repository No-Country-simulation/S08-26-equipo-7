package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.Categoria;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoriaRepositoryPort {

    Categoria save(Categoria categoria);

    Optional<Categoria> findById(UUID id);

    Optional<Categoria> findByCode(String code);

    boolean existsByCode(String code);

    List<Categoria> findAll();

    List<Categoria> findAllActive();
}