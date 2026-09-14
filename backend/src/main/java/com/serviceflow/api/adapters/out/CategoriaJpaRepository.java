package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoriaJpaRepository extends JpaRepository<CategoriaEntity, UUID> {

    Optional<CategoriaEntity> findByCode(String code);

    boolean existsByCode(String code);

    List<CategoriaEntity> findByActiveTrueOrderByName();
}