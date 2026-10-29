package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class EligibilityEngineService {

    private static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");
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

        LocalDate today = LocalDate.now(IST_ZONE);

        // 1. Calculate days to deadline with Indian Standard Time
        try {
            LocalDate deadline = LocalDate.parse(opp.getApplicationDeadline());
            long days = ChronoUnit.DAYS.between(today, deadline);
            report.setDaysRemainingToDeadline(Math.max(0, days));
        } catch (Exception e) {
            report.setDaysRemainingToDeadline(30);
        }

        // 2. Fee concession calculation
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

        // 3. Core Eligibility Evaluation
        int score = 100;
        List<String> reasons = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<String> relaxations = new ArrayList<>();

        // A. Age calculation with DOB synchronization
        int studentAge = profile.getAge();
        if (profile.getDateOfBirth() != null && !profile.getDateOfBirth().trim().isEmpty()) {
            try {
                LocalDate dob = LocalDate.parse(profile.getDateOfBirth().trim());
                int calculatedAge = (int) ChronoUnit.YEARS.between(dob, today);
                if (calculatedAge > 10 && calculatedAge < 80) {
                    studentAge = calculatedAge;
                }
            } catch (Exception ignored) {}
        }

        int effectiveMaxAge = opp.getMaxAge();
        if ("OBC-NCL".equalsIgnoreCase(profile.getCategory())) {
            effectiveMaxAge += opp.getAgeRelaxationOBC();
            relaxations.add("Age Relaxation applied: +" + opp.getAgeRelaxationOBC() + " Years for OBC-NCL (Max Age: " + effectiveMaxAge + " yrs)");
        } else if ("SC".equalsIgnoreCase(profile.getCategory()) || "ST".equalsIgnoreCase(profile.getCategory())) {
            effectiveMaxAge += opp.getAgeRelaxationSCST();
            relaxations.add("Age Relaxation applied: +" + opp.getAgeRelaxationSCST() + " Years for " + profile.getCategory() + " (Max Age: " + effectiveMaxAge + " yrs)");
        }

        if (studentAge >= opp.getMinAge() && studentAge <= effectiveMaxAge) {
            reasons.add("Age criterion met: Your age is " + studentAge + " years (Allowed: " + opp.getMinAge() + " to " + effectiveMaxAge + " years).");
        } else if (studentAge < opp.getMinAge()) {
            missing.add("Under minimum age limit: You need to be at least " + opp.getMinAge() + " years old.");
            score -= 40;
        } else {
            missing.add("Upper age limit exceeded: Age is " + studentAge + " years, maximum permitted for your category is " + effectiveMaxAge + " years.");
            score -= 60;
        }

        // B. Graduation Marks & Currently Pursuing Check
        boolean isCurrentlyPursuingUg = "UG".equalsIgnoreCase(profile.getCurrentlyPursuingLevel()) ||
                (profile.getCurrentlyPursuingYear() > 0 && "UG".equalsIgnoreCase(profile.getEducationLevel())) ||
                ("12th".equalsIgnoreCase(profile.getAlreadyPursuedLevel()) && profile.getCurrentYear() > 0);

        boolean allowsPursuingCandidates = opp.getType() == OpportunityType.HIGHER_STUDIES ||
                opp.getTitle().toLowerCase().contains("gate") ||
                opp.getTitle().toLowerCase().contains("cat") ||
                opp.getTitle().toLowerCase().contains("cuet") ||
                opp.getTitle().toLowerCase().contains("scholarship") ||
                (opp.getDescription() != null && opp.getDescription().toLowerCase().contains("final year"));

        if (opp.getMinGraduationMarksPercent() > 0) {
            if (isCurrentlyPursuingUg && allowsPursuingCandidates) {
                // Pursuing students are eligible as appearing candidates!
                double ongoingMarks = profile.getCurrentCgpaOrAggregate();
                if (ongoingMarks > 0) {
                    double effectivePercent = ongoingMarks <= 10.0 ? ongoingMarks * 9.5 : ongoingMarks;
                    if (effectivePercent >= opp.getMinGraduationMarksPercent()) {
                        reasons.add("Eligible as Pursuing Candidate: Year " + profile.getCurrentlyPursuingYear() +
                                " ongoing score is " + String.format("%.1f", effectivePercent) + "% (Meets required " +
                                opp.getMinGraduationMarksPercent() + "% threshold).");
                    } else {
                        reasons.add("Eligible as Appearing Candidate (Final/pre-final year allowed; ongoing aggregate is " +
                                String.format("%.1f", effectivePercent) + "% vs target " + opp.getMinGraduationMarksPercent() + "%).");
                        score -= 10;
                    }
                } else {
                    reasons.add("Eligible as Appearing Candidate: Currently pursuing Year " +
                            (profile.getCurrentlyPursuingYear() > 0 ? profile.getCurrentlyPursuingYear() : profile.getCurrentYear()) +
                            " in " + (profile.getCurrentDegree() != null ? profile.getCurrentDegree() : "Bachelor's Degree") +
                            " without final degree completion barrier.");
                }
            } else if (isCurrentlyPursuingUg && !allowsPursuingCandidates) {
                missing.add("Degree completion required: Requires finalized graduation certificate before application deadline.");
                score -= 30;
            } else {
                // Completed UG candidate
                if (profile.getUgMarksPercent() >= opp.getMinGraduationMarksPercent()) {
                    reasons.add("Graduation Marks met: You scored " + profile.getUgMarksPercent() + "% (Required: " + opp.getMinGraduationMarksPercent() + "%).");
                } else {
                    missing.add("Graduation Marks gap: Minimum required is " + opp.getMinGraduationMarksPercent() + "% (You scored " + profile.getUgMarksPercent() + "%).");
                    score -= 35;
                }
            }
        } else {
            reasons.add("No minimum graduation percentage barrier (Simple pass in Bachelor's Degree suffices).");
        }

        // C. 12th Standard Marks Check
        if (opp.getMinTwelfthMarksPercent() > 0) {
            if (profile.getTwelfthMarksPercent() >= opp.getMinTwelfthMarksPercent()) {
                reasons.add("Class 12th Marks met: You scored " + profile.getTwelfthMarksPercent() + "% (Cutoff: " + opp.getMinTwelfthMarksPercent() + "%).");
            } else {
                missing.add("Class 12th Marks gap: Requires at least " + opp.getMinTwelfthMarksPercent() + "% (You scored " + profile.getTwelfthMarksPercent() + "%).");
                score -= 35;
            }
        }

        // D. Annual Family Income Ceiling Check
        if (opp.getMaxAnnualFamilyIncome() != null) {
            if (profile.getAnnualFamilyIncome() <= opp.getMaxAnnualFamilyIncome()) {
                reasons.add("Income Eligibility met: Annual family income ₹" + String.format("%.0f", profile.getAnnualFamilyIncome()) +
                        " is well within ₹" + String.format("%.0f", opp.getMaxAnnualFamilyIncome()) + " ceiling.");
            } else {
                missing.add("Income threshold exceeded: Scheme requires annual family income <= ₹" +
                        String.format("%.0f", opp.getMaxAnnualFamilyIncome()) + " (Your profile indicates ₹" +
                        String.format("%.0f", profile.getAnnualFamilyIncome()) + ").");
                score -= 50;
            }
        }

        // E. Gender Eligibility Check
        String genderElig = opp.getGenderEligibility() != null ? opp.getGenderEligibility().toUpperCase() : "ALL";
        boolean isGirlsExclusive = "FEMALE".equals(genderElig) ||
                opp.getTitle().toLowerCase().contains("pragati") ||
                opp.getTitle().toLowerCase().contains("girls") ||
                opp.getTitle().toLowerCase().contains("women");

        if (isGirlsExclusive) {
            if (!isFemale) {
                missing.add("Gender qualification: This opportunity is exclusively reserved for Female candidates.");
                score -= 70;
            } else {
                reasons.add("Gender qualification met: Eligible for Female / Girls Quota.");
            }
        }

        // F. Stream and Domain Check
        String studentStream = (profile.getStream() != null ? profile.getStream() : "") + " " +
                (profile.getCurrentDegree() != null ? profile.getCurrentDegree() : "") + " " +
                (profile.getAlreadyPursuedStream() != null ? profile.getAlreadyPursuedStream() : "");
        String studentStreamLower = studentStream.toLowerCase();

        boolean isEngineeringOrTech = studentStreamLower.contains("engineer") ||
                studentStreamLower.contains("b.tech") ||
                studentStreamLower.contains("b.e") ||
                studentStreamLower.contains("telecom") ||
                studentStreamLower.contains("electronics") ||
                studentStreamLower.contains("computer") ||
                studentStreamLower.contains("science") ||
                studentStreamLower.contains("technology");

        if (opp.getTitle().toLowerCase().contains("gate")) {
            if (isEngineeringOrTech) {
                reasons.add("Stream matches GATE criteria: " + (profile.getStream() != null ? profile.getStream() : "Engineering") + " candidates are eligible.");
            } else {
                missing.add("GATE requires Engineering, Technology, Architecture, or Master's in Science degrees.");
                score -= 40;
            }
        } else if (opp.getEligibleStreams() != null && !opp.getEligibleStreams().isEmpty()) {
            boolean matchesStream = false;
            for (String es : opp.getEligibleStreams()) {
                String esLower = es.toLowerCase();
                if (esLower.contains("any stream") || esLower.contains("all india") || esLower.contains("any")) {
                    matchesStream = true;
                    break;
                }
                if (studentStreamLower.contains(esLower) || esLower.contains(studentStreamLower)) {
                    matchesStream = true;
                    break;
                }
            }
            if (matchesStream) {
                reasons.add("Stream criterion met for " + opp.getTitle() + ".");
            }
        }

        // 4. Final Confidence Level Assignment
        if (score >= 90) {
            report.setConfidenceLevel(ConfidenceLevel.ELIGIBLE);
            report.setConfidenceScore(Math.min(100, score));
        } else if (score >= 70) {
            report.setConfidenceLevel(ConfidenceLevel.LIKELY_ELIGIBLE);
            report.setConfidenceScore(score);
            missing.add("Pending document verification: Keep fresh category certificate / college bonafide ready.");
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
