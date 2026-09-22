package com.serviceflow.api.infrastructure.scheduler;

import com.serviceflow.api.application.ports.TicketEventoRepositoryPort;
import com.serviceflow.api.application.ports.TicketRepositoryPort;
import com.serviceflow.api.application.services.NotificacionService;
import com.serviceflow.api.domain.EstadoTicket;
import com.serviceflow.api.domain.Ticket;
import com.serviceflow.api.domain.TicketEvento;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class TicketExpiryScheduler {

    private final TicketRepositoryPort ticketRepository;
    private final TicketEventoRepositoryPort eventoRepository;
    private final NotificacionService notificacionService;

    public TicketExpiryScheduler(TicketRepositoryPort ticketRepository,
                                 TicketEventoRepositoryPort eventoRepository,
                                 NotificacionService notificacionService) {
        this.ticketRepository = ticketRepository;
        this.eventoRepository = eventoRepository;
        this.notificacionService = notificacionService;
    }

    @Scheduled(fixedDelayString = "${app.sla.expiry-check-ms:60000}")
    public void markExpiredTickets() {
        LocalDateTime now = LocalDateTime.now();
        List<Ticket> all = ticketRepository.findAll();
        for (Ticket ticket : all) {
            if (ticket.getSlaDueAt() == null) {
                continue;
            }
            if (ticket.getStatus() == EstadoTicket.RESOLVED || ticket.getStatus() == EstadoTicket.CLOSED) {
                continue;
            }
            if (ticket.getStatus() == EstadoTicket.ESCALATED) {
                continue;
            }
            if (ticket.getSlaDueAt().isBefore(now)) {
                ticket.setStatus(EstadoTicket.ESCALATED);
                ticket.setUpdatedAt(now);
                ticketRepository.save(ticket);
                eventoRepository.save(TicketEvento.nuevo(ticket.getId(), "ESCALATED",
                        "Ticket expirado por SLA vencido", null, "Sistema (SLA)"));
                notificacionService.notificarPorEmail(ticket.getEmail(), ticket.getId(), "SLA_VENCIDO",
                        "Tu ticket " + ticket.getCodigo() + " venció por SLA");
                if (ticket.getAssignedTo() != null) {
                    notificacionService.notificar(ticket.getAssignedTo(), ticket.getId(), "SLA_VENCIDO",
                            "El ticket " + ticket.getCodigo() + " venció por SLA");
                }
                notificacionService.notificarSupervisores(ticket.getId(), "SLA_VENCIDO",
                        "El ticket " + ticket.getCodigo() + " venció por SLA y fue escalado");
            }
        }
    }
}