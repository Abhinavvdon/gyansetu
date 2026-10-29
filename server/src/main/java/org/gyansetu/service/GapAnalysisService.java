package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GapAnalysisService {

    private final DataRepository repository;
    private final EligibilityEngineService eligibilityEngine;

    public GapAnalysisService(DataRepository repository, EligibilityEngineService eligibilityEngine) {
        this.repository = repository;
        this.eligibilityEngine = eligibilityEngine;
    }

    public List<GapAnalysis> analyzeGaps(StudentProfile profile) {
        List<GapAnalysis> gapReports = new ArrayList<>();
        List<EligibilityReport> reports = eligibilityEngine.evaluateAll(profile);

        for (EligibilityReport report : reports) {
            if (report.getConfidenceLevel() == ConfidenceLevel.NOT_ELIGIBLE || report.getConfidenceLevel() == ConfidenceLevel.NEEDS_VERIFICATION) {
                Opportunity opp = repository.getOpportunities().get(report.getOpportunityId());
                if (opp == null) continue;

                GapAnalysis ga = new GapAnalysis();
                ga.setOpportunityId(opp.getId());
                ga.setOpportunityTitle(opp.getTitle());
                ga.setOpportunityType(opp.getType());

                // Detect exact gap
                if (opp.getMinGraduationMarksPercent() > profile.getUgMarksPercent()) {
                    double diff = opp.getMinGraduationMarksPercent() - profile.getUgMarksPercent();
                    ga.setGapParameter("MARKS_PERCENTAGE");
                    ga.setExactGapStatement("You missed the cutoff by " + String.format("%.1f", diff) + "% marks in your Bachelor's Degree.");
                    ga.setStudentCurrentValue(profile.getUgMarksPercent() + "%");
                    ga.setRequiredThreshold(opp.getMinGraduationMarksPercent() + "%");
                    ga.setActionableRemedy("Target public exams with no graduation percentage barrier like SSC CGL or Railway NTPC, or improve score in final semester exams.");

                    ga.getClosestAlternatives().add(new GapAnalysis.ClosestAlternative(
                            "ssc_cgl_2027",
                            "SSC Combined Graduate Level (CGL)",
                            OpportunityType.GOVT_EXAM,
                            "Requires only a pass in graduation (No minimum 50% or 60% requirement)."
                    ));
                    ga.getClosestAlternatives().add(new GapAnalysis.ClosestAlternative(
                            "rrb_ntpc_2027",
                            "RRB NTPC Graduate Level",
                            OpportunityType.GOVT_EXAM,
                            "Zero graduation percentage filter with 11,500+ vacant posts."
                    ));
                } else if (opp.getMaxAnnualFamilyIncome() != null && profile.getAnnualFamilyIncome() > opp.getMaxAnnualFamilyIncome()) {
                    double diff = profile.getAnnualFamilyIncome() - opp.getMaxAnnualFamilyIncome();
                    ga.setGapParameter("FAMILY_INCOME");
                    ga.setExactGapStatement("Family income exceeds the scheme cap by ₹" + String.format("%.0f", diff) + " per year.");
                    ga.setStudentCurrentValue("₹" + String.format("%.0f", profile.getAnnualFamilyIncome()));
                    ga.setRequiredThreshold("₹" + String.format("%.0f", opp.getMaxAnnualFamilyIncome()));
                    ga.setActionableRemedy("Explore merit-based scholarships (such as Inspire SHE or Tata Trusts) that do not enforce strict low-income limits.");

                    ga.getClosestAlternatives().add(new GapAnalysis.ClosestAlternative(
                            "pm_usp_scholarship",
                            "PM-USP Central Sector Scholarship",
                            OpportunityType.SCHOLARSHIP,
                            "Higher income ceiling of up to ₹4.5 Lakh per annum."
                    ));
                } else if (!"Female".equalsIgnoreCase(profile.getGender()) && opp.getId().equals("aicte_pragati")) {
                    ga.setGapParameter("GENDER_CRITERIA");
                    ga.setExactGapStatement("This scheme is strictly reserved for girl students.");
                    ga.setStudentCurrentValue(profile.getGender());
                    ga.setRequiredThreshold("Female Candidate");
                    ga.setActionableRemedy("Apply for AICTE Saksham Scholarship (if applicable) or Central Sector National Scholarships.");

                    ga.getClosestAlternatives().add(new GapAnalysis.ClosestAlternative(
                            "pm_usp_scholarship",
                            "PM-USP Central Sector Scholarship",
                            OpportunityType.SCHOLARSHIP,
                            "Gender-neutral central scholarship offering ₹12,000 to ₹20,000/yr."
                    ));
                } else if (profile.getAge() > opp.getMaxAge()) {
                    int diff = profile.getAge() - opp.getMaxAge();
                    ga.setGapParameter("AGE_LIMIT");
                    ga.setExactGapStatement("Age limit exceeded by " + diff + " year(s) for the unreserved cutoff.");
                    ga.setStudentCurrentValue(profile.getAge() + " yrs");
                    ga.setRequiredThreshold(opp.getMaxAge() + " yrs");
                    ga.setActionableRemedy("Utilize category relaxations (OBC +3 yrs, SC/ST +5 yrs) or explore State PSCs with upper age limits up to 40 years.");
                } else {
                    ga.setGapParameter("CRITERIA_VERIFICATION");
                    ga.setExactGapStatement("Missing official state domicile or fresh session category certificate verification.");
                    ga.setStudentCurrentValue("Pending Documentation");
                    ga.setRequiredThreshold("Valid Central/State Certificate");
                    ga.setActionableRemedy("Arrange valid certificate via E-district or Tehsil service portal.");
                }

                gapReports.add(ga);
            }
        }

        return gapReports;
    }
}
