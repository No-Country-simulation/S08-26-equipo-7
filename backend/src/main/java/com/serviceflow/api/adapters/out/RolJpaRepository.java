package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RolJpaRepository extends JpaRepository<RolEntity, UUID> {

    Optional<RolEntity> findByNombre(String nombre);
}
