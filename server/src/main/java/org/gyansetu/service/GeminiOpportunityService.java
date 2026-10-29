package org.gyansetu.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gyansetu.model.Opportunity;
import org.gyansetu.model.OpportunityType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class GeminiOpportunityService {

    private final DataRepository repository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key:}")
    private String defaultApiKey;

    public GeminiOpportunityService(DataRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public List<Opportunity> generateAndSyncOpportunities(String userApiKey, String category, int count, String customFocus) throws Exception {
        String effectiveKey = (userApiKey != null && !userApiKey.trim().isEmpty())
                ? userApiKey.trim()
                : defaultApiKey;

        if (effectiveKey == null || effectiveKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Gemini API key is required. Please provide a valid Gemini API key from Google AI Studio.");
        }

        int requestedCount = Math.min(15, Math.max(1, count));
        String categoryInstruction = buildCategoryInstruction(category);

        String prompt = "You are GyanSetu's AI Opportunity and Career Intelligence Engine for Indian students.\n"
                + "Generate exactly " + requestedCount + " authentic, verified Indian educational opportunities.\n"
                + categoryInstruction + "\n"
                + (customFocus != null && !customFocus.trim().isEmpty() ? "Special Focus/Keywords: " + customFocus.trim() + "\n" : "")
                + "\nSTRICT RULES FOR HIGH FIDELITY:\n"
                + "1. Only authentic Central & State government schemes, national recruitment exams, and premier entrance tests.\n"
                + "2. Must provide real official portal URLs (e.g. *.gov.in, *.nic.in, or premier university *.ac.in).\n"
                + "3. Real financial amounts in INR (e.g. ₹50,000/year, ₹12,400/month fellowship, Pay Level 7).\n"
                + "4. Realistic Indian reservation categories (General, OBC-NCL, SC, ST, EWS).\n"
                + "5. Output strictly a JSON array matching this Opportunity schema without any extra text:\n"
                + "[\n"
                + "  {\n"
                + "    \"id\": \"unique_snake_case_id\",\n"
                + "    \"title\": \"Full Official Name\",\n"
                + "    \"type\": \"SCHOLARSHIP\" or \"GOVT_EXAM\" or \"HIGHER_STUDIES\",\n"
                + "    \"organization\": \"Conducting Authority / Ministry\",\n"
                + "    \"description\": \"Concise 2-line description\",\n"
                + "    \"applicationDeadline\": \"YYYY-MM-DD\",\n"
                + "    \"examOrDisbursementDate\": \"YYYY-MM-DD\",\n"
                + "    \"officialUrl\": \"https://...\",\n"
                + "    \"officialPdfNotificationUrl\": \"https://...\",\n"
                + "    \"lastVerifiedDate\": \"" + LocalDate.now() + "\",\n"
                + "    \"isGovVerified\": true,\n"
                + "    \"benefitsOrSalary\": \"Exact stipend or pay scale in INR\",\n"
                + "    \"applicationFeeGeneral\": 500.0,\n"
                + "    \"applicationFeeReserved\": 0.0,\n"
                + "    \"applicationFeeFemale\": 0.0,\n"
                + "    \"hasFeeWaiver\": true,\n"
                + "    \"feeWaiverNotes\": \"Details on concessions\",\n"
                + "    \"minAge\": 18,\n"
                + "    \"maxAge\": 30,\n"
                + "    \"ageRelaxationOBC\": 3,\n"
                + "    \"ageRelaxationSCST\": 5,\n"
                + "    \"minGraduationMarksPercent\": 50.0,\n"
                + "    \"minTwelfthMarksPercent\": 60.0,\n"
                + "    \"maxAnnualFamilyIncome\": 450000.0,\n"
                + "    \"minEducationLevel\": \"Graduate\",\n"
                + "    \"genderEligibility\": \"ALL\",\n"
                + "    \"categoryQuotas\": [\"General\", \"OBC-NCL\", \"SC\", \"ST\", \"EWS\"],\n"
                + "    \"eligibleStreams\": [\"Any Stream\"],\n"
                + "    \"eligibleStates\": [\"All India\"],\n"
                + "    \"requiredDocuments\": [\"Marksheet\", \"Income Certificate\", \"Govt ID\"],\n"
                + "    \"syllabusTopics\": [\"General Studies\", \"Quantitative Aptitude\"],\n"
                + "    \"preparationTimeMonths\": 6,\n"
                + "    \"vacanciesOrSeats\": 5000,\n"
                + "    \"competitionLevel\": \"Moderate\"\n"
                + "  }\n"
                + "]";

        // Call Gemini API with structured JSON output
        String responseJson = callGeminiApi(effectiveKey, prompt);

        // Parse JSON array of opportunities
        List<Opportunity> newOpps = objectMapper.readValue(responseJson, new TypeReference<List<Opportunity>>() {});

        // Normalize and save into GyanSetu repository
        for (Opportunity opp : newOpps) {
            if (opp.getId() == null || opp.getId().trim().isEmpty()) {
                opp.setId("opp_" + UUID.randomUUID().toString().substring(0, 8));
            }
            if (opp.getType() == null) {
                opp.setType(OpportunityType.SCHOLARSHIP);
            }
            if (opp.getLastVerifiedDate() == null) {
                opp.setLastVerifiedDate(LocalDate.now().toString());
            }
            opp.setGovVerified(true);
            repository.addOpportunity(opp);
        }

        return newOpps;
    }

    private String buildCategoryInstruction(String category) {
        if (category == null || "ALL".equalsIgnoreCase(category)) {
            return "Mix evenly across: 'SCHOLARSHIP' (e.g. NSP, State schemes, Philanthropic), 'GOVT_EXAM' (e.g. UPSC, SSC, Railways, Banking, State PSCs), and 'HIGHER_STUDIES' (e.g. GATE, CAT, CUET-PG, IIT-JAM, NIMCET, NID).";
        } else if ("SCHOLARSHIP".equalsIgnoreCase(category)) {
            return "All opportunities MUST have type='SCHOLARSHIP'. Focus on Indian Central Sector (NSP), State Post-Matric schemes, and major philanthropic trusts (Tata, Reliance, Aditya Birla, HDFC).";
        } else if ("GOVT_EXAM".equalsIgnoreCase(category)) {
            return "All opportunities MUST have type='GOVT_EXAM'. Focus on major recruitment exams (UPSC, SSC CGL/CHSL/MTS, RRB Railways, IBPS/SBI Banking, State Public Service Commissions).";
        } else if ("HIGHER_STUDIES".equalsIgnoreCase(category)) {
            return "All opportunities MUST have type='HIGHER_STUDIES'. Focus on premier Indian postgraduate and master's entrance exams (GATE for IIT M.Tech/PSU, CAT for IIMs, CUET-PG for Central Universities, IIT JAM, NIMCET, CEED, NID, CLAT-PG).";
        }
        return "Category focus: " + category;
    }

    private String callGeminiApi(String apiKey, String prompt) throws Exception {
        String[] models = {"gemini-2.5-flash", "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-pro"};
        Exception lastException = null;

        for (String model : models) {
            try {
                String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;

                Map<String, Object> textPart = new HashMap<>();
                textPart.put("text", prompt);

                Map<String, Object> content = new HashMap<>();
                content.put("parts", Collections.singletonList(textPart));

                Map<String, Object> generationConfig = new HashMap<>();
                generationConfig.put("responseMimeType", "application/json");

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
                            String rawText = parts.get(0).path("text").asText();
                            // Clean up in case there are surrounding markdown fences
                            if (rawText.startsWith("```json")) {
                                rawText = rawText.substring(7);
                            }
                            if (rawText.startsWith("```")) {
                                rawText = rawText.substring(3);
                            }
                            if (rawText.endsWith("```")) {
                                rawText = rawText.substring(0, rawText.length() - 3);
                            }
                            return rawText.trim();
                        }
                    }
                }
            } catch (Exception e) {
                lastException = e;
            }
        }

        throw new IllegalStateException("Failed to generate content from Gemini API: " + (lastException != null ? lastException.getMessage() : "Unknown error"));
    }
}
