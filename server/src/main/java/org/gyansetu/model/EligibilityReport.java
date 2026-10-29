package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class EligibilityReport {
    private String opportunityId;
    private String opportunityTitle;
    private OpportunityType opportunityType;
    private ConfidenceLevel confidenceLevel;
    private int confidenceScore; // 0 - 100
    private List<String> reasonsWhyQualified = new ArrayList<>();
    private List<String> missingCriteria = new ArrayList<>();
    private List<String> appliedRelaxations = new ArrayList<>();
    private String officialUrl;
    private String officialPdfNotificationUrl;
    private String lastVerifiedDate;
    private boolean isGovVerified;
    private long daysRemainingToDeadline;
    private double calculatedApplicationFee;
    private String feeConcessionStatus;

    public EligibilityReport() {}

    // Getters and Setters
    public String getOpportunityId() { return opportunityId; }
    public void setOpportunityId(String opportunityId) { this.opportunityId = opportunityId; }

    public String getOpportunityTitle() { return opportunityTitle; }
    public void setOpportunityTitle(String opportunityTitle) { this.opportunityTitle = opportunityTitle; }

    public OpportunityType getOpportunityType() { return opportunityType; }
    public void setOpportunityType(OpportunityType opportunityType) { this.opportunityType = opportunityType; }

    public ConfidenceLevel getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(ConfidenceLevel confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public int getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(int confidenceScore) { this.confidenceScore = confidenceScore; }

    public List<String> getReasonsWhyQualified() { return reasonsWhyQualified; }
    public void setReasonsWhyQualified(List<String> reasonsWhyQualified) { this.reasonsWhyQualified = reasonsWhyQualified; }

    public List<String> getMissingCriteria() { return missingCriteria; }
    public void setMissingCriteria(List<String> missingCriteria) { this.missingCriteria = missingCriteria; }

    public List<String> getAppliedRelaxations() { return appliedRelaxations; }
    public void setAppliedRelaxations(List<String> appliedRelaxations) { this.appliedRelaxations = appliedRelaxations; }

    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }

    public String getOfficialPdfNotificationUrl() { return officialPdfNotificationUrl; }
    public void setOfficialPdfNotificationUrl(String officialPdfNotificationUrl) { this.officialPdfNotificationUrl = officialPdfNotificationUrl; }

    public String getLastVerifiedDate() { return lastVerifiedDate; }
    public void setLastVerifiedDate(String lastVerifiedDate) { this.lastVerifiedDate = lastVerifiedDate; }

    public boolean isGovVerified() { return isGovVerified; }
    public void setGovVerified(boolean isGovVerified) { this.isGovVerified = isGovVerified; }

    public long getDaysRemainingToDeadline() { return daysRemainingToDeadline; }
    public void setDaysRemainingToDeadline(long daysRemainingToDeadline) { this.daysRemainingToDeadline = daysRemainingToDeadline; }

    public double getCalculatedApplicationFee() { return calculatedApplicationFee; }
    public void setCalculatedApplicationFee(double calculatedApplicationFee) { this.calculatedApplicationFee = calculatedApplicationFee; }

    public String getFeeConcessionStatus() { return feeConcessionStatus; }
    public void setFeeConcessionStatus(String feeConcessionStatus) { this.feeConcessionStatus = feeConcessionStatus; }
}
