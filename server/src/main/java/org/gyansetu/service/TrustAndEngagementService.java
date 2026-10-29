package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrustAndEngagementService {

    private final DataRepository repository;
    private final CostAndClashService costService;

    public TrustAndEngagementService(DataRepository repository, CostAndClashService costService) {
        this.repository = repository;
        this.costService = costService;
    }

    public List<ScamAlert> getScamAlerts() {
        return repository.getScamAlerts();
    }

    public List<PeerSuccessStory> getPeerStories() {
        return repository.getPeerStories();
    }

    public WeeklyDigest generateWeeklyDigest(StudentProfile profile) {
        WeeklyDigest digest = new WeeklyDigest();
        digest.setStudentName(profile.getFullName());
        digest.setWeekLabel("Week of " + LocalDate.now().toString());

        digest.setUpcomingDeadlinesCount(3);
        digest.setNewMatchesCount(4);
        digest.setDocumentsUrgentCount(1);

        ApplicationCostPlan costPlan = costService.calculateCosts(profile);
        digest.setFeeSavingsToDate(costPlan.getTotalSavedViaWaivers());

        digest.getUpcomingDeadlineHighlights().add("GATE 2027: Registration closing on Oct 31 (3 days remaining)");
        digest.getUpcomingDeadlineHighlights().add("CAT 2026: Application portal closing Nov 10");
        digest.getUpcomingDeadlineHighlights().add("PM-USP Central Sector Scholarship: Form submission Nov 30");

        digest.getNewMatchHighlights().add("Railway RRB NTPC: 1,200 new vacancies added (+100% eligibility score)");
        digest.getNewMatchHighlights().add("Post-Matric OBC Scheme: 100% college tuition reimbursement active for MP Domicile");

        digest.getUrgentDocumentAlerts().add("Action needed: Family Income Certificate renewal required from Tehsil (takes 14-18 days). Apply now!");

        // WhatsApp formatted string
        String wa = "📢 *GyanSetu Weekly Action Digest for " + profile.getFullName() + "*\n\n" +
                "⏳ *Upcoming Deadlines This Week:*\n" +
                "• GATE 2027 (Closing in 3 days - Oct 31)\n" +
                "• CAT 2026 (Closing Nov 10)\n\n" +
                "🎯 *New Matches & Updates:*\n" +
                "• RRB NTPC added 1,200 more officer posts!\n" +
                "• ₹" + String.format("%.0f", digest.getFeeSavingsToDate()) + " saved in exam fee waivers via " + profile.getCategory() + " relaxation.\n\n" +
                "⚠️ *Immediate Document Task:*\n" +
                "• Apply for fresh Income Certificate at local CSC (takes 14 days).\n\n" +
                "🔗 Open GyanSetu Portal: http://localhost:5173";
        digest.setWhatsAppFormattedMessage(wa);

        // Hindi Parent Mode summary
        String hindi = "नमस्ते! " + profile.getFullName() + " के करियर व छात्रवृत्ति की स्थिति: " +
                "इस सप्ताह 3 मुख्य फॉर्म की अंतिम तिथि है। सरकारी छूट के कारण फॉर्म फीस में लगभग ₹" +
                String.format("%.0f", digest.getFeeSavingsToDate()) + " की बचत हुई है। " +
                "कृपया तहसील या सीएससी (CSC) केंद्र से 'आय प्रमाण पत्र' जल्दी बनवा लें ताकि स्कॉलरशिप का लाभ समय पर मिल सके।";
        digest.setHindiParentSummary(hindi);

        return digest;
    }
}
