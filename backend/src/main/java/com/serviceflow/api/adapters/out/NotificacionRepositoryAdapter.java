package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.NotificacionRepositoryPort;
import com.serviceflow.api.domain.Notificacion;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
public class NotificacionRepositoryAdapter implements NotificacionRepositoryPort {

    private final NotificacionJpaRepository jpaRepository;
    private final UsuarioJpaRepository usuarioJpaRepository;

    public NotificacionRepositoryAdapter(NotificacionJpaRepository jpaRepository,
                                         UsuarioJpaRepository usuarioJpaRepository) {
        this.jpaRepository = jpaRepository;
        this.usuarioJpaRepository = usuarioJpaRepository;
    }

    @Override
    public Notificacion save(Notificacion notificacion) {
        UUID id = notificacion.id() != null ? notificacion.id() : UUID.randomUUID();
        NotificacionEntity entity = new NotificacionEntity(
                id,
                notificacion.usuarioId(),
                notificacion.ticketId(),
                notificacion.tipo(),
                notificacion.mensaje(),
                notificacion.leida(),
                notificacion.creadoEn()
        );
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public List<Notificacion> findByUsuarioId(UUID usuarioId) {
        return jpaRepository.findByUsuarioIdOrderByCreadoEnDesc(usuarioId).stream().map(this::toDomain).toList();
    }

    @Override
    public List<Notificacion> findByUsuarioIdAndLeidaFalse(UUID usuarioId) {
        return jpaRepository.findByUsuarioIdAndLeidaFalseOrderByCreadoEnDesc(usuarioId).stream().map(this::toDomain).toList();
    }

    @Override
    @Transactional
    public void markLeida(UUID notificacionId, UUID usuarioId) {
        jpaRepository.markLeida(notificacionId, usuarioId);
    }

    @Override
    @Transactional
    public void markAllLeidas(UUID usuarioId) {
        jpaRepository.markAllLeidas(usuarioId);
    }

    @Override
    public long countNoLeidas(UUID usuarioId) {
        return jpaRepository.countByUsuarioIdAndLeidaFalse(usuarioId);
    }

    @Override
    public boolean existsByUsuarioIdTicketAndTipo(UUID usuarioId, UUID ticketId, String tipo) {
        return jpaRepository.existsByUsuarioIdAndTicketIdAndTipo(usuarioId, ticketId, tipo);
    }

    private Notificacion toDomain(NotificacionEntity entity) {
        return new Notificacion(
                entity.getId(),
                entity.getUsuarioId(),
                entity.getTicketId(),
                entity.getTipo(),
                entity.getMensaje(),
                entity.isLeida(),
                entity.getCreadoEn()
        );
    }
}