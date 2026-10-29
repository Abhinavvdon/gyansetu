package org.gyansetu.controller;

import jakarta.validation.Valid;
import org.gyansetu.model.dto.AuthResponse;
import org.gyansetu.model.dto.LoginRequest;
import org.gyansetu.model.dto.RegisterRequest;
import org.gyansetu.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAuthStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("database", "PostgreSQL (port 5434)");
        status.put("table", "users");
        status.put("encryption", "BCrypt Hashing (10 rounds)");
        status.put("status", "ACTIVE");
        return ResponseEntity.ok(status);
    }
}
