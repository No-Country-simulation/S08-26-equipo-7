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
    public Ticket guardar(Ticket ticket) {
        UUID id = ticket.getId() != null ? ticket.getId() : UUID.randomUUID();
        LocalDateTime creadoEn = ticket.getCreadoEn() != null ? ticket.getCreadoEn() : LocalDateTime.now();
        TicketEntity entity = new TicketEntity(
                id,
                ticket.getUsuarioId(),
                ticket.getEmail(),
                ticket.getCategoria().name(),
                ticket.getDescripcion(),
                ticket.getPrioridad().name(),
                ticket.getEstado().name(),
                ticket.isRequiereAprobacion(),
                creadoEn
        );
        return aDominio(jpaRepository.save(entity));
    }

    @Override
    public List<Ticket> listarTodos() {
        return jpaRepository.findAll().stream().map(this::aDominio).toList();
    }

    private Ticket aDominio(TicketEntity entity) {
        return new Ticket(
                entity.getId(),
                entity.getUsuarioId(),
                entity.getEmail(),
                CategoriaTicket.valueOf(entity.getCategoria()),
                entity.getDescripcion(),
                PrioridadTicket.valueOf(entity.getPrioridad()),
                EstadoTicket.valueOf(entity.getEstado()),
                entity.isRequiereAprobacion(),
                entity.getCreadoEn()
        );
    }
}