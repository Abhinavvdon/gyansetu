package org.gyansetu.model;

public class NotificationChange {
    private String id;
    private String opportunityId;
    private String opportunityTitle;
    private String changeType; // DEADLINE_EXTENDED, VACANCY_INCREASED, AGE_REVISED, CORRIGENDUM
    private String headline;
    private String summary;
    private String oldValue;
    private String newValue;
    private String dateDetected;
    private String officialGazetteLink;
    private boolean verifiedByAdmin = true;

    public NotificationChange() {}

    public NotificationChange(String id, String opportunityId, String opportunityTitle, String changeType,
                              String headline, String summary, String oldValue, String newValue,
                              String dateDetected, String officialGazetteLink) {
        this.id = id;
        this.opportunityId = opportunityId;
        this.opportunityTitle = opportunityTitle;
        this.changeType = changeType;
        this.headline = headline;
        this.summary = summary;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.dateDetected = dateDetected;
        this.officialGazetteLink = officialGazetteLink;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOpportunityId() { return opportunityId; }
    public void setOpportunityId(String opportunityId) { this.opportunityId = opportunityId; }

    public String getOpportunityTitle() { return opportunityTitle; }
    public void setOpportunityTitle(String opportunityTitle) { this.opportunityTitle = opportunityTitle; }

    public String getChangeType() { return changeType; }
    public void setChangeType(String changeType) { this.changeType = changeType; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }

    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }

    public String getDateDetected() { return dateDetected; }
    public void setDateDetected(String dateDetected) { this.dateDetected = dateDetected; }

    public String getOfficialGazetteLink() { return officialGazetteLink; }
    public void setOfficialGazetteLink(String officialGazetteLink) { this.officialGazetteLink = officialGazetteLink; }

    public boolean isVerifiedByAdmin() { return verifiedByAdmin; }
    public void setVerifiedByAdmin(boolean verifiedByAdmin) { this.verifiedByAdmin = verifiedByAdmin; }
}
