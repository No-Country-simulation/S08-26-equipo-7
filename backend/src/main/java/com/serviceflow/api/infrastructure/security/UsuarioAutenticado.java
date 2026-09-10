package com.serviceflow.api.infrastructure.security;

public record UsuarioAutenticado(String email, String nombre, String rol) {
}