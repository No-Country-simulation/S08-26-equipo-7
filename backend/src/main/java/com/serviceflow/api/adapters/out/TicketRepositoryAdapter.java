package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.TicketRepositoryPort;
import com.serviceflow.api.domain.CategoriaTicket;
import com.serviceflow.api.domain.EstadoTicket;
import com.serviceflow.api.domain.PrioridadTicket;
import com.serviceflow.api.domain.Ticket;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
public class TicketRepositoryAdapter implements TicketRepositoryPort {

    private final TicketJpaRepository jpaRepository;

    public TicketRepositoryAdapter(TicketJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Ticket save(Ticket ticket) {
        UUID id = ticket.getId() != null ? ticket.getId() : UUID.randomUUID();
        LocalDateTime createdAt = ticket.getCreatedAt() != null ? ticket.getCreatedAt() : LocalDateTime.now();
        TicketEntity entity = new TicketEntity(
                id,
                ticket.getUserId(),
                ticket.getEmail(),
                ticket.getCategory().name(),
                ticket.getDescription(),
                ticket.getPriority().name(),
                ticket.getStatus().name(),
                ticket.isRequiresApproval(),
                createdAt
        );
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public List<Ticket> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    private Ticket toDomain(TicketEntity entity) {
        return new Ticket(
                entity.getId(),
                entity.getUserId(),
                entity.getEmail(),
                CategoriaTicket.valueOf(entity.getCategory()),
                entity.getDescription(),
                PrioridadTicket.valueOf(entity.getPriority()),
                EstadoTicket.valueOf(entity.getStatus()),
                entity.isRequiresApproval(),
                entity.getCreatedAt()
        );
    }
}