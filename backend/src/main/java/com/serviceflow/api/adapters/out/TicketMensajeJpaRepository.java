package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TicketMensajeJpaRepository extends JpaRepository<TicketMensajeEntity, UUID> {

    List<TicketMensajeEntity> findByTicketIdOrderByCreadoEnAsc(UUID ticketId);
}