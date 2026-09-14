package com.serviceflow.api.adapters.in.dto;

import com.serviceflow.api.domain.Usuario;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String email,
        String role,
        LocalDateTime createdAt
) {
    public static UserResponse from(Usuario usuario) {
        return new UserResponse(
                usuario.getId(),
                usuario.getName(),
                usuario.getEmail(),
                usuario.getRole().name(),
                usuario.getCreatedAt()
        );
    }
}