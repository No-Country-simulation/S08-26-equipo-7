package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ArticuloJpaRepository extends JpaRepository<ArticuloEntity, UUID> {

    List<ArticuloEntity> findByActivoTrueOrderByUpdatedAtDesc();
}