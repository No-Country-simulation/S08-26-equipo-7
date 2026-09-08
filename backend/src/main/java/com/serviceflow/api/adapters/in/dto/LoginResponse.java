package com.serviceflow.api.adapters.in.dto;

public record LoginResponse(String token, String nombre, String rol) {
}