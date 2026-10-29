package org.gyansetu.service;

import org.gyansetu.model.User;
import org.gyansetu.model.dto.AuthResponse;
import org.gyansetu.model.dto.LoginRequest;
import org.gyansetu.model.dto.RegisterRequest;
import org.gyansetu.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            return new AuthResponse(false, "Name cannot be empty");
        }

        if (request.getEmail() == null || !request.getEmail().contains("@")) {
            return new AuthResponse(false, "Please provide a valid email address");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new AuthResponse(false, "Password must be at least 6 characters long");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new AuthResponse(false, "Passwords do not match");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            return new AuthResponse(false, "An account with this email already exists");
        }

        // Hash the password securely with BCrypt
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(request.getName().trim(), normalizedEmail, hashedPassword);
        user.setRole("STUDENT");
        user.setCreatedAt(LocalDateTime.now());
        user.setLastLoginAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Generate session/auth token
        String token = "gyansetu_token_" + UUID.randomUUID().toString().replace("-", "");

        return new AuthResponse(
                true,
                "Account created successfully!",
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return new AuthResponse(false, "Email and password are required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);

        if (user == null) {
            return new AuthResponse(false, "Invalid email or password");
        }

        // Verify BCrypt hash
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Invalid email or password");
        }

        // Update login timestamp
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = "gyansetu_token_" + UUID.randomUUID().toString().replace("-", "");

        return new AuthResponse(
                true,
                "Login successful!",
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
