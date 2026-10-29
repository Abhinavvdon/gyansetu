package org.gyansetu.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SyllabusOverlapAnalysis {
    private List<String> selectedExamIds = new ArrayList<>();
    private List<String> selectedExamTitles = new ArrayList<>();
    private List<String> commonSubjects = new ArrayList<>();
    private Map<String, List<String>> uniqueSubjectsPerExam = new HashMap<>();
    private int overallOverlapPercentage; // e.g. 78%
    private int estimatedStudyHoursSaved; // e.g. 140 hrs
    private String recommendedStrategy;
    private List<SubjectOverlapDetail> subjectBreakdown = new ArrayList<>();

    public static class SubjectOverlapDetail {
        private String subjectName;
        private int overlapPercent;
        private String syllabusDepthNotes;

        public SubjectOverlapDetail() {}
        public SubjectOverlapDetail(String subjectName, int overlapPercent, String syllabusDepthNotes) {
            this.subjectName = subjectName;
            this.overlapPercent = overlapPercent;
            this.syllabusDepthNotes = syllabusDepthNotes;
        }
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public int getOverlapPercent() { return overlapPercent; }
        public void setOverlapPercent(int overlapPercent) { this.overlapPercent = overlapPercent; }
        public String getSyllabusDepthNotes() { return syllabusDepthNotes; }
        public void setSyllabusDepthNotes(String syllabusDepthNotes) { this.syllabusDepthNotes = syllabusDepthNotes; }
    }

    public SyllabusOverlapAnalysis() {}

    // Getters and Setters
    public List<String> getSelectedExamIds() { return selectedExamIds; }
    public void setSelectedExamIds(List<String> selectedExamIds) { this.selectedExamIds = selectedExamIds; }

    public List<String> getSelectedExamTitles() { return selectedExamTitles; }
    public void setSelectedExamTitles(List<String> selectedExamTitles) { this.selectedExamTitles = selectedExamTitles; }

    public List<String> getCommonSubjects() { return commonSubjects; }
    public void setCommonSubjects(List<String> commonSubjects) { this.commonSubjects = commonSubjects; }

    public Map<String, List<String>> getUniqueSubjectsPerExam() { return uniqueSubjectsPerExam; }
    public void setUniqueSubjectsPerExam(Map<String, List<String>> uniqueSubjectsPerExam) { this.uniqueSubjectsPerExam = uniqueSubjectsPerExam; }

    public int getOverallOverlapPercentage() { return overallOverlapPercentage; }
    public void setOverallOverlapPercentage(int overallOverlapPercentage) { this.overallOverlapPercentage = overallOverlapPercentage; }

    public int getEstimatedStudyHoursSaved() { return estimatedStudyHoursSaved; }
    public void setEstimatedStudyHoursSaved(int estimatedStudyHoursSaved) { this.estimatedStudyHoursSaved = estimatedStudyHoursSaved; }

    public String getRecommendedStrategy() { return recommendedStrategy; }
    public void setRecommendedStrategy(String recommendedStrategy) { this.recommendedStrategy = recommendedStrategy; }

    public List<SubjectOverlapDetail> getSubjectBreakdown() { return subjectBreakdown; }
    public void setSubjectBreakdown(List<SubjectOverlapDetail> subjectBreakdown) { this.subjectBreakdown = subjectBreakdown; }
}
