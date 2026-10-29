package org.gyansetu.model;

public class ExamClashWarning {
    private String id;
    private String exam1Id;
    private String exam1Title;
    private String exam1Date;
    private String exam2Id;
    private String exam2Title;
    private String exam2Date;
    private int daysApart;
    private String severity; // CRITICAL_SAME_DAY, TRAVEL_CONFLICT_HIGH, MODERATE
    private String recommendationAdvice;

    public ExamClashWarning() {}

    public ExamClashWarning(String id, String exam1Id, String exam1Title, String exam1Date,
                            String exam2Id, String exam2Title, String exam2Date,
                            int daysApart, String severity, String recommendationAdvice) {
        this.id = id;
        this.exam1Id = exam1Id;
        this.exam1Title = exam1Title;
        this.exam1Date = exam1Date;
        this.exam2Id = exam2Id;
        this.exam2Title = exam2Title;
        this.exam2Date = exam2Date;
        this.daysApart = daysApart;
        this.severity = severity;
        this.recommendationAdvice = recommendationAdvice;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getExam1Id() { return exam1Id; }
    public void setExam1Id(String exam1Id) { this.exam1Id = exam1Id; }

    public String getExam1Title() { return exam1Title; }
    public void setExam1Title(String exam1Title) { this.exam1Title = exam1Title; }

    public String getExam1Date() { return exam1Date; }
    public void setExam1Date(String exam1Date) { this.exam1Date = exam1Date; }

    public String getExam2Id() { return exam2Id; }
    public void setExam2Id(String exam2Id) { this.exam2Id = exam2Id; }

    public String getExam2Title() { return exam2Title; }
    public void setExam2Title(String exam2Title) { this.exam2Title = exam2Title; }

    public String getExam2Date() { return exam2Date; }
    public void setExam2Date(String exam2Date) { this.exam2Date = exam2Date; }

    public int getDaysApart() { return daysApart; }
    public void setDaysApart(int daysApart) { this.daysApart = daysApart; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getRecommendationAdvice() { return recommendationAdvice; }
    public void setRecommendationAdvice(String recommendationAdvice) { this.recommendationAdvice = recommendationAdvice; }
}
