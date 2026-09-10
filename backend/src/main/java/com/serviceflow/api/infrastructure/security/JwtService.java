package com.serviceflow.api.infrastructure.security;

import com.serviceflow.api.domain.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(@Value("${app.jwt.secret}") String secret,
                  @Value("${app.jwt.expiration-ms}") long expirationMs) {
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalArgumentException("app.jwt.secret debe tener al menos 32 bytes (256 bits) para HS256");
        }
        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.expirationMs = expirationMs;
    }

    public String generarToken(Usuario usuario) {
        Date ahora = new Date();
        Date expiracion = new Date(ahora.getTime() + expirationMs);

        return Jwts.builder()
                .subject(usuario.getId().toString())
                .claim("email", usuario.getEmail())
                .claim("nombre", usuario.getNombre())
                .claim("rol", usuario.getRol().name())
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(key)
                .compact();
    }

    public long expiracionEnSegundos() {
        return expirationMs / 1000;
    }

    public String extraerEmail(String token) {
        return extraerClaims(token).get("email", String.class);
    }

    public String extraerRol(String token) {
        return extraerClaims(token).get("rol", String.class);
    }

    public String extraerNombre(String token) {
        return extraerClaims(token).get("nombre", String.class);
    }

    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}