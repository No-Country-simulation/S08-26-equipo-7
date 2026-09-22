package com.serviceflow.api.adapters.out;

import com.serviceflow.api.application.ports.TicketMensajeRepositoryPort;
import com.serviceflow.api.domain.TicketMensaje;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class TicketMensajeRepositoryAdapter implements TicketMensajeRepositoryPort {

    private final TicketMensajeJpaRepository jpaRepository;

    public TicketMensajeRepositoryAdapter(TicketMensajeJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public TicketMensaje save(TicketMensaje mensaje) {
        UUID id = mensaje.id() != null ? mensaje.id() : UUID.randomUUID();
        TicketMensajeEntity entity = new TicketMensajeEntity(
                id,
                mensaje.ticketId(),
                mensaje.autorEmail(),
                mensaje.autorNombre(),
                mensaje.mensaje(),
                mensaje.creadoEn()
        );
        return toDomain(jpaRepository.save(entity));
    }

    @Override
    public List<TicketMensaje> findByTicketId(UUID ticketId) {
        return jpaRepository.findByTicketIdOrderByCreadoEnAsc(ticketId).stream().map(this::toDomain).toList();
    }

    private TicketMensaje toDomain(TicketMensajeEntity entity) {
        return new TicketMensaje(
                entity.getId(),
                entity.getTicketId(),
                entity.getAutorEmail(),
                entity.getAutorNombre(),
                entity.getMensaje(),
                entity.getCreadoEn()
        );
    }
}