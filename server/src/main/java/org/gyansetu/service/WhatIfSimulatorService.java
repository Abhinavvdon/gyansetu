package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WhatIfSimulatorService {

    private final DataRepository repository;
    private final EligibilityEngineService eligibilityEngine;

    public WhatIfSimulatorService(DataRepository repository, EligibilityEngineService eligibilityEngine) {
        this.repository = repository;
        this.eligibilityEngine = eligibilityEngine;
    }

    public WhatIfSimulationResponse simulate(StudentProfile baselineProfile, WhatIfSimulationRequest request) {
        WhatIfSimulationResponse response = new WhatIfSimulationResponse();

        // 1. Evaluate baseline
        List<EligibilityReport> baselineReports = eligibilityEngine.evaluateAll(baselineProfile);
        long baselineEligible = baselineReports.stream()
                .filter(r -> r.getConfidenceLevel() == ConfidenceLevel.ELIGIBLE || r.getConfidenceLevel() == ConfidenceLevel.LIKELY_ELIGIBLE)
                .count();
        response.setBaselineEligibleCount((int) baselineEligible);

        // 2. Create simulated profile clone
        StudentProfile simulated = cloneProfile(baselineProfile);
        if (request.getSimulatedUgMarks() != null) simulated.setUgMarksPercent(request.getSimulatedUgMarks());
        if (request.getSimulatedTwelfthMarks() != null) simulated.setTwelfthMarksPercent(request.getSimulatedTwelfthMarks());
        if (request.getSimulatedCategory() != null) simulated.setCategory(request.getSimulatedCategory());
        if (request.getSimulatedIncome() != null) simulated.setAnnualFamilyIncome(request.getSimulatedIncome());
        if (request.getSimulatedAge() != null) simulated.setAge(request.getSimulatedAge());
        if (request.getSimulatedDegreeCompleted() != null && request.getSimulatedDegreeCompleted()) {
            simulated.setEducationLevel("UG Completed");
        }

        // 3. Evaluate simulated profile
        List<EligibilityReport> simulatedReports = eligibilityEngine.evaluateAll(simulated);
        long simulatedEligible = simulatedReports.stream()
                .filter(r -> r.getConfidenceLevel() == ConfidenceLevel.ELIGIBLE || r.getConfidenceLevel() == ConfidenceLevel.LIKELY_ELIGIBLE)
                .count();
        response.setSimulatedEligibleCount((int) simulatedEligible);
        response.setNetUnlockedCount((int) Math.max(0, simulatedEligible - baselineEligible));

        // 4. Identify unlocked opportunities
        List<WhatIfSimulationResponse.UnlockedItem> unlockedItems = new ArrayList<>();
        for (EligibilityReport simRep : simulatedReports) {
            boolean isEligibleInSim = (simRep.getConfidenceLevel() == ConfidenceLevel.ELIGIBLE || simRep.getConfidenceLevel() == ConfidenceLevel.LIKELY_ELIGIBLE);
            EligibilityReport baseRep = baselineReports.stream()
                    .filter(b -> b.getOpportunityId().equals(simRep.getOpportunityId()))
                    .findFirst().orElse(null);

            boolean wasIneligibleInBase = baseRep == null || baseRep.getConfidenceLevel() == ConfidenceLevel.NOT_ELIGIBLE || baseRep.getConfidenceLevel() == ConfidenceLevel.NEEDS_VERIFICATION;

            if (isEligibleInSim && wasIneligibleInBase) {
                Opportunity opp = repository.getOpportunities().get(simRep.getOpportunityId());
                String reason = "Unlocked by your simulated profile criteria!";
                if (request.getSimulatedUgMarks() != null && opp.getMinGraduationMarksPercent() > 0 && request.getSimulatedUgMarks() >= opp.getMinGraduationMarksPercent()) {
                    reason = "Unlocked: Your simulated UG marks (" + request.getSimulatedUgMarks() + "%) cross the minimum " + opp.getMinGraduationMarksPercent() + "% requirement!";
                } else if (request.getSimulatedIncome() != null && opp.getMaxAnnualFamilyIncome() != null && request.getSimulatedIncome() <= opp.getMaxAnnualFamilyIncome()) {
                    reason = "Unlocked: Family income under ₹" + String.format("%.0f", opp.getMaxAnnualFamilyIncome()) + " qualifies for 100% DBT stipend.";
                } else if (request.getSimulatedCategory() != null) {
                    reason = "Unlocked: Reservation criteria and fee exemptions for " + request.getSimulatedCategory() + " applied.";
                }

                unlockedItems.add(new WhatIfSimulationResponse.UnlockedItem(
                        opp.getId(),
                        opp.getTitle(),
                        opp.getType(),
                        reason,
                        opp.getBenefitsOrSalary()
                ));
            }
        }
        response.setUnlockedOpportunities(unlockedItems);

        // 5. Strategic insights
        List<String> insights = new ArrayList<>();
        if (request.getSimulatedUgMarks() != null && request.getSimulatedUgMarks() >= 60.0) {
            insights.add("Academic Milestone: Reaching 60%+ in your degree removes all eligibility filters for premier B-School CAT & Top Central University Master's programs.");
        }
        if (request.getSimulatedIncome() != null && request.getSimulatedIncome() <= 250000.0) {
            insights.add("Scholarship Boost: An annual family income under ₹2.5 Lakh unlocks full tuition reimbursement + monthly maintenance via Post-Matric schemes.");
        }
        if (request.getSimulatedCategory() != null && !request.getSimulatedCategory().equalsIgnoreCase(baselineProfile.getCategory())) {
            insights.add("Category Impact: " + request.getSimulatedCategory() + " status provides age relaxations (up to +5 years) and eliminates exam application fees for central notifications.");
        }
        if (insights.isEmpty()) {
            insights.add("Simulation verified: You have broad cross-opportunity eligibility across both civil services, defense, and public sector banking.");
        }
        response.setStrategicInsights(insights);

        return response;
    }

    private StudentProfile cloneProfile(StudentProfile original) {
        StudentProfile clone = new StudentProfile();
        clone.setId(original.getId());
        clone.setFullName(original.getFullName());
        clone.setEducationLevel(original.getEducationLevel());
        clone.setCurrentDegree(original.getCurrentDegree());
        clone.setStream(original.getStream());
        clone.setTenthMarksPercent(original.getTenthMarksPercent());
        clone.setTwelfthMarksPercent(original.getTwelfthMarksPercent());
        clone.setUgMarksPercent(original.getUgMarksPercent());
        clone.setCategory(original.getCategory());
        clone.setAnnualFamilyIncome(original.getAnnualFamilyIncome());
        clone.setStateDomicile(original.getStateDomicile());
        clone.setAge(original.getAge());
        clone.setGender(original.getGender());
        clone.setCareerGoals(new ArrayList<>(original.getCareerGoals()));
        clone.setPreferredLanguages(new ArrayList<>(original.getPreferredLanguages()));
        clone.setSavedOpportunityIds(new java.util.HashSet<>(original.getSavedOpportunityIds()));
        return clone;
    }
}
