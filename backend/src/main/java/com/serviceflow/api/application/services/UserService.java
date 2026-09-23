package com.serviceflow.api.application.services;

import com.serviceflow.api.application.ports.UsuarioRepositoryPort;
import com.serviceflow.api.domain.RolUsuario;
import com.serviceflow.api.domain.Usuario;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class UserService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UsuarioRepositoryPort usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario create(String name, String email, String role, String password) {
        return create(name, email, role, password, null);
    }

    public Usuario create(String name, String email, String role, String password, String area) {
        validateName(name);
        validateEmail(email);
        validateRole(role);
        validatePassword(password);

        if (usuarioRepository.existsByEmail(email.toLowerCase())) {
            throw new DuplicateEmailException("Email already registered: " + email);
        }

        Usuario usuario = new Usuario(
                UUID.randomUUID(),
                name.trim(),
                email.toLowerCase(),
                passwordEncoder.encode(password),
                RolUsuario.valueOf(role),
                area != null && !area.isBlank() ? area.trim().toUpperCase() : null,
                LocalDateTime.now()
        );
        return usuarioRepository.save(usuario);
    }

    public Usuario adminChangePassword(UUID userId, String newPassword) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ValidationException("User not found"));
        validatePassword(newPassword);
        Usuario actualizado = new Usuario(
                usuario.getId(),
                usuario.getName(),
                usuario.getEmail(),
                passwordEncoder.encode(newPassword),
                usuario.getRole(),
                usuario.getArea(),
                usuario.getCreatedAt()
        );
        return usuarioRepository.save(actualizado);
    }

    public Usuario changePassword(String email, String currentPassword, String newPassword) {
        Usuario usuario = usuarioRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ValidationException("User not found"));
        if (currentPassword == null || !passwordEncoder.matches(currentPassword, usuario.getPasswordHash())) {
            throw new ValidationException("Current password is incorrect");
        }
        validatePassword(newPassword);
        Usuario actualizado = new Usuario(
                usuario.getId(),
                usuario.getName(),
                usuario.getEmail(),
                passwordEncoder.encode(newPassword),
                usuario.getRole(),
                usuario.getArea(),
                usuario.getCreatedAt()
        );
        return usuarioRepository.save(actualizado);
    }

    public List<Usuario> listAll() {
        return usuarioRepository.findAll();
    }

    private void validateName(String name) {
        if (name == null || name.isBlank()) {
            throw new ValidationException("name is required");
        }
    }

    private void validateEmail(String email) {
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new ValidationException("email is invalid");
        }
    }

    private void validateRole(String role) {
        if (role == null) {
            throw new ValidationException("role is required");
        }
        try {
            RolUsuario.valueOf(role);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("role is invalid. Allowed roles: "
                    + String.join(", ", RolUsuario.getNames()));
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < MIN_PASSWORD_LENGTH) {
            throw new ValidationException("password must be at least " + MIN_PASSWORD_LENGTH + " characters");
        }
    }
}