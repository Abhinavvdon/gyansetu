package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class CostAndClashService {

    private final DataRepository repository;

    public CostAndClashService(DataRepository repository) {
        this.repository = repository;
    }

    public ApplicationCostPlan calculateCosts(StudentProfile profile) {
        ApplicationCostPlan costPlan = new ApplicationCostPlan();
        double standardTotal = 0;
        double studentDiscountedTotal = 0;

        Set<String> targetIds = profile.getSavedOpportunityIds();
        if (targetIds == null || targetIds.isEmpty()) {
            targetIds = repository.getOpportunities().keySet();
        }

        boolean isFemale = "Female".equalsIgnoreCase(profile.getGender());
        boolean isReserved = "SC".equalsIgnoreCase(profile.getCategory()) ||
                "ST".equalsIgnoreCase(profile.getCategory()) ||
                "PwD".equalsIgnoreCase(profile.getCategory());
        boolean isEws = "EWS".equalsIgnoreCase(profile.getCategory());
        boolean isObc = "OBC-NCL".equalsIgnoreCase(profile.getCategory());

        for (String id : targetIds) {
            Opportunity opp = repository.getOpportunities().get(id);
            if (opp == null) continue;

            double origFee = opp.getApplicationFeeGeneral();
            double finalFee = origFee;
            String waiverApplied = "None (Standard Rate)";
            boolean isWaived = false;

            if (isFemale && opp.getApplicationFeeFemale() < origFee) {
                finalFee = opp.getApplicationFeeFemale();
                waiverApplied = finalFee == 0.0 ? "100% Women Candidate Exemption" : "Women Concession Rate";
                isWaived = (finalFee == 0.0);
            } else if (isReserved) {
                finalFee = opp.getApplicationFeeReserved();
                waiverApplied = finalFee == 0.0 ? "100% " + profile.getCategory() + " Exemption" : profile.getCategory() + " Concession Rate";
                isWaived = (finalFee == 0.0);
            } else if (opp.getType() == OpportunityType.SCHOLARSHIP) {
                finalFee = 0.0;
                waiverApplied = "Govt Scholarship (No Application Fee)";
                isWaived = true;
            }

            standardTotal += origFee;
            studentDiscountedTotal += finalFee;

            costPlan.getItemizedCosts().add(new ApplicationCostPlan.OpportunityCostDetail(
                    opp.getId(),
                    opp.getTitle(),
                    origFee,
                    finalFee,
                    isWaived,
                    waiverApplied
            ));
        }

        costPlan.setStandardTotalFee(standardTotal);
        costPlan.setStudentDiscountedTotalFee(studentDiscountedTotal);
        costPlan.setTotalSavedViaWaivers(Math.max(0, standardTotal - studentDiscountedTotal));

        // Travel and book estimations based on number of saved exams
        long examCount = targetIds.stream()
                .filter(id -> repository.getOpportunities().containsKey(id) && repository.getOpportunities().get(id).getType() == OpportunityType.GOVT_EXAM)
                .count();

        costPlan.setEstimatedTravelAndCenterCost(examCount * 800.0); // approx ₹800 travel/center per exam
        costPlan.setEstimatedBooksAndPrepCost(examCount > 0 ? 1500.0 : 0.0); // self-prep test series / books
        costPlan.setGrandTotalEstimatedExpense(studentDiscountedTotal + costPlan.getEstimatedTravelAndCenterCost() + costPlan.getEstimatedBooksAndPrepCost());

        return costPlan;
    }

    public List<ExamClashWarning> detectClashes(StudentProfile profile) {
        List<ExamClashWarning> clashes = new ArrayList<>();
        List<Opportunity> examList = new ArrayList<>();

        for (Opportunity opp : repository.getOpportunities().values()) {
            if (opp.getType() == OpportunityType.GOVT_EXAM || opp.getType() == OpportunityType.HIGHER_STUDIES) {
                examList.add(opp);
            }
        }

        // Compare pairwise dates
        for (int i = 0; i < examList.size(); i++) {
            for (int j = i + 1; j < examList.size(); j++) {
                Opportunity e1 = examList.get(i);
                Opportunity e2 = examList.get(j);

                try {
                    LocalDate d1 = LocalDate.parse(e1.getExamOrDisbursementDate());
                    LocalDate d2 = LocalDate.parse(e2.getExamOrDisbursementDate());
                    int daysDiff = (int) Math.abs(ChronoUnit.DAYS.between(d1, d2));

                    if (daysDiff <= 5) {
                        String severity = daysDiff == 0 ? "CRITICAL_SAME_DAY_CLASH" : (daysDiff <= 2 ? "HIGH_TRAVEL_CONFLICT" : "MODERATE_SCHEDULE_PROXIMITY");
                        String advice;

                        if (daysDiff == 0) {
                            advice = "Direct date clash! If exam centers are in different cities, you cannot attend both. Prioritise " +
                                    (e1.getVacanciesOrSeats() > e2.getVacanciesOrSeats() ? e1.getTitle() : e2.getTitle()) +
                                    " due to higher vacancy probability.";
                        } else {
                            advice = "These exams are only " + daysDiff + " days apart (" + e1.getExamOrDisbursementDate() + " vs " + e2.getExamOrDisbursementDate() + "). " +
                                    "Ensure you opt for exam centers within your home city/district to prevent travel fatigue.";
                        }

                        clashes.add(new ExamClashWarning(
                                "clash_" + e1.getId() + "_" + e2.getId(),
                                e1.getId(), e1.getTitle(), e1.getExamOrDisbursementDate(),
                                e2.getId(), e2.getTitle(), e2.getExamOrDisbursementDate(),
                                daysDiff, severity, advice
                        ));
                    }
                } catch (Exception ignored) {}
            }
        }

        return clashes;
    }
}
