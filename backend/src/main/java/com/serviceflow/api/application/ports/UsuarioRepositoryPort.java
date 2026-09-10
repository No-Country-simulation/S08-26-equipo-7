package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.Usuario;

import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepositoryPort {

    Usuario save(Usuario usuario);

    Optional<Usuario> findById(UUID id);

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);
}