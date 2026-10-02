package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.TicketEventoRepositoryPort;
import com.serviceflow.api.domain.TicketEvento;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class TicketEventoRepositoryAdapter implements TicketEventoRepositoryPort {

    private final TicketEventoJpaRepository jpaRepository;

    public TicketEventoRepositoryAdapter(TicketEventoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public TicketEvento save(TicketEvento evento) {
        UUID id = evento.id() != null ? evento.id() : UUID.randomUUID();
        TicketEventoEntity entity = new TicketEventoEntity(
                id,
                evento.ticketId(),
                evento.tipo(),
                evento.descripcion(),
                evento.actorEmail(),
                evento.actorNombre(),
                evento.fecha()
        );
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public List<TicketEvento> findByTicketId(UUID ticketId) {
        return jpaRepository.findByTicketIdOrderByFechaAsc(ticketId).stream().map(this::toDomain).toList();
    }

    private TicketEvento toDomain(TicketEventoEntity entity) {
        return new TicketEvento(
                entity.getId(),
                entity.getTicketId(),
                entity.getTipo(),
                entity.getDescripcion(),
                entity.getActorEmail(),
                entity.getActorNombre(),
                entity.getFecha()
        );
    }
}