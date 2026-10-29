package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class EligibilityEngineService {

    private final DataRepository repository;

    public EligibilityEngineService(DataRepository repository) {
        this.repository = repository;
    }

    public List<EligibilityReport> evaluateAll(StudentProfile profile) {
        List<EligibilityReport> reports = new ArrayList<>();
        for (Opportunity opp : repository.getOpportunities().values()) {
            reports.add(evaluateOpportunity(opp, profile));
        }
        // Sort: ELIGIBLE first, then LIKELY_ELIGIBLE, NEEDS_VERIFICATION, NOT_ELIGIBLE
        reports.sort((a, b) -> Integer.compare(b.getConfidenceScore(), a.getConfidenceScore()));
        return reports;
    }

    public EligibilityReport evaluateOpportunity(Opportunity opp, StudentProfile profile) {
        EligibilityReport report = new EligibilityReport();
        report.setOpportunityId(opp.getId());
        report.setOpportunityTitle(opp.getTitle());
        report.setOpportunityType(opp.getType());
        report.setOfficialUrl(opp.getOfficialUrl());
        report.setOfficialPdfNotificationUrl(opp.getOfficialPdfNotificationUrl());
        report.setLastVerifiedDate(opp.getLastVerifiedDate());
        report.setGovVerified(opp.isGovVerified());

        // Calculate days to deadline
        try {
            LocalDate today = LocalDate.now();
            LocalDate deadline = LocalDate.parse(opp.getApplicationDeadline());
            long days = ChronoUnit.DAYS.between(today, deadline);
            report.setDaysRemainingToDeadline(Math.max(0, days));
        } catch (Exception e) {
            report.setDaysRemainingToDeadline(30);
        }

        // Fee concession calculation
        double fee = opp.getApplicationFeeGeneral();
        String feeConcession = "Standard General Fee";
        boolean isFemale = "Female".equalsIgnoreCase(profile.getGender());
        boolean isReserved = "SC".equalsIgnoreCase(profile.getCategory()) ||
                "ST".equalsIgnoreCase(profile.getCategory()) ||
                "PwD".equalsIgnoreCase(profile.getCategory());

        if (isFemale && opp.getApplicationFeeFemale() < fee) {
            fee = opp.getApplicationFeeFemale();
            feeConcession = fee == 0.0 ? "100% Fee Exemption for Female Candidates" : "Special Concession for Female Candidates";
        } else if (isReserved) {
            fee = opp.getApplicationFeeReserved();
            feeConcession = fee == 0.0 ? "100% Fee Waiver for " + profile.getCategory() + " Candidates" : "Concession for " + profile.getCategory();
        } else if ("EWS".equalsIgnoreCase(profile.getCategory()) || "OBC-NCL".equalsIgnoreCase(profile.getCategory())) {
            if (opp.getType() == OpportunityType.SCHOLARSHIP) {
                fee = 0.0;
                feeConcession = "Free Govt Scholarship Application";
            }
        }
        report.setCalculatedApplicationFee(fee);
        report.setFeeConcessionStatus(feeConcession);

        // Core Eligibility Checks
        int score = 100;
        List<String> reasons = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> relaxations = new ArrayList<>();

        // 1. Age check & Category Relaxation
        int effectiveMaxAge = opp.getMaxAge();
        if ("OBC-NCL".equalsIgnoreCase(profile.getCategory())) {
            effectiveMaxAge += opp.getAgeRelaxationOBC();
            relaxations.add("Age Relaxation applied: +" + opp.getAgeRelaxationOBC() + " Years for OBC-NCL (Max Age: " + effectiveMaxAge + " yrs)");
        } else if ("SC".equalsIgnoreCase(profile.getCategory()) || "ST".equalsIgnoreCase(profile.getCategory())) {
            effectiveMaxAge += opp.getAgeRelaxationSCST();
            relaxations.add("Age Relaxation applied: +" + opp.getAgeRelaxationSCST() + " Years for " + profile.getCategory() + " (Max Age: " + effectiveMaxAge + " yrs)");
        }

        if (profile.getAge() >= opp.getMinAge() && profile.getAge() <= effectiveMaxAge) {
            reasons.add("Age criterion met: Your age is " + profile.getAge() + " years (Allowed: " + opp.getMinAge() + " to " + effectiveMaxAge + " years).");
        } else if (profile.getAge() < opp.getMinAge()) {
            missing.add("Under minimum age limit: You need to be at least " + opp.getMinAge() + " years old.");
            score -= 40;
        } else {
            missing.add("Upper age limit exceeded: Age is " + profile.getAge() + " years, maximum permitted for your category is " + effectiveMaxAge + " years.");
            score -= 60;
        }

        // 2. Marks check
        if (opp.getMinGraduationMarksPercent() > 0) {
            if (profile.getUgMarksPercent() >= opp.getMinGraduationMarksPercent()) {
                reasons.add("Graduation Marks met: You have " + profile.getUgMarksPercent() + "% (Required: " + opp.getMinGraduationMarksPercent() + "%).");
            } else {
                missing.add("Graduation Marks gap: Minimum required is " + opp.getMinGraduationMarksPercent() + "% (You have " + profile.getUgMarksPercent() + "%).");
                score -= 35;
            }
        } else {
            reasons.add("No minimum graduation percentage barrier (Simple pass in Bachelor's Degree suffices).");
        }

        if (opp.getMinTwelfthMarksPercent() > 0) {
            if (profile.getTwelfthMarksPercent() >= opp.getMinTwelfthMarksPercent()) {
                reasons.add("Class 12th Marks met: You scored " + profile.getTwelfthMarksPercent() + "% (Cutoff: " + opp.getMinTwelfthMarksPercent() + "%).");
            } else {
                missing.add("Class 12th Marks gap: Requires at least " + opp.getMinTwelfthMarksPercent() + "% (You scored " + profile.getTwelfthMarksPercent() + "%).");
                score -= 35;
            }
        }

        // 3. Income check for Scholarships
        if (opp.getMaxAnnualFamilyIncome() != null) {
            if (profile.getAnnualFamilyIncome() <= opp.getMaxAnnualFamilyIncome()) {
                reasons.add("Income Eligibility met: Annual family income ₹" + String.format("%.0f", profile.getAnnualFamilyIncome()) + " is well within ₹" + String.format("%.0f", opp.getMaxAnnualFamilyIncome()) + " ceiling.");
            } else {
                missing.add("Income threshold exceeded: Scheme requires annual family income <= ₹" + String.format("%.0f", opp.getMaxAnnualFamilyIncome()) + " (Your profile indicates ₹" + String.format("%.0f", profile.getAnnualFamilyIncome()) + ").");
                score -= 50;
            }
        }

        // 4. Degree / Stream check
        if (opp.getId().equals("gate_2027")) {
            if (profile.getStream().toLowerCase().contains("engineering") || profile.getStream().toLowerCase().contains("science")) {
                reasons.add("Stream matches GATE criteria: " + profile.getStream() + " graduates are eligible.");
            } else {
                missing.add("GATE requires Engineering, Technology, or Master's in Science degrees.");
                score -= 40;
            }
        }

        if (opp.getId().equals("aicte_pragati")) {
            if (!"Female".equalsIgnoreCase(profile.getGender())) {
                missing.add("AICTE Pragati is exclusively for Female students.");
                score -= 70;
            } else {
                reasons.add("Gender qualification met: Eligible for AICTE Pragati Girls Quota.");
            }
        }

        // 5. Verification status flags
        if (score >= 90) {
            report.setConfidenceLevel(ConfidenceLevel.ELIGIBLE);
            report.setConfidenceScore(Math.min(100, score));
        } else if (score >= 70) {
            report.setConfidenceLevel(ConfidenceLevel.LIKELY_ELIGIBLE);
            report.setConfidenceScore(score);
            missing.add("Pending document submission: Keep fresh category certificate / college bonafide ready.");
        } else if (score >= 50) {
            report.setConfidenceLevel(ConfidenceLevel.NEEDS_VERIFICATION);
            report.setConfidenceScore(score);
            missing.add("Needs verification against state domicile & income certificates.");
        } else {
            report.setConfidenceLevel(ConfidenceLevel.NOT_ELIGIBLE);
            report.setConfidenceScore(Math.max(10, score));
        }

        report.setReasonsWhyQualified(reasons);
        report.setMissingCriteria(missing);
        report.setAppliedRelaxations(relaxations);

        return report;
    }
}
