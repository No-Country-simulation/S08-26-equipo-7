package com.serviceflow.api.adapters.in;

import com.serviceflow.api.adapters.in.dto.UserResponse;
import com.serviceflow.api.application.services.DuplicateEmailException;
import com.serviceflow.api.application.services.UserService;
import com.serviceflow.api.application.services.ValidationException;
import com.serviceflow.api.domain.Usuario;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateUserRequest request, Authentication auth) {
        try {
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
            }
            Usuario created = userService.create(
                    request.name(), request.email(), request.role(), request.password()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.from(created));
        } catch (DuplicateEmailException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> list(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        }
        List<UserResponse> users = userService.listAll().stream().map(UserResponse::from).toList();
        return ResponseEntity.ok(users);
    }

    public record CreateUserRequest(String name, String email, String role, String password) {
    }
}