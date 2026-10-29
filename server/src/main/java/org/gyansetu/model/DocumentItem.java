package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class DocumentItem {
    private String id;
    private String name;
    private List<String> requiredByOpportunities = new ArrayList<>();
    private String status = "MISSING"; // READY, IN_PROGRESS, MISSING
    private int typicalLeadDays = 14;
    private String issuingAuthority;
    private String validityPeriod;
    private String proTips;
    private boolean isUrgent = false;

    public DocumentItem() {}

    public DocumentItem(String id, String name, int typicalLeadDays, String issuingAuthority,
                        String validityPeriod, String proTips, String status) {
        this.id = id;
        this.name = name;
        this.typicalLeadDays = typicalLeadDays;
        this.issuingAuthority = issuingAuthority;
        this.validityPeriod = validityPeriod;
        this.proTips = proTips;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<String> getRequiredByOpportunities() { return requiredByOpportunities; }
    public void setRequiredByOpportunities(List<String> requiredByOpportunities) { this.requiredByOpportunities = requiredByOpportunities; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTypicalLeadDays() { return typicalLeadDays; }
    public void setTypicalLeadDays(int typicalLeadDays) { this.typicalLeadDays = typicalLeadDays; }

    public String getIssuingAuthority() { return issuingAuthority; }
    public void setIssuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; }

    public String getValidityPeriod() { return validityPeriod; }
    public void setValidityPeriod(String validityPeriod) { this.validityPeriod = validityPeriod; }

    public String getProTips() { return proTips; }
    public void setProTips(String proTips) { this.proTips = proTips; }

    public boolean isUrgent() { return isUrgent; }
    public void setUrgent(boolean urgent) { isUrgent = urgent; }
}
