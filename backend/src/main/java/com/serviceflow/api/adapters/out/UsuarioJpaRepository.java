package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, UUID> {

    Optional<UsuarioEntity> findByEmail(String email);

    boolean existsByEmail(String email);

    List<UsuarioEntity> findByRolName(String rolName);
}