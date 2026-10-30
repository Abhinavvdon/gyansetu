package org.gyansetu.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.gyansetu.model.*;
import org.gyansetu.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GyanSetuApiController {

    private final DataRepository repository;
    private final StudentProfileService profileService;
    private final EligibilityEngineService eligibilityService;
    private final PlannerService plannerService;
    private final OverlapDetectorService overlapService;
    private final WhatIfSimulatorService whatIfService;
    private final DocumentReadinessService documentService;
    private final NotificationTrackerService notificationService;
    private final GapAnalysisService gapAnalysisService;
    private final CareerPlanningService careerService;
    private final CostAndClashService costAndClashService;
    private final TrustAndEngagementService trustService;

    public GyanSetuApiController(
            DataRepository repository,
            StudentProfileService profileService,
            EligibilityEngineService eligibilityService,
            PlannerService plannerService,
            OverlapDetectorService overlapService,
            WhatIfSimulatorService whatIfService,
            DocumentReadinessService documentService,
            NotificationTrackerService notificationService,
            GapAnalysisService gapAnalysisService,
            CareerPlanningService careerService,
            CostAndClashService costAndClashService,
            TrustAndEngagementService trustService) {
        this.repository = repository;
        this.profileService = profileService;
        this.eligibilityService = eligibilityService;
        this.plannerService = plannerService;
        this.overlapService = overlapService;
        this.whatIfService = whatIfService;
        this.documentService = documentService;
        this.notificationService = notificationService;
        this.gapAnalysisService = gapAnalysisService;
        this.careerService = careerService;
        this.costAndClashService = costAndClashService;
        this.trustService = trustService;
    }

    // --- 1. PROFILE API (PostgreSQL Persisted) ---
    @GetMapping("/profile")
    public ResponseEntity<StudentProfile> getProfile(
            HttpServletRequest request,
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long authUserId = (Long) request.getAttribute("authenticatedUserId");
        Long effUserId = authUserId != null ? authUserId : (userId != null ? userId : headerUserId);
        if (effUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(profileService.getOrCreateProfile(effUserId));
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfile> updateProfile(
            HttpServletRequest request,
            @RequestBody StudentProfile updated,
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long authUserId = (Long) request.getAttribute("authenticatedUserId");
        Long effUserId = authUserId != null ? authUserId : (updated.getUserId() != null ? updated.getUserId() : (userId != null ? userId : headerUserId));
        if (effUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        StudentProfile saved = profileService.saveOrUpdateProfile(effUserId, updated);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/profile/toggle-save/{id}")
    public ResponseEntity<Map<String, Object>> toggleSave(
            HttpServletRequest request,
            @PathVariable String id,
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long authUserId = (Long) request.getAttribute("authenticatedUserId");
        Long effUserId = authUserId != null ? authUserId : (userId != null ? userId : headerUserId);
        if (effUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(profileService.toggleSaveOpportunity(effUserId, id));
    }

    // --- 2. OPPORTUNITY DISCOVERY API ---
    @GetMapping("/opportunities")
    public ResponseEntity<List<Opportunity>> getOpportunities(
            @RequestParam(required = false) OpportunityType type,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String search) {
        List<Opportunity> list = new ArrayList<>(repository.getOpportunities().values());

        if (type != null) {
            list.removeIf(o -> o.getType() != type);
        }
        if (state != null && !state.isEmpty() && !"All India".equalsIgnoreCase(state)) {
            list.removeIf(o -> !o.getEligibleStates().contains("All India") && !o.getEligibleStates().contains(state));
        }
        if (search != null && !search.trim().isEmpty()) {
            String q = search.toLowerCase();
            list.removeIf(o -> !o.getTitle().toLowerCase().contains(q) &&
                    !o.getOrganization().toLowerCase().contains(q) &&
                    !o.getDescription().toLowerCase().contains(q));
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/opportunities/{id}")
    public ResponseEntity<Opportunity> getOpportunityDetail(@PathVariable String id) {
        Opportunity opp = repository.getOpportunities().get(id);
        if (opp == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(opp);
    }

    // --- 3. AI-BASED ELIGIBILITY MATCHING API ---
    @GetMapping("/eligibility")
    public ResponseEntity<List<EligibilityReport>> getEligibilityReports(
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(eligibilityService.evaluateAll(profileService.getOrCreateProfile(effUserId)));
    }

    @GetMapping("/eligibility/{id}")
    public ResponseEntity<EligibilityReport> getSingleEligibility(
            @PathVariable String id,
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Opportunity opp = repository.getOpportunities().get(id);
        if (opp == null) return ResponseEntity.notFound().build();
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(eligibilityService.evaluateOpportunity(opp, profileService.getOrCreateProfile(effUserId)));
    }

    // --- 4. SMART OPPORTUNITY PLANNER API ---
    @GetMapping("/planner")
    public ResponseEntity<List<PlannerService.PlannedOpportunity>> getPlanner(
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(plannerService.getPrioritizedPlan(profileService.getOrCreateProfile(effUserId)));
    }

    // --- 5. PREPARATION OVERLAP DETECTOR API ---
    @PostMapping("/overlap/analyze")
    public ResponseEntity<SyllabusOverlapAnalysis> analyzeOverlap(@RequestBody(required = false) Map<String, List<String>> payload) {
        List<String> examIds = (payload != null && payload.containsKey("examIds")) ? payload.get("examIds") : null;
        return ResponseEntity.ok(overlapService.analyzeExams(examIds));
    }

    // --- 6. WHAT-IF ELIGIBILITY SIMULATOR API ---
    @PostMapping("/what-if/simulate")
    public ResponseEntity<WhatIfSimulationResponse> simulateWhatIf(
            @RequestBody WhatIfSimulationRequest request,
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(whatIfService.simulate(profileService.getOrCreateProfile(effUserId), request));
    }

    // --- 7. DOCUMENT READINESS CHECKER API ---
    @GetMapping("/documents")
    public ResponseEntity<List<DocumentItem>> getDocuments(
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(documentService.getReadinessChecklist(effUserId));
    }

    @PatchMapping("/documents/{id}/status")
    public ResponseEntity<DocumentItem> updateDocStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        DocumentItem updated = documentService.updateStatus(effUserId, id, status);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    // --- 8. NOTIFICATION CHANGE TRACKER API ---
    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationChange>> getNotificationChanges() {
        return ResponseEntity.ok(notificationService.getLiveChanges());
    }

    // --- 9. MISSED-IT-BY-HOW-MUCH GAP ANALYSIS API ---
    @GetMapping("/gap-analysis")
    public ResponseEntity<List<GapAnalysis>> getGapAnalysis(
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(gapAnalysisService.analyzeGaps(profileService.getOrCreateProfile(effUserId)));
    }

    // --- 10. ELIGIBILITY TIMELINE (FUTURE HORIZON) API ---
    @GetMapping("/timeline")
    public ResponseEntity<List<CareerTimelineNode>> getCareerTimeline(
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(careerService.generateTimeline(profileService.getOrCreateProfile(effUserId)));
    }

    // --- 11. APPLICATION COST PLANNER & CONCESSION FINDER API ---
    @GetMapping("/costs")
    public ResponseEntity<ApplicationCostPlan> getCosts(
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(costAndClashService.calculateCosts(profileService.getOrCreateProfile(effUserId)));
    }

    // --- 12. EXAM CLASH DETECTOR API ---
    @GetMapping("/clashes")
    public ResponseEntity<List<ExamClashWarning>> getClashes(
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long effUserId = userId != null ? userId : headerUserId;
        return ResponseEntity.ok(costAndClashService.detectClashes(profileService.getOrCreateProfile(effUserId)));
    }

    // --- 13. TRUST, SCAM ALERTS & PEER SUCCESS PATHS API ---
    @GetMapping("/scam-alerts")
    public ResponseEntity<List<ScamAlert>> getScamAlerts() {
        return ResponseEntity.ok(trustService.getScamAlerts());
    }

    @PostMapping("/scam-alerts/report")
    public ResponseEntity<ScamAlert> reportScam(@RequestBody ScamAlert report) {
        return ResponseEntity.ok(trustService.reportScamAlert(report));
    }

    @PostMapping("/scam-alerts/analyze-text")
    public ResponseEntity<Map<String, Object>> analyzeScamText(@RequestBody Map<String, String> payload) {
        String text = payload != null ? payload.get("text") : "";
        String apiKey = payload != null ? payload.get("apiKey") : null;
        return ResponseEntity.ok(trustService.analyzeNoticeOrMessage(text, apiKey));
    }

    @PostMapping("/verify-url")
    public ResponseEntity<UrlVerificationResult> verifyUrl(@RequestBody Map<String, String> payload) {
        String url = payload != null ? payload.get("url") : "";
        return ResponseEntity.ok(trustService.verifyUrl(url));
    }

    @GetMapping("/peer-stories")
    public ResponseEntity<List<PeerSuccessStory>> getPeerStories() {
        return ResponseEntity.ok(trustService.getPeerStories());
    }

    // --- 14. WEEKLY ACTION DIGEST & PARENT MODE API ---
    @GetMapping("/digest")
    public ResponseEntity<WeeklyDigest> getWeeklyDigest(
            HttpServletRequest request,
            @RequestParam(required = false) Long userId,
            @RequestHeader(value = "X-User-Id", required = false) Long headerUserId) {
        Long authUserId = (Long) request.getAttribute("authenticatedUserId");
        Long effUserId = authUserId != null ? authUserId : (userId != null ? userId : headerUserId);
        if (effUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(trustService.generateWeeklyDigest(profileService.getOrCreateProfile(effUserId)));
    }
}
