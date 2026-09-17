package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.TicketEvento;

import java.util.List;
import java.util.UUID;

public interface TicketEventoRepositoryPort {

    TicketEvento save(TicketEvento evento);

    List<TicketEvento> findByTicketId(UUID ticketId);
}