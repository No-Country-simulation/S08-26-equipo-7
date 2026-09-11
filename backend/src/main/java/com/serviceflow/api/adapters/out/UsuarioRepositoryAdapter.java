package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.domain.Usuario;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository jpaRepository;
    private final RolJpaRepository rolJpaRepository;

    public UsuarioRepositoryAdapter(UsuarioJpaRepository jpaRepository, RolJpaRepository rolJpaRepository) {
        this.jpaRepository = jpaRepository;
        this.rolJpaRepository = rolJpaRepository;
    }

    @Override
    public Usuario save(Usuario usuario) {
        UUID id = usuario.getId() != null ? usuario.getId() : UUID.randomUUID();
        LocalDateTime createdAt = usuario.getCreatedAt() != null ? usuario.getCreatedAt() : LocalDateTime.now();
        RolEntity rol = rolJpaRepository.findByName(usuario.getRole().name())
                .orElseThrow(() -> new IllegalStateException("Role not found: " + usuario.getRole()));
        UsuarioEntity entity = new UsuarioEntity(
                id,
                usuario.getName(),
                usuario.getEmail(),
                usuario.getPasswordHash(),
                rol,
                createdAt
        );
        UsuarioEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Usuario> findById(UUID id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Usuario> findByEmail(String email) {
        return jpaRepository.findByEmail(email).map(this::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    private Usuario toDomain(UsuarioEntity entity) {
        return new Usuario(
                entity.getId(),
                entity.getName(),
                entity.getEmail(),
                entity.getPasswordHash(),
                com.serviceflow.api.domain.RolUsuario.valueOf(entity.getRol().getName()),
                entity.getCreatedAt()
        );
    }
}