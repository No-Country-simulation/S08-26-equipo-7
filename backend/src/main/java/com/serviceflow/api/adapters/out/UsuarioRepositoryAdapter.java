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
    public Usuario guardar(Usuario usuario) {
        UUID id = usuario.getId() != null ? usuario.getId() : UUID.randomUUID();
        LocalDateTime creadoEn = usuario.getCreadoEn() != null ? usuario.getCreadoEn() : LocalDateTime.now();
        RolEntity rol = rolJpaRepository.findByNombre(usuario.getRol().name())
                .orElseThrow(() -> new IllegalStateException("Rol no encontrado: " + usuario.getRol()));
        UsuarioEntity entity = new UsuarioEntity(
                id,
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getPasswordHash(),
                rol,
                creadoEn
        );
        UsuarioEntity guardado = jpaRepository.save(entity);
        return aDominio(guardado);
    }

    @Override
    public Optional<Usuario> buscarPorId(UUID id) {
        return jpaRepository.findById(id).map(this::aDominio);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return jpaRepository.findByEmail(email).map(this::aDominio);
    }

    @Override
    public boolean existePorEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    private Usuario aDominio(UsuarioEntity entity) {
        return new Usuario(
                entity.getId(),
                entity.getNombre(),
                entity.getEmail(),
                entity.getPasswordHash(),
                com.serviceflow.api.domain.RolUsuario.valueOf(entity.getRol().getNombre()),
                entity.getCreadoEn()
        );
    }
}
