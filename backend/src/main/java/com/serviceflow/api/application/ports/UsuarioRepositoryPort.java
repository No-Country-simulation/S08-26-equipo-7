package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.RolUsuario;
import com.serviceflow.api.domain.Usuario;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepositoryPort {

    Usuario save(Usuario usuario);

    Optional<Usuario> findById(UUID id);

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Usuario> findAll();

    List<Usuario> findByRole(RolUsuario role);
}