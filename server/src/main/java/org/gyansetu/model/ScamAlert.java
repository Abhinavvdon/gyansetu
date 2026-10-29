package org.gyansetu.model;

public class ScamAlert {
    private String id;
    private String fakeClaimOrDomain;
    private String officialGenuinePortal;
    private String warningLevel; // DANGER, CAUTION, FRAUD_ALERT
    private String scamPatternDescription;
    private String safetyTip;
    private String dateReported;

    public ScamAlert() {}

    public ScamAlert(String id, String fakeClaimOrDomain, String officialGenuinePortal, String warningLevel,
                     String scamPatternDescription, String safetyTip, String dateReported) {
        this.id = id;
        this.fakeClaimOrDomain = fakeClaimOrDomain;
        this.officialGenuinePortal = officialGenuinePortal;
        this.warningLevel = warningLevel;
        this.scamPatternDescription = scamPatternDescription;
        this.safetyTip = safetyTip;
        this.dateReported = dateReported;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFakeClaimOrDomain() { return fakeClaimOrDomain; }
    public void setFakeClaimOrDomain(String fakeClaimOrDomain) { this.fakeClaimOrDomain = fakeClaimOrDomain; }

    public String getOfficialGenuinePortal() { return officialGenuinePortal; }
    public void setOfficialGenuinePortal(String officialGenuinePortal) { this.officialGenuinePortal = officialGenuinePortal; }

    public String getWarningLevel() { return warningLevel; }
    public void setWarningLevel(String warningLevel) { this.warningLevel = warningLevel; }

    public String getScamPatternDescription() { return scamPatternDescription; }
    public void setScamPatternDescription(String scamPatternDescription) { this.scamPatternDescription = scamPatternDescription; }

    public String getSafetyTip() { return safetyTip; }
    public void setSafetyTip(String safetyTip) { this.safetyTip = safetyTip; }

    public String getDateReported() { return dateReported; }
    public void setDateReported(String dateReported) { this.dateReported = dateReported; }
}
