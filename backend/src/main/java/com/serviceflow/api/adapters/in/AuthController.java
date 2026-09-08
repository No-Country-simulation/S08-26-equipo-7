package com.serviceflow.api.adapters.in;

import com.serviceflow.api.adapters.in.dto.LoginRequest;
import com.serviceflow.api.adapters.in.dto.LoginResponse;
import com.serviceflow.api.application.services.AuthService;
import com.serviceflow.api.application.services.CredencialesInvalidasException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthService.LoginResult resultado = authService.login(request.email(), request.password());
            return ResponseEntity.ok(new LoginResponse(resultado.token(), resultado.nombre(), resultado.rol()));
        } catch (CredencialesInvalidasException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }
    }
}