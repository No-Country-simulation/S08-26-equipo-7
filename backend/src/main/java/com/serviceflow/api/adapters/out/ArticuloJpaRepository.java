package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ArticuloJpaRepository extends JpaRepository<ArticuloEntity, UUID> {

    List<ArticuloEntity> findByActivoTrueOrderByUpdatedAtDesc();

    List<ArticuloEntity> findByActivoFalseOrderByUpdatedAtDesc();

    @Modifying
    @Query("UPDATE ArticuloEntity a SET a.visualizaciones = a.visualizaciones + 1 WHERE a.id = :id")
    void incrementarVisualizaciones(UUID id);
}