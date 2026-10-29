package org.gyansetu.controller;

import org.gyansetu.model.Opportunity;
import org.gyansetu.model.OpportunityType;
import org.gyansetu.service.DataRepository;
import org.gyansetu.service.GeminiOpportunityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/opportunities")
@CrossOrigin(origins = "*")
public class GeminiOpportunityController {

    private final GeminiOpportunityService geminiService;
    private final DataRepository repository;

    public GeminiOpportunityController(GeminiOpportunityService geminiService, DataRepository repository) {
        this.geminiService = geminiService;
        this.repository = repository;
    }

    public static class AiGenerateRequest {
        private String apiKey;
        private String category = "ALL";
        private int count = 5;
        private String customFocus;

        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }

        public String getCustomFocus() { return customFocus; }
        public void setCustomFocus(String customFocus) { this.customFocus = customFocus; }
    }

    @PostMapping("/ai-generate")
    public ResponseEntity<Map<String, Object>> generateOpportunitiesWithGemini(@RequestBody AiGenerateRequest req) {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<Opportunity> generated = geminiService.generateAndSyncOpportunities(
                    req.getApiKey(),
                    req.getCategory(),
                    req.getCount(),
                    req.getCustomFocus()
            );

            resp.put("success", true);
            resp.put("count", generated.size());
            resp.put("totalInCatalog", repository.getOpportunities().size());
            resp.put("opportunities", generated);
            resp.put("message", "Successfully generated and added " + generated.size() + " verified opportunities using Gemini API.");
            return ResponseEntity.ok(resp);
        } catch (IllegalArgumentException e) {
            resp.put("success", false);
            resp.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(resp);
        } catch (Exception e) {
            resp.put("success", false);
            resp.put("error", "Gemini API error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOpportunityCatalogStats() {
        Map<String, Opportunity> map = repository.getOpportunities();
        long scholarships = map.values().stream().filter(o -> o.getType() == OpportunityType.SCHOLARSHIP).count();
        long govtExams = map.values().stream().filter(o -> o.getType() == OpportunityType.GOVT_EXAM).count();
        long higherEd = map.values().stream().filter(o -> o.getType() == OpportunityType.HIGHER_STUDIES).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", map.size());
        stats.put("scholarships", scholarships);
        stats.put("govtExams", govtExams);
        stats.put("higherStudies", higherEd);
        return ResponseEntity.ok(stats);
    }
}
