package org.gyansetu.controller;

import org.gyansetu.model.StudentProfile;
import org.gyansetu.service.ChatbotService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @Value("${gemini.api.key:}")
    private String defaultApiKey;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    public static class ChatRequest {
        private String apiKey;
        private String message;
        private String lang = "en";
        private StudentProfile profile;
        private List<Map<String, String>> history;

        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getLang() { return lang; }
        public void setLang(String lang) { this.lang = lang; }

        public StudentProfile getProfile() { return profile; }
        public void setProfile(StudentProfile profile) { this.profile = profile; }

        public List<Map<String, String>> getHistory() { return history; }
        public void setHistory(List<Map<String, String>> history) { this.history = history; }
    }

    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> askChatbot(@RequestBody ChatRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            response.put("success", false);
            response.put("error", "Message cannot be empty.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Map<String, Object> result = chatbotService.askGemini(
                    request.getApiKey(),
                    request.getMessage(),
                    request.getLang(),
                    request.getProfile(),
                    request.getHistory()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Gemini AI processing error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("hasDefaultKey", defaultApiKey != null && !defaultApiKey.trim().isEmpty());
        return ResponseEntity.ok(status);
    }
}
