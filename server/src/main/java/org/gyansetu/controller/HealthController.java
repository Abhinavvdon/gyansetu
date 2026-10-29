package org.gyansetu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Fast, non-blocking health check controller for Render / Cloud load balancers.
 */
@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping({"/health", "/api/health"})
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "gyansetu-app");
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }
}
