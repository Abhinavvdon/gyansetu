package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PlannerService {

    private final DataRepository repository;
    private final EligibilityEngineService eligibilityEngine;

    public PlannerService(DataRepository repository, EligibilityEngineService eligibilityEngine) {
        this.repository = repository;
        this.eligibilityEngine = eligibilityEngine;
    }

    public List<PlannedOpportunity> getPrioritizedPlan(StudentProfile profile) {
        List<EligibilityReport> reports = eligibilityEngine.evaluateAll(profile);
        List<PlannedOpportunity> plan = new ArrayList<>();

        for (EligibilityReport report : reports) {
            Opportunity opp = repository.getOpportunities().get(report.getOpportunityId());
            if (opp == null) continue;

            PlannedOpportunity item = new PlannedOpportunity();
            item.setOpportunityId(opp.getId());
            item.setTitle(opp.getTitle());
            item.setType(opp.getType());
            item.setApplicationDeadline(opp.getApplicationDeadline());
            item.setDaysRemaining(report.getDaysRemainingToDeadline());
            item.setConfidenceLevel(report.getConfidenceLevel());
            item.setConfidenceScore(report.getConfidenceScore());
            item.setPreparationTimeMonths(opp.getPreparationTimeMonths());
            item.setBenefits(opp.getBenefitsOrSalary());
            item.setOfficialUrl(opp.getOfficialUrl());
            item.setSaved(profile.getSavedOpportunityIds().contains(opp.getId()));

            // Smart Priority Score: 0 to 100
            // Factors: Confidence (40%), Deadline Urgency (30%), Vacancies/Reward (30%)
            int score = (int) (report.getConfidenceScore() * 0.45);
            if (item.getDaysRemaining() <= 15) {
                score += 35; // Urgent
            } else if (item.getDaysRemaining() <= 30) {
                score += 25;
            } else {
                score += 15;
            }

            if (opp.getVacanciesOrSeats() > 10000) {
                score += 20;
            } else {
                score += 10;
            }

            item.setPriorityScore(Math.min(100, score));

            if (item.getPriorityScore() >= 80) {
                item.setPriorityBand("TOP_PRIORITY (Apply / Prep Immediately)");
            } else if (item.getPriorityScore() >= 60) {
                item.setPriorityBand("SECONDARY_TARGET (High Potential)");
            } else {
                item.setPriorityBand("BACKUP_OPTION (Keep Track)");
            }

            plan.add(item);
        }

        // Sort descending by priority score
        plan.sort((a, b) -> Integer.compare(b.getPriorityScore(), a.getPriorityScore()));
        return plan;
    }

    public static class PlannedOpportunity {
        private String opportunityId;
        private String title;
        private OpportunityType type;
        private String applicationDeadline;
        private long daysRemaining;
        private ConfidenceLevel confidenceLevel;
        private int confidenceScore;
        private int preparationTimeMonths;
        private String benefits;
        private String officialUrl;
        private boolean isSaved;
        private int priorityScore;
        private String priorityBand;

        public PlannedOpportunity() {}

        public String getOpportunityId() { return opportunityId; }
        public void setOpportunityId(String opportunityId) { this.opportunityId = opportunityId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public OpportunityType getType() { return type; }
        public void setType(OpportunityType type) { this.type = type; }
        public String getApplicationDeadline() { return applicationDeadline; }
        public void setApplicationDeadline(String applicationDeadline) { this.applicationDeadline = applicationDeadline; }
        public long getDaysRemaining() { return daysRemaining; }
        public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }
        public ConfidenceLevel getConfidenceLevel() { return confidenceLevel; }
        public void setConfidenceLevel(ConfidenceLevel confidenceLevel) { this.confidenceLevel = confidenceLevel; }
        public int getConfidenceScore() { return confidenceScore; }
        public void setConfidenceScore(int confidenceScore) { this.confidenceScore = confidenceScore; }
        public int getPreparationTimeMonths() { return preparationTimeMonths; }
        public void setPreparationTimeMonths(int preparationTimeMonths) { this.preparationTimeMonths = preparationTimeMonths; }
        public String getBenefits() { return benefits; }
        public void setBenefits(String benefits) { this.benefits = benefits; }
        public String getOfficialUrl() { return officialUrl; }
        public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }
        public boolean isSaved() { return isSaved; }
        public void setSaved(boolean saved) { isSaved = saved; }
        public int getPriorityScore() { return priorityScore; }
        public void setPriorityScore(int priorityScore) { this.priorityScore = priorityScore; }
        public String getPriorityBand() { return priorityBand; }
        public void setPriorityBand(String priorityBand) { this.priorityBand = priorityBand; }
    }
}
