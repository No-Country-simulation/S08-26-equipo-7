package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.TicketRepositoryPort;
import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.domain.CategoriaTicket;
import com.serviceflow.api.domain.EstadoTicket;
import com.serviceflow.api.domain.PrioridadTicket;
import com.serviceflow.api.domain.Ticket;
import com.serviceflow.api.domain.Usuario;
import com.serviceflow.api.infrastructure.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepositoryPort usuarioRepository;
    private final TicketRepositoryPort ticketRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepositoryPort usuarioRepository,
                       TicketRepositoryPort ticketRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.ticketRepository = ticketRepository;
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
            Ticket ticket = new Ticket(
                    null,
                    usuario.getId(),
                    usuario.getEmail(),
                    CategoriaTicket.PASSWORD_RECOVERY,
                    "Password recovery request",
                    PrioridadTicket.URGENT,
                    EstadoTicket.PENDING,
                    true,
                    null
            );
            ticketRepository.save(ticket);
        });
    }

    public record LoginResult(String token, String nombre, String rol) {
    }
}