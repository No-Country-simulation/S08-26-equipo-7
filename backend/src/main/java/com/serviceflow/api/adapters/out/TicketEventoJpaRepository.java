package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TicketEventoJpaRepository extends JpaRepository<TicketEventoEntity, UUID> {

    List<TicketEventoEntity> findByTicketIdOrderByFechaAsc(UUID ticketId);
}