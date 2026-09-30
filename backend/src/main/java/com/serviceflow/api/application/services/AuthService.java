package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.TicketEventoRepositoryPort;
import com.serviceflow.api.application.ports.TicketRepositoryPort;
import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.domain.EstadoTicket;
import com.serviceflow.api.domain.PrioridadTicket;
import com.serviceflow.api.domain.RolUsuario;
import com.serviceflow.api.domain.Ticket;
import com.serviceflow.api.domain.TicketEvento;
import com.serviceflow.api.domain.Usuario;
import com.serviceflow.api.infrastructure.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {

    private final UsuarioRepositoryPort usuarioRepository;
    private final TicketRepositoryPort ticketRepository;
    private final TicketEventoRepositoryPort eventoRepository;
    private final NotificacionService notificacionService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepositoryPort usuarioRepository,
                       TicketRepositoryPort ticketRepository,
                       TicketEventoRepositoryPort eventoRepository,
                       NotificacionService notificacionService,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.ticketRepository = ticketRepository;
        this.eventoRepository = eventoRepository;
        this.notificacionService = notificacionService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResult login(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(password, usuario.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String token = jwtService.generateToken(usuario);
        return new LoginResult(token, usuario.getName(), usuario.getRole().name());
    }

    public void requestPasswordRecovery(String email) {
        if (email == null || email.isBlank()) {
            return;
        }
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            Usuario admin = adminConMenosCarga();
            Ticket ticket = new Ticket(
                    null,
                    usuario.getId(),
                    usuario.getEmail(),
                    "Password recovery request",
                    "PASSWORD_RECOVERY",
                    "Password recovery request",
                    PrioridadTicket.URGENT,
                    admin != null ? EstadoTicket.PENDING_APPROVAL : EstadoTicket.SUBMITTED,
                    true,
                    admin != null ? admin.getId() : null,
                    LocalDateTime.now().plus(java.time.Duration.ofHours(4)),
                    null,
                    null,
                    LocalDateTime.now()
            );
            ticket.setCodigo("PR-" + String.format("%04d",
                    ticketRepository.countByCategory("PASSWORD_RECOVERY") + 1));
            Ticket saved = ticketRepository.save(ticket);
            eventoRepository.save(TicketEvento.nuevo(saved.getId(), "CREATED",
                    "Solicitud de recuperación de contraseña", usuario.getEmail(), usuario.getName()));
            if (admin != null) {
                eventoRepository.save(TicketEvento.nuevo(saved.getId(), "ASSIGNED",
                        "Asignado automáticamente al administrador " + admin.getName(), null, "Sistema"));
                eventoRepository.save(TicketEvento.nuevo(saved.getId(), "APPROVAL_REQUIRED",
                        "Requiere autorización obligatoria", null, "Sistema"));
                notificacionService.notificar(admin.getId(), saved.getId(), "TICKET_ASIGNADO",
                        "Se te asignó la recuperación de " + usuario.getEmail());
                notificacionService.notificarSupervisores(saved.getId(), "APROBACION_REQUERIDA",
                        "La recuperación de " + usuario.getEmail() + " requiere aprobación");
            }
        });
    }

    private Usuario adminConMenosCarga() {
        List<Usuario> admins = usuarioRepository.findByRole(RolUsuario.ADMIN);
        if (admins.isEmpty()) {
            return null;
        }
        List<Ticket> activos = ticketRepository.findAll().stream()
                .filter(t -> t.getStatus() != EstadoTicket.RESOLVED && t.getStatus() != EstadoTicket.CLOSED)
                .toList();
        Usuario mejor = admins.get(0);
        long mejorCarga = Long.MAX_VALUE;
        for (Usuario admin : admins) {
            long carga = activos.stream().filter(t -> admin.getId().equals(t.getAssignedTo())).count();
            if (carga < mejorCarga) {
                mejorCarga = carga;
                mejor = admin;
            }
        }
        return mejor;
    }

    public String areaDe(String email) {
        if (email == null) {
            return null;
        }
        return usuarioRepository.findByEmail(email).map(Usuario::getArea).orElse(null);
    }

    public record LoginResult(String token, String nombre, String rol) {
    }
}