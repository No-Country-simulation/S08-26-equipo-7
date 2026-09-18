package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.TicketMensaje;

import java.util.List;
import java.util.UUID;

public interface TicketMensajeRepositoryPort {

    TicketMensaje save(TicketMensaje mensaje);

    List<TicketMensaje> findByTicketId(UUID ticketId);
}