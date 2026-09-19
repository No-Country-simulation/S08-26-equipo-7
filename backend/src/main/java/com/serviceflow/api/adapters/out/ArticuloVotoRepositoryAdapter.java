package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.ArticuloVotoRepositoryPort;
import com.serviceflow.api.domain.ArticuloVoto;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Component
public class ArticuloVotoRepositoryAdapter implements ArticuloVotoRepositoryPort {

    private final ArticuloVotoJpaRepository jpaRepository;

    public ArticuloVotoRepositoryAdapter(ArticuloVotoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public ArticuloVoto save(ArticuloVoto voto) {
        LocalDateTime now = LocalDateTime.now();
        ArticuloVotoEntity entity = new ArticuloVotoEntity(
                voto.getId() != null ? voto.getId() : UUID.randomUUID(),
                voto.getArticuloId(),
                voto.getUsuarioId(),
                voto.getMegusta(),
                voto.getCreadoEn() != null ? voto.getCreadoEn() : LocalDateTime.now(),
                LocalDateTime.now()
        );
        ArticuloVotoEntity saved = jpaRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<ArticuloVoto> findByArticuloIdAndUsuarioId(UUID articuloId, UUID usuarioId) {
        return jpaRepository.findByArticuloIdAndUsuarioId(articuloId, usuarioId).map(this::toDomain);
    }

    @Override
    public long countMegusta(UUID articuloId) {
        return jpaRepository.countByArticuloIdAndMegustaTrue(articuloId);
    }

    @Override
    public long countNoMegusta(UUID articuloId) {
        return jpaRepository.countByArticuloIdAndMegustaFalse(articuloId);
    }

    @Override
    public void deleteByArticuloIdAndUsuarioId(UUID articuloId, UUID usuarioId) {
        jpaRepository.deleteByArticuloIdAndUsuarioId(articuloId, usuarioId);
    }

    private ArticuloVoto toDomain(ArticuloVotoEntity entity) {
        return new ArticuloVoto(
                entity.getId(),
                entity.getArticuloId(),
                entity.getUsuarioId(),
                entity.getMegusta(),
                entity.getCreadoEn(),
                entity.getActualizadoEn()
        );
    }
}