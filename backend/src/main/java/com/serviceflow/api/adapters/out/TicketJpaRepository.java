package com.serviceflow.api.adapters.out;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TicketJpaRepository extends JpaRepository<TicketEntity, UUID> {
}