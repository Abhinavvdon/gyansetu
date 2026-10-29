package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CostAndClashService {

    private final DataRepository repository;

    public CostAndClashService(DataRepository repository) {
        this.repository = repository;
    }

    public static LocalDate parseLenientDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) return null;
        String trimmed = dateStr.trim();

        // 1. Standard ISO (yyyy-MM-dd)
        try {
            if (trimmed.length() >= 10 && trimmed.charAt(4) == '-' && trimmed.charAt(7) == '-') {
                return LocalDate.parse(trimmed.substring(0, 10));
            }
            return LocalDate.parse(trimmed);
        } catch (Exception ignored) {}

        // 2. DateTime with 'T' or space
        try {
            if (trimmed.contains("T")) {
                return LocalDate.parse(trimmed.substring(0, trimmed.indexOf("T")));
            }
            if (trimmed.contains(" ")) {
                String firstPart = trimmed.substring(0, trimmed.indexOf(" "));
                if (firstPart.contains("-") || firstPart.contains("/")) {
                    return parseLenientDate(firstPart);
                }
            }
        } catch (Exception ignored) {}

        // 3. dd/MM/yyyy
        try {
            return LocalDate.parse(trimmed, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        } catch (Exception ignored) {}

        // 4. dd-MM-yyyy
        try {
            return LocalDate.parse(trimmed, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        } catch (Exception ignored) {}

        // 5. Month Year (e.g. "January 2027", "Nov 2026")
        try {
            DateTimeFormatter myFormat = new DateTimeFormatterBuilder()
                    .parseCaseInsensitive()
                    .appendPattern("[MMMM][MMM] yyyy")
                    .toFormatter(Locale.ENGLISH);
            YearMonth ym = YearMonth.parse(trimmed, myFormat);
            return ym.atDay(15);
        } catch (Exception ignored) {}

        // 6. Regex fallback: yyyy-MM-dd anywhere in string
        try {
            Matcher m = Pattern.compile("(\\d{4})[-/](\\d{1,2})[-/](\\d{1,2})").matcher(trimmed);
            if (m.find()) {
                int y = Integer.parseInt(m.group(1));
                int mo = Integer.parseInt(m.group(2));
                int d = Integer.parseInt(m.group(3));
                return LocalDate.of(y, mo, d);
            }
        } catch (Exception ignored) {}

        return null;
    }

    public LocalDate getExamDate(Opportunity opp) {
        if (opp == null) return null;
        LocalDate d = parseLenientDate(opp.getExamOrDisbursementDate());
        if (d != null) return d;

        // Fallback: estimate from application deadline if exam date is not announced yet
        LocalDate dl = parseLenientDate(opp.getApplicationDeadline());
        if (dl != null && (opp.getType() == OpportunityType.GOVT_EXAM || opp.getType() == OpportunityType.HIGHER_STUDIES)) {
            int leadDays = opp.getType() == OpportunityType.HIGHER_STUDIES ? 60 : 45;
            return dl.plusDays(leadDays);
        }
        return null;
    }

    public ApplicationCostPlan calculateCosts(StudentProfile profile) {
        ApplicationCostPlan costPlan = new ApplicationCostPlan();
        double standardTotal = 0;
        double studentDiscountedTotal = 0;

        Set<String> targetIds = profile != null ? profile.getSavedOpportunityIds() : null;
        if (targetIds == null || targetIds.isEmpty()) {
            targetIds = repository.getOpportunities().keySet();
        }

        boolean isFemale = profile != null && "Female".equalsIgnoreCase(profile.getGender());
        boolean isReserved = profile != null && ("SC".equalsIgnoreCase(profile.getCategory()) ||
                "ST".equalsIgnoreCase(profile.getCategory()) ||
                "PwD".equalsIgnoreCase(profile.getCategory()));
        boolean isEws = profile != null && "EWS".equalsIgnoreCase(profile.getCategory());
        boolean isObc = profile != null && "OBC-NCL".equalsIgnoreCase(profile.getCategory());

        for (String id : targetIds) {
            Opportunity opp = repository.getOpportunities().get(id);
            if (opp == null) continue;

            double origFee = opp.getApplicationFeeGeneral();
            double finalFee = origFee;
            String waiverApplied = "None (Standard Rate)";
            boolean isWaived = false;

            if (isFemale && opp.getApplicationFeeFemale() < origFee) {
                finalFee = opp.getApplicationFeeFemale();
                waiverApplied = finalFee == 0.0 ? "100% Women Candidate Exemption" : "Women Concession Rate";
                isWaived = (finalFee == 0.0);
            } else if (isReserved) {
                finalFee = opp.getApplicationFeeReserved();
                waiverApplied = finalFee == 0.0 ? "100% " + profile.getCategory() + " Exemption" : profile.getCategory() + " Concession Rate";
                isWaived = (finalFee == 0.0);
            } else if (opp.getType() == OpportunityType.SCHOLARSHIP) {
                finalFee = 0.0;
                waiverApplied = "Govt Scholarship (No Application Fee)";
                isWaived = true;
            }

            standardTotal += origFee;
            studentDiscountedTotal += finalFee;

            costPlan.getItemizedCosts().add(new ApplicationCostPlan.OpportunityCostDetail(
                    opp.getId(),
                    opp.getTitle(),
                    origFee,
                    finalFee,
                    isWaived,
                    waiverApplied
            ));
        }

        costPlan.setStandardTotalFee(standardTotal);
        costPlan.setStudentDiscountedTotalFee(studentDiscountedTotal);
        costPlan.setTotalSavedViaWaivers(Math.max(0, standardTotal - studentDiscountedTotal));

        // Travel and book estimations based on number of saved exams
        long examCount = targetIds.stream()
                .filter(id -> repository.getOpportunities().containsKey(id) && repository.getOpportunities().get(id).getType() == OpportunityType.GOVT_EXAM)
                .count();

        costPlan.setEstimatedTravelAndCenterCost(examCount * 800.0); // approx ₹800 travel/center per exam
        costPlan.setEstimatedBooksAndPrepCost(examCount > 0 ? 1500.0 : 0.0); // self-prep test series / books
        costPlan.setGrandTotalEstimatedExpense(studentDiscountedTotal + costPlan.getEstimatedTravelAndCenterCost() + costPlan.getEstimatedBooksAndPrepCost());

        return costPlan;
    }

    public List<ExamClashWarning> detectClashes(StudentProfile profile) {
        List<ExamClashWarning> clashes = new ArrayList<>();
        List<Opportunity> examList = new ArrayList<>();
        Set<String> savedIds = (profile != null && profile.getSavedOpportunityIds() != null)
                ? profile.getSavedOpportunityIds()
                : Collections.emptySet();

        for (Opportunity opp : repository.getOpportunities().values()) {
            if (opp.getType() == OpportunityType.GOVT_EXAM || opp.getType() == OpportunityType.HIGHER_STUDIES) {
                if (getExamDate(opp) != null) {
                    examList.add(opp);
                }
            }
        }

        // Compare pairwise dates
        for (int i = 0; i < examList.size(); i++) {
            for (int j = i + 1; j < examList.size(); j++) {
                Opportunity e1 = examList.get(i);
                Opportunity e2 = examList.get(j);

                LocalDate d1 = getExamDate(e1);
                LocalDate d2 = getExamDate(e2);
                if (d1 == null || d2 == null) continue;

                int daysDiff = (int) Math.abs(ChronoUnit.DAYS.between(d1, d2));

                if (daysDiff <= 5) {
                    boolean isUserSavedConflict = savedIds.contains(e1.getId()) && savedIds.contains(e2.getId());
                    String severity = daysDiff == 0 ? "CRITICAL_SAME_DAY_CLASH" : (daysDiff <= 2 ? "HIGH_TRAVEL_CONFLICT" : "MODERATE_SCHEDULE_PROXIMITY");

                    String prefix = isUserSavedConflict ? "🚨 CRITICAL TARGET CONFLICT: Both exams are in your saved target list! " : "";
                    String advice;

                    if (daysDiff == 0) {
                        advice = prefix + "Direct date collision (" + d1 + ")! Unless both test centers are allotted within 5-10 km in the same city session (Shift 1 vs Shift 2), you cannot attempt both. Strongly recommend prioritizing " +
                                (e1.getVacanciesOrSeats() >= e2.getVacanciesOrSeats() ? e1.getTitle() : e2.getTitle()) +
                                " which offers higher intake probability (" + Math.max(e1.getVacanciesOrSeats(), e2.getVacanciesOrSeats()) + " vacancies/seats).";
                    } else {
                        advice = prefix + "These exams are only " + daysDiff + " day(s) apart (" + d1 + " vs " + d2 + "). " +
                                "To avoid travel fatigue and train cancellations, select the exact same district/city preference code during online form filling.";
                    }

                    String date1Str = e1.getExamOrDisbursementDate() != null && !e1.getExamOrDisbursementDate().isEmpty() ? e1.getExamOrDisbursementDate() : d1.toString() + " (Tentative)";
                    String date2Str = e2.getExamOrDisbursementDate() != null && !e2.getExamOrDisbursementDate().isEmpty() ? e2.getExamOrDisbursementDate() : d2.toString() + " (Tentative)";

                    clashes.add(new ExamClashWarning(
                            "clash_" + e1.getId() + "_" + e2.getId(),
                            e1.getId(), e1.getTitle(), date1Str,
                            e2.getId(), e2.getTitle(), date2Str,
                            daysDiff, severity, advice
                    ));
                }
            }
        }

        // Sort: user conflicts first, then closest daysApart first
        clashes.sort((a, b) -> {
            boolean aSaved = savedIds.contains(a.getExam1Id()) && savedIds.contains(a.getExam2Id());
            boolean bSaved = savedIds.contains(b.getExam1Id()) && savedIds.contains(b.getExam2Id());
            if (aSaved != bSaved) return aSaved ? -1 : 1;
            return Integer.compare(a.getDaysApart(), b.getDaysApart());
        });

        return clashes;
    }
}
