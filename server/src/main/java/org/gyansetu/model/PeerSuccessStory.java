package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class PeerSuccessStory {
    private String id;
    private String studentAlias;
    private String homeState;
    private String collegeBackground;
    private double graduationMarks;
    private String socialCategory;
    private List<String> appliedCombo = new ArrayList<>();
    private String clearedExamOrAward;
    private String currentRoleOrStipend;
    private String strategicQuote;

    public PeerSuccessStory() {}

    public PeerSuccessStory(String id, String studentAlias, String homeState, String collegeBackground,
                            double graduationMarks, String socialCategory, String clearedExamOrAward,
                            String currentRoleOrStipend, String strategicQuote) {
        this.id = id;
        this.studentAlias = studentAlias;
        this.homeState = homeState;
        this.collegeBackground = collegeBackground;
        this.graduationMarks = graduationMarks;
        this.socialCategory = socialCategory;
        this.clearedExamOrAward = clearedExamOrAward;
        this.currentRoleOrStipend = currentRoleOrStipend;
        this.strategicQuote = strategicQuote;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentAlias() { return studentAlias; }
    public void setStudentAlias(String studentAlias) { this.studentAlias = studentAlias; }

    public String getHomeState() { return homeState; }
    public void setHomeState(String homeState) { this.homeState = homeState; }

    public String getCollegeBackground() { return collegeBackground; }
    public void setCollegeBackground(String collegeBackground) { this.collegeBackground = collegeBackground; }

    public double getGraduationMarks() { return graduationMarks; }
    public void setGraduationMarks(double graduationMarks) { this.graduationMarks = graduationMarks; }

    public String getSocialCategory() { return socialCategory; }
    public void setSocialCategory(String socialCategory) { this.socialCategory = socialCategory; }

    public List<String> getAppliedCombo() { return appliedCombo; }
    public void setAppliedCombo(List<String> appliedCombo) { this.appliedCombo = appliedCombo; }

    public String getClearedExamOrAward() { return clearedExamOrAward; }
    public void setClearedExamOrAward(String clearedExamOrAward) { this.clearedExamOrAward = clearedExamOrAward; }

    public String getCurrentRoleOrStipend() { return currentRoleOrStipend; }
    public void setCurrentRoleOrStipend(String currentRoleOrStipend) { this.currentRoleOrStipend = currentRoleOrStipend; }

    public String getStrategicQuote() { return strategicQuote; }
    public void setStrategicQuote(String strategicQuote) { this.strategicQuote = strategicQuote; }
}
