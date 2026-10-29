package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class WhatIfSimulationResponse {
    private int baselineEligibleCount;
    private int simulatedEligibleCount;
    private int netUnlockedCount;
    private List<UnlockedItem> unlockedOpportunities = new ArrayList<>();
    private List<String> strategicInsights = new ArrayList<>();

    public static class UnlockedItem {
        private String id;
        private String title;
        private OpportunityType type;
        private String unlockReason;
        private String benefits;

        public UnlockedItem() {}
        public UnlockedItem(String id, String title, OpportunityType type, String unlockReason, String benefits) {
            this.id = id;
            this.title = title;
            this.type = type;
            this.unlockReason = unlockReason;
            this.benefits = benefits;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public OpportunityType getType() { return type; }
        public void setType(OpportunityType type) { this.type = type; }
        public String getUnlockReason() { return unlockReason; }
        public void setUnlockReason(String unlockReason) { this.unlockReason = unlockReason; }
        public String getBenefits() { return benefits; }
        public void setBenefits(String benefits) { this.benefits = benefits; }
    }

    public WhatIfSimulationResponse() {}

    public int getBaselineEligibleCount() { return baselineEligibleCount; }
    public void setBaselineEligibleCount(int baselineEligibleCount) { this.baselineEligibleCount = baselineEligibleCount; }

    public int getSimulatedEligibleCount() { return simulatedEligibleCount; }
    public void setSimulatedEligibleCount(int simulatedEligibleCount) { this.simulatedEligibleCount = simulatedEligibleCount; }

    public int getNetUnlockedCount() { return netUnlockedCount; }
    public void setNetUnlockedCount(int netUnlockedCount) { this.netUnlockedCount = netUnlockedCount; }

    public List<UnlockedItem> getUnlockedOpportunities() { return unlockedOpportunities; }
    public void setUnlockedOpportunities(List<UnlockedItem> unlockedOpportunities) { this.unlockedOpportunities = unlockedOpportunities; }

    public List<String> getStrategicInsights() { return strategicInsights; }
    public void setStrategicInsights(List<String> strategicInsights) { this.strategicInsights = strategicInsights; }
}
