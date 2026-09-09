package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.Ticket;

import java.util.List;

public interface TicketRepositoryPort {

    Ticket guardar(Ticket ticket);

    List<Ticket> listarTodos();
}