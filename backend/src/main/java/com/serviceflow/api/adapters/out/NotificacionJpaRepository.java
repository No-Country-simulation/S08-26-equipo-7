package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface NotificacionJpaRepository extends JpaRepository<NotificacionEntity, UUID> {

    List<NotificacionEntity> findByUsuarioIdOrderByCreadoEnDesc(UUID usuarioId);

    List<NotificacionEntity> findByUsuarioIdAndLeidaFalseOrderByCreadoEnDesc(UUID usuarioId);

    long countByUsuarioIdAndLeidaFalse(UUID usuarioId);

    boolean existsByUsuarioIdAndTicketIdAndTipo(UUID usuarioId, UUID ticketId, String tipo);

    @Modifying
    @Query("UPDATE NotificacionEntity n SET n.leida = true WHERE n.id = :id AND n.usuarioId = :usuarioId")
    void markLeida(@Param("id") UUID id, @Param("usuarioId") UUID usuarioId);

    @Modifying
    @Query("UPDATE NotificacionEntity n SET n.leida = true WHERE n.usuarioId = :usuarioId AND n.leida = false")
    void markAllLeidas(@Param("usuarioId") UUID usuarioId);
}