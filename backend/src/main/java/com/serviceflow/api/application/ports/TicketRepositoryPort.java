package com.serviceflow.api.application.ports;

import com.serviceflow.api.domain.Ticket;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepositoryPort {

    Ticket save(Ticket ticket);

    Optional<Ticket> findById(UUID id);

    List<Ticket> findAll();

    long countByCategory(String category);

    long countByStatus(String status);

    List<Ticket> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    List<Ticket> findByResolvedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}