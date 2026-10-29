package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class GapAnalysis {
    private String opportunityId;
    private String opportunityTitle;
    private OpportunityType opportunityType;
    private String exactGapStatement;
    private String gapParameter; // MARKS, AGE, EDUCATION_STATUS, INCOME
    private String studentCurrentValue;
    private String requiredThreshold;
    private String actionableRemedy;
    private List<ClosestAlternative> closestAlternatives = new ArrayList<>();

    public static class ClosestAlternative {
        private String id;
        private String title;
        private OpportunityType type;
        private String whyRecommended;

        public ClosestAlternative() {}
        public ClosestAlternative(String id, String title, OpportunityType type, String whyRecommended) {
            this.id = id;
            this.title = title;
            this.type = type;
            this.whyRecommended = whyRecommended;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public OpportunityType getType() { return type; }
        public void setType(OpportunityType type) { this.type = type; }
        public String getWhyRecommended() { return whyRecommended; }
        public void setWhyRecommended(String whyRecommended) { this.whyRecommended = whyRecommended; }
    }

    public GapAnalysis() {}

    public String getOpportunityId() { return opportunityId; }
    public void setOpportunityId(String opportunityId) { this.opportunityId = opportunityId; }

    public String getOpportunityTitle() { return opportunityTitle; }
    public void setOpportunityTitle(String opportunityTitle) { this.opportunityTitle = opportunityTitle; }

    public OpportunityType getOpportunityType() { return opportunityType; }
    public void setOpportunityType(OpportunityType opportunityType) { this.opportunityType = opportunityType; }

    public String getExactGapStatement() { return exactGapStatement; }
    public void setExactGapStatement(String exactGapStatement) { this.exactGapStatement = exactGapStatement; }

    public String getGapParameter() { return gapParameter; }
    public void setGapParameter(String gapParameter) { this.gapParameter = gapParameter; }

    public String getStudentCurrentValue() { return studentCurrentValue; }
    public void setStudentCurrentValue(String studentCurrentValue) { this.studentCurrentValue = studentCurrentValue; }

    public String getRequiredThreshold() { return requiredThreshold; }
    public void setRequiredThreshold(String requiredThreshold) { this.requiredThreshold = requiredThreshold; }

    public String getActionableRemedy() { return actionableRemedy; }
    public void setActionableRemedy(String actionableRemedy) { this.actionableRemedy = actionableRemedy; }

    public List<ClosestAlternative> getClosestAlternatives() { return closestAlternatives; }
    public void setClosestAlternatives(List<ClosestAlternative> closestAlternatives) { this.closestAlternatives = closestAlternatives; }
}
