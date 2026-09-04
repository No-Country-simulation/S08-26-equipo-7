package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.domain.Usuario;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository jpaRepository;

    public UsuarioRepositoryAdapter(UsuarioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        UsuarioEntity entity = new UsuarioEntity(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getPasswordHash(),
                usuario.getRol(),
                usuario.getCreadoEn()
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
                entity.getRol(),
                entity.getCreadoEn()
        );
    }
}