package com.serviceflow.api.infrastructure.scheduler;

import com.serviceflow.api.application.ports.TicketRepositoryPort;
import com.serviceflow.api.domain.EstadoTicket;
import com.serviceflow.api.domain.Ticket;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class TicketExpiryScheduler {

    private final TicketRepositoryPort ticketRepository;

    public TicketExpiryScheduler(TicketRepositoryPort ticketRepository) {
        this.ticketRepository = ticketRepository;
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
            }
        }
    }
}