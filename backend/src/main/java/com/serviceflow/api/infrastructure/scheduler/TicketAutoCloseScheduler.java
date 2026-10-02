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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class TicketAutoCloseScheduler {

    private final TicketRepositoryPort ticketRepository;
    private final TicketEventoRepositoryPort eventoRepository;
    private final NotificacionService notificacionService;
    private final long autoCloseHours;

    public TicketAutoCloseScheduler(TicketRepositoryPort ticketRepository,
                                    TicketEventoRepositoryPort eventoRepository,
                                    NotificacionService notificacionService,
                                    @Value("${app.auto-close.resolved-hours:48}") long autoCloseHours) {
        this.ticketRepository = ticketRepository;
        this.eventoRepository = eventoRepository;
        this.notificacionService = notificacionService;
        this.autoCloseHours = autoCloseHours;
    }

    @Scheduled(fixedDelayString = "${app.auto-close.check-ms:300000}")
    public void autoCloseResolvedTickets() {
        Duration inactivo = Duration.ofHours(autoCloseHours);
        LocalDateTime now = LocalDateTime.now();
        List<Ticket> all = ticketRepository.findAll();
        for (Ticket ticket : all) {
            if (ticket.getStatus() != EstadoTicket.RESOLVED) {
                continue;
            }
            if (ticket.getResolvedAt() == null) {
                continue;
            }
            if (ticket.getResolvedAt().plus(inactivo).isAfter(now)) {
                continue;
            }
            ticket.setClosedAt(now);
            ticket.setStatus(EstadoTicket.CLOSED);
            ticketRepository.save(ticket);
            eventoRepository.save(TicketEvento.nuevo(ticket.getId(), "CLOSED",
                    "Ticket cerrado automáticamente por inactividad tras resolución", null, "Sistema (auto-cierre)"));
            notificacionService.notificarPorEmail(ticket.getEmail(), ticket.getId(), "TICKET_CERRADO",
                    "Tu ticket " + ticket.getCodigo() + " se cerró automáticamente");
        }
    }
}