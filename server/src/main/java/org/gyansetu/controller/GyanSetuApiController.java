package org.gyansetu.controller;

import org.gyansetu.model.*;
import org.gyansetu.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GyanSetuApiController {

    private final DataRepository repository;
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

    // --- 1. PROFILE API ---
    @GetMapping("/profile")
    public ResponseEntity<StudentProfile> getProfile() {
        return ResponseEntity.ok(repository.getDefaultProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentProfile> updateProfile(@RequestBody StudentProfile updated) {
        StudentProfile p = repository.getDefaultProfile();
        p.setFullName(updated.getFullName());
        p.setEducationLevel(updated.getEducationLevel());
        p.setCurrentDegree(updated.getCurrentDegree());
        p.setStream(updated.getStream());
        p.setTenthMarksPercent(updated.getTenthMarksPercent());
        p.setTwelfthMarksPercent(updated.getTwelfthMarksPercent());
        p.setUgMarksPercent(updated.getUgMarksPercent());
        p.setCategory(updated.getCategory());
        p.setAnnualFamilyIncome(updated.getAnnualFamilyIncome());
        p.setStateDomicile(updated.getStateDomicile());
        p.setAge(updated.getAge());
        p.setGender(updated.getGender());
        if (updated.getCareerGoals() != null) p.setCareerGoals(updated.getCareerGoals());
        if (updated.getPreferredLanguages() != null) p.setPreferredLanguages(updated.getPreferredLanguages());
        return ResponseEntity.ok(p);
    }

    @PostMapping("/profile/toggle-save/{id}")
    public ResponseEntity<Map<String, Object>> toggleSave(@PathVariable String id) {
        StudentProfile p = repository.getDefaultProfile();
        boolean isSaved;
        if (p.getSavedOpportunityIds().contains(id)) {
            p.getSavedOpportunityIds().remove(id);
            isSaved = false;
        } else {
            p.getSavedOpportunityIds().add(id);
            isSaved = true;
        }
        Map<String, Object> resp = new HashMap<>();
        resp.put("opportunityId", id);
        resp.put("isSaved", isSaved);
        resp.put("savedCount", p.getSavedOpportunityIds().size());
        return ResponseEntity.ok(resp);
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
    public ResponseEntity<List<EligibilityReport>> getEligibilityReports() {
        return ResponseEntity.ok(eligibilityService.evaluateAll(repository.getDefaultProfile()));
    }

    @GetMapping("/eligibility/{id}")
    public ResponseEntity<EligibilityReport> getSingleEligibility(@PathVariable String id) {
        Opportunity opp = repository.getOpportunities().get(id);
        if (opp == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(eligibilityService.evaluateOpportunity(opp, repository.getDefaultProfile()));
    }

    // --- 4. SMART OPPORTUNITY PLANNER API ---
    @GetMapping("/planner")
    public ResponseEntity<List<PlannerService.PlannedOpportunity>> getPlanner() {
        return ResponseEntity.ok(plannerService.getPrioritizedPlan(repository.getDefaultProfile()));
    }

    // --- 5. PREPARATION OVERLAP DETECTOR API ---
    @PostMapping("/overlap/analyze")
    public ResponseEntity<SyllabusOverlapAnalysis> analyzeOverlap(@RequestBody(required = false) Map<String, List<String>> payload) {
        List<String> examIds = (payload != null && payload.containsKey("examIds")) ? payload.get("examIds") : null;
        return ResponseEntity.ok(overlapService.analyzeExams(examIds));
    }

    // --- 6. WHAT-IF ELIGIBILITY SIMULATOR API ---
    @PostMapping("/what-if/simulate")
    public ResponseEntity<WhatIfSimulationResponse> simulateWhatIf(@RequestBody WhatIfSimulationRequest request) {
        return ResponseEntity.ok(whatIfService.simulate(repository.getDefaultProfile(), request));
    }

    // --- 7. DOCUMENT READINESS CHECKER API ---
    @GetMapping("/documents")
    public ResponseEntity<List<DocumentItem>> getDocuments() {
        return ResponseEntity.ok(documentService.getReadinessChecklist(repository.getDefaultProfile()));
    }

    @PatchMapping("/documents/{id}/status")
    public ResponseEntity<DocumentItem> updateDocStatus(@PathVariable String id, @RequestParam String status) {
        DocumentItem updated = documentService.updateStatus(id, status);
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
    public ResponseEntity<List<GapAnalysis>> getGapAnalysis() {
        return ResponseEntity.ok(gapAnalysisService.analyzeGaps(repository.getDefaultProfile()));
    }

    // --- 10. ELIGIBILITY TIMELINE (FUTURE HORIZON) API ---
    @GetMapping("/timeline")
    public ResponseEntity<List<CareerTimelineNode>> getCareerTimeline() {
        return ResponseEntity.ok(careerService.generateTimeline(repository.getDefaultProfile()));
    }

    // --- 11. APPLICATION COST PLANNER & CONCESSION FINDER API ---
    @GetMapping("/costs")
    public ResponseEntity<ApplicationCostPlan> getCosts() {
        return ResponseEntity.ok(costAndClashService.calculateCosts(repository.getDefaultProfile()));
    }

    // --- 12. EXAM CLASH DETECTOR API ---
    @GetMapping("/clashes")
    public ResponseEntity<List<ExamClashWarning>> getClashes() {
        return ResponseEntity.ok(costAndClashService.detectClashes(repository.getDefaultProfile()));
    }

    // --- 13. TRUST, SCAM ALERTS & PEER SUCCESS PATHS API ---
    @GetMapping("/scam-alerts")
    public ResponseEntity<List<ScamAlert>> getScamAlerts() {
        return ResponseEntity.ok(trustService.getScamAlerts());
    }

    @GetMapping("/peer-stories")
    public ResponseEntity<List<PeerSuccessStory>> getPeerStories() {
        return ResponseEntity.ok(trustService.getPeerStories());
    }

    // --- 14. WEEKLY ACTION DIGEST & PARENT MODE API ---
    @GetMapping("/digest")
    public ResponseEntity<WeeklyDigest> getWeeklyDigest() {
        return ResponseEntity.ok(trustService.generateWeeklyDigest(repository.getDefaultProfile()));
    }
}
