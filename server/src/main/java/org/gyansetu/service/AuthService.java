package org.gyansetu.service;

import jakarta.annotation.PostConstruct;
import org.gyansetu.model.User;
import org.gyansetu.model.dto.AuthResponse;
import org.gyansetu.model.dto.LoginRequest;
import org.gyansetu.model.dto.RegisterRequest;
import org.gyansetu.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Map<String, User> tokenCache = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void initDemoUser() {
        try {
            Optional<User> existing = userRepository.findByEmail("aarav.sharma@example.com");
            if (existing.isEmpty()) {
                User demo = new User("Aarav Sharma", "aarav.sharma@example.com", passwordEncoder.encode("Password@123"));
                demo.setRole("STUDENT");
                demo.setAuthToken("gyansetu_demo_token_aarav");
                demo.setCreatedAt(LocalDateTime.now());
                demo.setLastLoginAt(LocalDateTime.now());
                User saved = userRepository.save(demo);
                tokenCache.put(saved.getAuthToken(), saved);
            } else {
                User demo = existing.get();
                if (demo.getAuthToken() == null || demo.getAuthToken().isBlank()) {
                    demo.setAuthToken("gyansetu_demo_token_aarav");
                    userRepository.save(demo);
                }
                tokenCache.put(demo.getAuthToken(), demo);
            }
        } catch (Exception e) {
            System.err.println("Notice: Could not pre-seed demo account: " + e.getMessage());
        }
    }

    public Optional<User> validateToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return Optional.empty();
        }
        String token = rawToken.trim();
        if (token.toLowerCase().startsWith("bearer ")) {
            token = token.substring(7).trim();
        }
        if (token.isEmpty()) {
            return Optional.empty();
        }

        User cached = tokenCache.get(token);
        if (cached != null) {
            return Optional.of(cached);
        }

        Optional<User> found = userRepository.findByAuthToken(token);
        found.ifPresent(u -> tokenCache.put(u.getAuthToken(), u));
        return found;
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

        // Generate session/auth token
        String token = "gyansetu_token_" + UUID.randomUUID().toString().replace("-", "");
        user.setAuthToken(token);

        User savedUser = userRepository.save(user);
        tokenCache.put(token, savedUser);

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

        // Update login timestamp & generate new fresh session token
        String token = "gyansetu_token_" + UUID.randomUUID().toString().replace("-", "");
        user.setAuthToken(token);
        user.setLastLoginAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        tokenCache.put(token, savedUser);

        return new AuthResponse(
                true,
                "Login successful!",
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
}
