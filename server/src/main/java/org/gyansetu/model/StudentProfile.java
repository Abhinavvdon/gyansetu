package org.gyansetu.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class StudentProfile {
    private String id = "student_default";
    private String fullName = "Aarav Sharma";
    private String educationLevel = "UG Pursuing"; // 10th, 12th, UG Pursuing, UG Completed, PG
    private String currentDegree = "B.Tech Computer Science";
    private int currentYear = 3;
    private String stream = "Engineering / Technology";
    private double tenthMarksPercent = 88.5;
    private double twelfthMarksPercent = 84.0;
    private double ugMarksPercent = 74.2;
    private String category = "OBC-NCL"; // General, OBC-NCL, SC, ST, EWS, PwD
    private double annualFamilyIncome = 240000.0; // In INR
    private String stateDomicile = "Madhya Pradesh";
    private String dateOfBirth = "2004-03-12";
    private int age = 22;
    private String gender = "Male";
    private List<String> careerGoals = new ArrayList<>();
    private List<String> preferredLanguages = new ArrayList<>();
    private Set<String> savedOpportunityIds = new HashSet<>();
    private Set<String> appliedOpportunityIds = new HashSet<>();

    public StudentProfile() {
        this.careerGoals.add("Govt Jobs (SSC / UPSC / State PSC)");
        this.careerGoals.add("Higher Studies (GATE / M.Tech / MBA)");
        this.careerGoals.add("National & State Scholarships");
        this.preferredLanguages.add("Hindi");
        this.preferredLanguages.add("English");
        this.savedOpportunityIds.add("ssc_cgl_2027");
        this.savedOpportunityIds.add("pm_usp_scholarship");
        this.savedOpportunityIds.add("gate_2027");
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public String getCurrentDegree() { return currentDegree; }
    public void setCurrentDegree(String currentDegree) { this.currentDegree = currentDegree; }

    public int getCurrentYear() { return currentYear; }
    public void setCurrentYear(int currentYear) { this.currentYear = currentYear; }

    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }

    public double getTenthMarksPercent() { return tenthMarksPercent; }
    public void setTenthMarksPercent(double tenthMarksPercent) { this.tenthMarksPercent = tenthMarksPercent; }

    public double getTwelfthMarksPercent() { return twelfthMarksPercent; }
    public void setTwelfthMarksPercent(double twelfthMarksPercent) { this.twelfthMarksPercent = twelfthMarksPercent; }

    public double getUgMarksPercent() { return ugMarksPercent; }
    public void setUgMarksPercent(double ugMarksPercent) { this.ugMarksPercent = ugMarksPercent; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getAnnualFamilyIncome() { return annualFamilyIncome; }
    public void setAnnualFamilyIncome(double annualFamilyIncome) { this.annualFamilyIncome = annualFamilyIncome; }

    public String getStateDomicile() { return stateDomicile; }
    public void setStateDomicile(String stateDomicile) { this.stateDomicile = stateDomicile; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public List<String> getCareerGoals() { return careerGoals; }
    public void setCareerGoals(List<String> careerGoals) { this.careerGoals = careerGoals; }

    public List<String> getPreferredLanguages() { return preferredLanguages; }
    public void setPreferredLanguages(List<String> preferredLanguages) { this.preferredLanguages = preferredLanguages; }

    public Set<String> getSavedOpportunityIds() { return savedOpportunityIds; }
    public void setSavedOpportunityIds(Set<String> savedOpportunityIds) { this.savedOpportunityIds = savedOpportunityIds; }

    public Set<String> getAppliedOpportunityIds() { return appliedOpportunityIds; }
    public void setAppliedOpportunityIds(Set<String> appliedOpportunityIds) { this.appliedOpportunityIds = appliedOpportunityIds; }
}
