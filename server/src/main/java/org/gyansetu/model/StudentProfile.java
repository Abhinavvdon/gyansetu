package org.gyansetu.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "student_profiles")
@JsonIgnoreProperties(ignoreUnknown = true)
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @Column(name = "user_id")
    private Long userId;

    private String id = "student_default";
    private String fullName = "Abhinav Dongre";
    private String educationLevel = "UG Pursuing"; // 10th, 12th, UG Pursuing, UG Completed, PG

    // Already Pursued (Completed Education)
    private String alreadyPursuedLevel = "12th"; // 10th, 12th, Diploma, UG, PG, PhD
    private String alreadyPursuedStream = "Science PCM"; // PCM, PCB, Commerce, Arts, etc.
    private String alreadyPursuedCourse = ""; // e.g. B.Tech, B.Sc, Diploma in EE
    private double tenthMarksPercent = 96.0;
    private double twelfthMarksPercent = 73.0;
    private double diplomaMarksPercent = 0.0;
    private double ugMarksPercent = 0.0; // 0 if not completed yet
    private double pgMarksPercent = 0.0;
    private String phdStatus = ""; // Completed, Submitted, etc.

    // Currently Pursuing (Ongoing Education)
    private String currentlyPursuingLevel = "UG"; // None, 10th, 12th, Diploma, UG, PG, PhD
    private String currentlyPursuingCourse = "B.Tech Electronics and Telecommunication";
    private int currentlyPursuingYear = 3;
    private String currentlyPursuingStream = "Engineering / Technology";
    private double currentCgpaOrAggregate = 0.0;

    // Backwards-compatible aliases
    private String currentDegree = "B.Tech Electronics and Telecommunication";
    private int currentYear = 3;
    private String stream = "Engineering / Technology";

    // Social & Personal
    private String category = "OBC-NCL"; // General, OBC-NCL, SC, ST, EWS, PwD
    private double annualFamilyIncome = 700000.0; // In INR
    private String stateDomicile = "Madhya Pradesh";
    private String dateOfBirth = "2006-03-12";
    private int age = 20;
    private String gender = "Male";

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_career_goals", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "goal")
    private List<String> careerGoals = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_preferred_languages", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "lang")
    private List<String> preferredLanguages = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_saved_opportunities", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "opportunity_id")
    private Set<String> savedOpportunityIds = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_applied_opportunities", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "opportunity_id")
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
    public Long getProfileId() { return profileId; }
    public void setProfileId(Long profileId) { this.profileId = profileId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEducationLevel() { return educationLevel; }
    public void setEducationLevel(String educationLevel) { this.educationLevel = educationLevel; }

    public String getAlreadyPursuedLevel() { return alreadyPursuedLevel; }
    public void setAlreadyPursuedLevel(String alreadyPursuedLevel) { this.alreadyPursuedLevel = alreadyPursuedLevel; }

    public String getAlreadyPursuedStream() { return alreadyPursuedStream; }
    public void setAlreadyPursuedStream(String alreadyPursuedStream) { this.alreadyPursuedStream = alreadyPursuedStream; }

    public String getAlreadyPursuedCourse() { return alreadyPursuedCourse; }
    public void setAlreadyPursuedCourse(String alreadyPursuedCourse) { this.alreadyPursuedCourse = alreadyPursuedCourse; }

    public double getTenthMarksPercent() { return tenthMarksPercent; }
    public void setTenthMarksPercent(double tenthMarksPercent) { this.tenthMarksPercent = tenthMarksPercent; }

    public double getTwelfthMarksPercent() { return twelfthMarksPercent; }
    public void setTwelfthMarksPercent(double twelfthMarksPercent) { this.twelfthMarksPercent = twelfthMarksPercent; }

    public double getDiplomaMarksPercent() { return diplomaMarksPercent; }
    public void setDiplomaMarksPercent(double diplomaMarksPercent) { this.diplomaMarksPercent = diplomaMarksPercent; }

    public double getUgMarksPercent() { return ugMarksPercent; }
    public void setUgMarksPercent(double ugMarksPercent) { this.ugMarksPercent = ugMarksPercent; }

    public double getPgMarksPercent() { return pgMarksPercent; }
    public void setPgMarksPercent(double pgMarksPercent) { this.pgMarksPercent = pgMarksPercent; }

    public String getPhdStatus() { return phdStatus; }
    public void setPhdStatus(String phdStatus) { this.phdStatus = phdStatus; }

    public String getCurrentlyPursuingLevel() { return currentlyPursuingLevel; }
    public void setCurrentlyPursuingLevel(String currentlyPursuingLevel) { this.currentlyPursuingLevel = currentlyPursuingLevel; }

    public String getCurrentlyPursuingCourse() { return currentlyPursuingCourse; }
    public void setCurrentlyPursuingCourse(String currentlyPursuingCourse) {
        this.currentlyPursuingCourse = currentlyPursuingCourse;
        this.currentDegree = currentlyPursuingCourse;
    }

    public int getCurrentlyPursuingYear() { return currentlyPursuingYear; }
    public void setCurrentlyPursuingYear(int currentlyPursuingYear) {
        this.currentlyPursuingYear = currentlyPursuingYear;
        this.currentYear = currentlyPursuingYear;
    }

    public String getCurrentlyPursuingStream() { return currentlyPursuingStream; }
    public void setCurrentlyPursuingStream(String currentlyPursuingStream) {
        this.currentlyPursuingStream = currentlyPursuingStream;
        this.stream = currentlyPursuingStream;
    }

    public double getCurrentCgpaOrAggregate() { return currentCgpaOrAggregate; }
    public void setCurrentCgpaOrAggregate(double currentCgpaOrAggregate) { this.currentCgpaOrAggregate = currentCgpaOrAggregate; }

    public String getCurrentDegree() { return currentDegree; }
    public void setCurrentDegree(String currentDegree) {
        this.currentDegree = currentDegree;
        this.currentlyPursuingCourse = currentDegree;
    }

    public int currentYear() { return currentYear; }
    public int getCurrentYear() { return currentYear; }
    public void setCurrentYear(int currentYear) {
        this.currentYear = currentYear;
        this.currentlyPursuingYear = currentYear;
    }

    public String getStream() { return stream; }
    public void setStream(String stream) {
        this.stream = stream;
        this.currentlyPursuingStream = stream;
    }

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
