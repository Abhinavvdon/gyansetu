package org.gyansetu.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gyansetu.model.StudentProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatbotService {

    private final DataRepository repository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key:}")
    private String defaultApiKey;

    public ChatbotService(DataRepository repository) {
        this.repository = repository;
    }

    public Map<String, Object> askGemini(
            String userApiKey,
            String userMessage,
            String lang,
            StudentProfile clientProfile,
            List<Map<String, String>> chatHistory) throws Exception {

        String effectiveKey = (userApiKey != null && !userApiKey.trim().isEmpty())
                ? userApiKey.trim()
                : defaultApiKey;

        if (effectiveKey == null || effectiveKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Gemini API key is required. Please provide a valid Gemini API key from Google AI Studio (https://aistudio.google.com/app/apikey).");
        }

        StudentProfile profile = (clientProfile != null) ? clientProfile : repository.getDefaultProfile();
        String prompt = buildSystemPrompt(userMessage, lang, profile, chatHistory);

        String[] models = {"gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"};
        Exception lastException = null;

        for (String model : models) {
            try {
                String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + effectiveKey;

                Map<String, Object> textPart = new HashMap<>();
                textPart.put("text", prompt);

                Map<String, Object> content = new HashMap<>();
                content.put("parts", Collections.singletonList(textPart));

                Map<String, Object> generationConfig = new HashMap<>();
                generationConfig.put("temperature", 0.7);
                generationConfig.put("topP", 0.95);
                generationConfig.put("maxOutputTokens", 2048);

                Map<String, Object> requestBody = new HashMap<>();
                requestBody.put("contents", Collections.singletonList(content));
                requestBody.put("generationConfig", generationConfig);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode candidates = root.path("candidates");
                    if (candidates.isArray() && candidates.size() > 0) {
                        JsonNode parts = candidates.get(0).path("content").path("parts");
                        if (parts.isArray() && parts.size() > 0) {
                            String replyText = parts.get(0).path("text").asText();
                            Map<String, Object> result = new HashMap<>();
                            result.put("success", true);
                            result.put("reply", replyText.trim());
                            result.put("model", model);
                            return result;
                        }
                    }
                }
            } catch (Exception e) {
                lastException = e;
            }
        }

        String errorMsg = (lastException != null) ? lastException.getMessage() : "Unknown API communication failure";
        throw new IllegalStateException("Failed to get response from Gemini API: " + errorMsg);
    }

    private String buildSystemPrompt(String userMessage, String lang, StudentProfile profile, List<Map<String, String>> chatHistory) {
        StringBuilder sb = new StringBuilder();

        sb.append("You are GyanSetu's AI Study Mentor & Timetable Architect (ज्ञानसेतु अध्ययन व समय-सारणी मार्गदर्शक) for Indian students.\n\n");

        sb.append("STUDENT PROFILE CONTEXT:\n");
        if (profile != null) {
            if (profile.getFullName() != null && !profile.getFullName().isEmpty()) {
                sb.append("- Name: ").append(profile.getFullName()).append("\n");
            }
            if (profile.getCurrentDegree() != null) {
                sb.append("- Current Course/Degree: ").append(profile.getCurrentDegree())
                  .append(" (Year: ").append(profile.getCurrentYear())
                  .append(", Stream: ").append(profile.getStream() != null ? profile.getStream() : "General").append(")\n");
            }
            if (profile.getAlreadyPursuedLevel() != null) {
                sb.append("- Completed Level: ").append(profile.getAlreadyPursuedLevel())
                  .append(profile.getAlreadyPursuedStream() != null ? " in " + profile.getAlreadyPursuedStream() : "")
                  .append("\n");
            }
            sb.append("- Past Marks: 10th: ").append(profile.getTenthMarksPercent()).append("%")
              .append(", 12th: ").append(profile.getTwelfthMarksPercent()).append("%")
              .append(", UG: ").append(profile.getUgMarksPercent()).append("%\n");
            if (profile.getCategory() != null) {
                sb.append("- Reservation Category: ").append(profile.getCategory()).append("\n");
            }
            if (profile.getStateDomicile() != null) {
                sb.append("- State Domicile: ").append(profile.getStateDomicile()).append("\n");
            }
            if (profile.getCareerGoals() != null && !profile.getCareerGoals().isEmpty()) {
                sb.append("- Career Goals / Target Exams: ").append(String.join(", ", profile.getCareerGoals())).append("\n");
            }
        } else {
            sb.append("- Profile: Indian undergraduate/college student preparing for competitive exams & higher studies.\n");
        }

        sb.append("\nYOUR EXPERTISE & MISSION:\n");
        sb.append("1. Provide practical, high-yield study timetables (daily, weekly, 30/60/90 days), backlog clearance schedules, and subject distribution plans.\n");
        sb.append("2. If asked for a study timetable, format it with specific time slots (e.g. 6:30 AM - 8:00 AM, Evening blocks), factoring in typical Indian college hours (e.g. 9 AM - 5 PM) and commutes.\n");
        sb.append("3. For multi-exam preparation (e.g. GATE vs Placement vs Semester exams, or SSC CGL + Banking), highlight syllabus synergies and overlapping topics.\n");
        sb.append("4. Give actionable revision methods (Spaced repetition, Active recall, PYQ solving slots, and mock test cadence).\n");
        sb.append("5. Language instructions: ");
        if ("hi".equalsIgnoreCase(lang)) {
            sb.append("Respond in clean, polite Hindi (Devanagari script) with Hinglish terminology where appropriate for engineering/exam terms (like 'mock test', 'slot', 'syllabus', 'revision').\n");
        } else {
            sb.append("Respond in fluent, encouraging, well-structured English.\n");
        }

        sb.append("6. Markdown Formatting Rules:\n");
        sb.append("   - Use '### ' for major headings.\n");
        sb.append("   - Use '#### ' for time slots or sub-sections (e.g. '#### 06:30 AM - 08:00 AM | Slot 1: Core Theory').\n");
        sb.append("   - Use bullet points ('* ') with bold '**' for clear key actions.\n");
        sb.append("   - Use blockquote ('> ') for critical motivational tips or golden rules.\n");

        if (chatHistory != null && !chatHistory.isEmpty()) {
            sb.append("\nRECENT CHAT CONTEXT:\n");
            int start = Math.max(0, chatHistory.size() - 4);
            for (int i = start; i < chatHistory.size(); i++) {
                Map<String, String> msg = chatHistory.get(i);
                String sender = msg.getOrDefault("sender", "user");
                String text = msg.getOrDefault("text", "");
                sb.append(sender.toUpperCase()).append(": ").append(text).append("\n");
            }
        }

        sb.append("\nCURRENT STUDENT QUERY: \"").append(userMessage).append("\"\n");
        sb.append("Please provide your comprehensive, structured, and empathetic study response now:\n");

        return sb.toString();
    }
}
