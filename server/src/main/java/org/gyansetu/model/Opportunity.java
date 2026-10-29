package org.gyansetu.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Opportunity {
    private String id;
    private String title;
    private OpportunityType type;
    private String organization;
    private String description;
    private String applicationDeadline;
    private String examOrDisbursementDate;
    private String officialUrl;
    private String officialPdfNotificationUrl;
    private String lastVerifiedDate;
    private boolean isGovVerified = true;
    private String benefitsOrSalary;
    private double applicationFeeGeneral;
    private double applicationFeeReserved;
    private double applicationFeeFemale;
    private boolean hasFeeWaiver = false;
    private String feeWaiverNotes;
    private int minAge = 18;
    private int maxAge = 30;
    private int ageRelaxationOBC = 3;
    private int ageRelaxationSCST = 5;
    private double minGraduationMarksPercent = 0.0;
    private double minTwelfthMarksPercent = 0.0;
    private Double maxAnnualFamilyIncome = null;
    private String minEducationLevel = "Graduate";
    private String genderEligibility = "ALL";
    private List<String> categoryQuotas = new ArrayList<>();
    private List<String> eligibleStreams = new ArrayList<>();
    private List<String> eligibleStates = new ArrayList<>();
    private List<String> requiredDocuments = new ArrayList<>();
    private List<String> syllabusTopics = new ArrayList<>();
    private int preparationTimeMonths = 6;
    private int vacanciesOrSeats = 0;
    private String competitionLevel = "Moderate";

    public Opportunity() {}

    public Opportunity(String id, String title, OpportunityType type, String organization, String description,
                       String applicationDeadline, String examOrDisbursementDate, String officialUrl,
                       String officialPdfNotificationUrl, String lastVerifiedDate, String benefitsOrSalary,
                       double applicationFeeGeneral, double applicationFeeReserved, double applicationFeeFemale,
                       boolean hasFeeWaiver, String feeWaiverNotes, int minAge, int maxAge,
                       double minGraduationMarksPercent, Double maxAnnualFamilyIncome) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.organization = organization;
        this.description = description;
        this.applicationDeadline = applicationDeadline;
        this.examOrDisbursementDate = examOrDisbursementDate;
        this.officialUrl = officialUrl;
        this.officialPdfNotificationUrl = officialPdfNotificationUrl;
        this.lastVerifiedDate = lastVerifiedDate;
        this.benefitsOrSalary = benefitsOrSalary;
        this.applicationFeeGeneral = applicationFeeGeneral;
        this.applicationFeeReserved = applicationFeeReserved;
        this.applicationFeeFemale = applicationFeeFemale;
        this.hasFeeWaiver = hasFeeWaiver;
        this.feeWaiverNotes = feeWaiverNotes;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.minGraduationMarksPercent = minGraduationMarksPercent;
        this.maxAnnualFamilyIncome = maxAnnualFamilyIncome;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public OpportunityType getType() { return type; }
    public void setType(OpportunityType type) { this.type = type; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(String applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public String getExamOrDisbursementDate() { return examOrDisbursementDate; }
    public void setExamOrDisbursementDate(String examOrDisbursementDate) { this.examOrDisbursementDate = examOrDisbursementDate; }

    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }

    public String getOfficialPdfNotificationUrl() { return officialPdfNotificationUrl; }
    public void setOfficialPdfNotificationUrl(String officialPdfNotificationUrl) { this.officialPdfNotificationUrl = officialPdfNotificationUrl; }

    public String getLastVerifiedDate() { return lastVerifiedDate; }
    public void setLastVerifiedDate(String lastVerifiedDate) { this.lastVerifiedDate = lastVerifiedDate; }

    public boolean isGovVerified() { return isGovVerified; }
    public void setGovVerified(boolean isGovVerified) { this.isGovVerified = isGovVerified; }

    public String getBenefitsOrSalary() { return benefitsOrSalary; }
    public void setBenefitsOrSalary(String benefitsOrSalary) { this.benefitsOrSalary = benefitsOrSalary; }

    public double getApplicationFeeGeneral() { return applicationFeeGeneral; }
    public void setApplicationFeeGeneral(double applicationFeeGeneral) { this.applicationFeeGeneral = applicationFeeGeneral; }

    public double getApplicationFeeReserved() { return applicationFeeReserved; }
    public void setApplicationFeeReserved(double applicationFeeReserved) { this.applicationFeeReserved = applicationFeeReserved; }

    public double getApplicationFeeFemale() { return applicationFeeFemale; }
    public void setApplicationFeeFemale(double applicationFeeFemale) { this.applicationFeeFemale = applicationFeeFemale; }

    public boolean isHasFeeWaiver() { return hasFeeWaiver; }
    public void setHasFeeWaiver(boolean hasFeeWaiver) { this.hasFeeWaiver = hasFeeWaiver; }

    public String getFeeWaiverNotes() { return feeWaiverNotes; }
    public void setFeeWaiverNotes(String feeWaiverNotes) { this.feeWaiverNotes = feeWaiverNotes; }

    public int getMinAge() { return minAge; }
    public void setMinAge(int minAge) { this.minAge = minAge; }

    public int getMaxAge() { return maxAge; }
    public void setMaxAge(int maxAge) { this.maxAge = maxAge; }

    public int getAgeRelaxationOBC() { return ageRelaxationOBC; }
    public void setAgeRelaxationOBC(int ageRelaxationOBC) { this.ageRelaxationOBC = ageRelaxationOBC; }

    public int getAgeRelaxationSCST() { return ageRelaxationSCST; }
    public void setAgeRelaxationSCST(int ageRelaxationSCST) { this.ageRelaxationSCST = ageRelaxationSCST; }

    public double getMinGraduationMarksPercent() { return minGraduationMarksPercent; }
    public void setMinGraduationMarksPercent(double minGraduationMarksPercent) { this.minGraduationMarksPercent = minGraduationMarksPercent; }

    public double getMinTwelfthMarksPercent() { return minTwelfthMarksPercent; }
    public void setMinTwelfthMarksPercent(double minTwelfthMarksPercent) { this.minTwelfthMarksPercent = minTwelfthMarksPercent; }

    public Double getMaxAnnualFamilyIncome() { return maxAnnualFamilyIncome; }
    public void setMaxAnnualFamilyIncome(Double maxAnnualFamilyIncome) { this.maxAnnualFamilyIncome = maxAnnualFamilyIncome; }

    public List<String> getEligibleStreams() { return eligibleStreams; }
    public void setEligibleStreams(List<String> eligibleStreams) { this.eligibleStreams = eligibleStreams; }

    public List<String> getEligibleStates() { return eligibleStates; }
    public void setEligibleStates(List<String> eligibleStates) { this.eligibleStates = eligibleStates; }

    public List<String> getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(List<String> requiredDocuments) { this.requiredDocuments = requiredDocuments; }

    public List<String> getSyllabusTopics() { return syllabusTopics; }
    public void setSyllabusTopics(List<String> syllabusTopics) { this.syllabusTopics = syllabusTopics; }

    public int getPreparationTimeMonths() { return preparationTimeMonths; }
    public void setPreparationTimeMonths(int preparationTimeMonths) { this.preparationTimeMonths = preparationTimeMonths; }

    public int getVacanciesOrSeats() { return vacanciesOrSeats; }
    public void setVacanciesOrSeats(int vacanciesOrSeats) { this.vacanciesOrSeats = vacanciesOrSeats; }

    public String getCompetitionLevel() { return competitionLevel; }
    public void setCompetitionLevel(String competitionLevel) { this.competitionLevel = competitionLevel; }

    public String getMinEducationLevel() { return minEducationLevel; }
    public void setMinEducationLevel(String minEducationLevel) { this.minEducationLevel = minEducationLevel; }

    public String getGenderEligibility() { return genderEligibility; }
    public void setGenderEligibility(String genderEligibility) { this.genderEligibility = genderEligibility; }

    public List<String> getCategoryQuotas() { return categoryQuotas; }
    public void setCategoryQuotas(List<String> categoryQuotas) { this.categoryQuotas = categoryQuotas; }
}
