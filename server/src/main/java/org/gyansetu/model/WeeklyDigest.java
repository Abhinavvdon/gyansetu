package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class WeeklyDigest {
    private String studentName;
    private String weekLabel;
    private int upcomingDeadlinesCount;
    private int newMatchesCount;
    private int documentsUrgentCount;
    private double feeSavingsToDate;
    private List<String> upcomingDeadlineHighlights = new ArrayList<>();
    private List<String> newMatchHighlights = new ArrayList<>();
    private List<String> urgentDocumentAlerts = new ArrayList<>();
    private String whatsAppFormattedMessage;
    private String hindiParentSummary;

    public WeeklyDigest() {}

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getWeekLabel() { return weekLabel; }
    public void setWeekLabel(String weekLabel) { this.weekLabel = weekLabel; }

    public int getUpcomingDeadlinesCount() { return upcomingDeadlinesCount; }
    public void setUpcomingDeadlinesCount(int upcomingDeadlinesCount) { this.upcomingDeadlinesCount = upcomingDeadlinesCount; }

    public int getNewMatchesCount() { return newMatchesCount; }
    public void setNewMatchesCount(int newMatchesCount) { this.newMatchesCount = newMatchesCount; }

    public int getDocumentsUrgentCount() { return documentsUrgentCount; }
    public void setDocumentsUrgentCount(int documentsUrgentCount) { this.documentsUrgentCount = documentsUrgentCount; }

    public double getFeeSavingsToDate() { return feeSavingsToDate; }
    public void setFeeSavingsToDate(double feeSavingsToDate) { this.feeSavingsToDate = feeSavingsToDate; }

    public List<String> getUpcomingDeadlineHighlights() { return upcomingDeadlineHighlights; }
    public void setUpcomingDeadlineHighlights(List<String> upcomingDeadlineHighlights) { this.upcomingDeadlineHighlights = upcomingDeadlineHighlights; }

    public List<String> getNewMatchHighlights() { return newMatchHighlights; }
    public void setNewMatchHighlights(List<String> newMatchHighlights) { this.newMatchHighlights = newMatchHighlights; }

    public List<String> getUrgentDocumentAlerts() { return urgentDocumentAlerts; }
    public void setUrgentDocumentAlerts(List<String> urgentDocumentAlerts) { this.urgentDocumentAlerts = urgentDocumentAlerts; }

    public String getWhatsAppFormattedMessage() { return whatsAppFormattedMessage; }
    public void setWhatsAppFormattedMessage(String whatsAppFormattedMessage) { this.whatsAppFormattedMessage = whatsAppFormattedMessage; }

    public String getHindiParentSummary() { return hindiParentSummary; }
    public void setHindiParentSummary(String hindiParentSummary) { this.hindiParentSummary = hindiParentSummary; }
}
