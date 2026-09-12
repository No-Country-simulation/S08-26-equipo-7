package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface TicketJpaRepository extends JpaRepository<TicketEntity, UUID> {

    long countByCategory(String category);

    long countByStatus(String status);

    List<TicketEntity> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<TicketEntity> findByResolvedAtBetween(LocalDateTime start, LocalDateTime end);
}