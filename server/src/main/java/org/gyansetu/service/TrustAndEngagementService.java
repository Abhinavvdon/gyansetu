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

    public UrlVerificationResult verifyUrl(String rawUrl) {
        UrlVerificationResult result = new UrlVerificationResult();
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            result.setInputUrl("");
            result.setTrustScore(0);
            result.setVerdict("INVALID_URL");
            result.setGuidance("Please enter a valid web URL or link to verify.");
            return result;
        }

        String url = rawUrl.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        result.setInputUrl(url);

        boolean isHttps = url.toLowerCase().startsWith("https://");
        result.setSslSecure(isHttps);

        String host = "";
        try {
            java.net.URI uri = new java.net.URI(url);
            host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";
        } catch (Exception e) {
            host = url.replaceAll("^https?://", "").split("/")[0].toLowerCase();
        }
        result.setDomain(host);

        // 1. Official Government domains (.gov.in, .nic.in)
        if (host.endsWith(".gov.in") || host.endsWith(".nic.in")) {
            result.setOfficialGovtDomain(true);
            result.setTrustScore(100);
            result.setVerdict("GENUINE_OFFICIAL_PORTAL");
            result.getTrustSignals().add("Official National Informatics Centre (NIC) / Government of India apex domain (.gov.in / .nic.in).");
            if (isHttps) {
                result.getTrustSignals().add("Encrypted TLS/SSL connection active.");
            } else {
                result.getRiskReasons().add("Portal is running over unencrypted HTTP. Always ensure the link starts with https://.");
            }
            result.setGuidance("This is a genuine, verified government recruitment or scholarship portal. It is safe to register and submit documents.");
            return result;
        }

        // 2. Official Academic Institutions (.ac.in, .edu.in)
        if (host.endsWith(".ac.in") || host.endsWith(".edu.in") || host.contains("iit") || host.contains("iim") || host.contains("nit") || host.contains("nta.ac.in")) {
            result.setOfficialGovtDomain(false);
            result.setTrustScore(90);
            result.setVerdict("OFFICIAL_ACADEMIC_INSTITUTION");
            result.getTrustSignals().add("Registered Indian academic/research institution apex domain (.ac.in).");
            result.setGuidance("Legitimate educational institution or entrance exam portal. Ensure circular details align with university bulletins.");
            return result;
        }

        // 3. Known Phishing / Low-trust TLDs
        String[] highRiskTlds = {".xyz", ".top", ".online", ".site", ".club", ".buzz", ".work", ".live", ".guru", ".shop", ".bid", ".loan"};
        boolean isHighRiskTld = false;
        for (String tld : highRiskTlds) {
            if (host.endsWith(tld)) {
                isHighRiskTld = true;
                break;
            }
        }

        // 4. Impersonation detection
        boolean impersonatesGovt = host.contains("ssc") || host.contains("upsc") || host.contains("rrb") || host.contains("sbi") || host.contains("scholarship") || host.contains("sarkari") || host.contains("gov") || host.contains("nic");

        if (isHighRiskTld || (impersonatesGovt && !host.endsWith(".gov.in") && !host.endsWith(".nic.in"))) {
            result.setOfficialGovtDomain(false);
            result.setTrustScore(15);
            result.setVerdict("SUSPICIOUS_PHISHING_RISK");
            if (isHighRiskTld) {
                result.getRiskReasons().add("Uses high-risk generic top-level domain (" + host.substring(Math.max(0, host.lastIndexOf('.'))) + ") notorious for ephemeral job scams.");
            }
            if (impersonatesGovt) {
                result.getRiskReasons().add("Impersonates a government organization ('" + host + "') without authorized .gov.in or .nic.in accreditation.");
            }
            if (!isHttps) {
                result.getRiskReasons().add("Unsecured HTTP connection (data and payment credentials can be intercepted).");
            }

            // Map safe alternative
            if (host.contains("ssc")) result.setSafeOfficialAlternative("https://ssc.gov.in");
            else if (host.contains("upsc")) result.setSafeOfficialAlternative("https://upsc.gov.in");
            else if (host.contains("rrb") || host.contains("railway")) result.setSafeOfficialAlternative("https://indianrailways.gov.in");
            else if (host.contains("scholarship")) result.setSafeOfficialAlternative("https://scholarships.gov.in");
            else if (host.contains("nta")) result.setSafeOfficialAlternative("https://nta.ac.in");
            else result.setSafeOfficialAlternative("https://www.india.gov.in");

            result.setGuidance("HIGH RISK WARNING: Do NOT make payments, enter OTPs, or upload Aadhaar cards on this portal. Use the official government alternative provided below.");
            return result;
        }

        // 5. General third party (e.g. news portals, coaching websites)
        result.setOfficialGovtDomain(false);
        result.setTrustScore(50);
        result.setVerdict("UNVERIFIED_THIRD_PARTY");
        result.getRiskReasons().add("This is a private commercial domain, coaching institute, or news aggregator—not the official conducting body.");
        result.setGuidance("Private or commercial website. For actual form filling and fee payment, always navigate directly to the official government portal.");
        return result;
    }

    public WeeklyDigest generateWeeklyDigest(StudentProfile profile) {
        WeeklyDigest digest = new WeeklyDigest();
        digest.setStudentName(profile != null ? profile.getFullName() : "Student");
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
        String wa = "📢 *GyanSetu Weekly Action Digest for " + (profile != null ? profile.getFullName() : "Student") + "*\n\n" +
                "⏳ *Upcoming Deadlines This Week:*\n" +
                "• GATE 2027 (Closing in 3 days - Oct 31)\n" +
                "• CAT 2026 (Closing Nov 10)\n\n" +
                "🎯 *New Matches & Updates:*\n" +
                "• RRB NTPC added 1,200 more officer posts!\n" +
                "• ₹" + String.format("%.0f", digest.getFeeSavingsToDate()) + " saved in exam fee waivers via " + (profile != null ? profile.getCategory() : "General") + " relaxation.\n\n" +
                "⚠️ *Immediate Document Task:*\n" +
                "• Apply for fresh Income Certificate at local CSC (takes 14 days).\n\n" +
                "🔗 Open GyanSetu Portal: http://localhost:5173";
        digest.setWhatsAppFormattedMessage(wa);

        // Hindi Parent Mode summary
        String hindi = "नमस्ते! " + (profile != null ? profile.getFullName() : "विद्यार्थी") + " के करियर व छात्रवृत्ति की स्थिति: " +
                "इस सप्ताह 3 मुख्य फॉर्म की अंतिम तिथि है। सरकारी छूट के कारण फॉर्म फीस में लगभग ₹" +
                String.format("%.0f", digest.getFeeSavingsToDate()) + " की बचत हुई है। " +
                "कृपया तहसील या सीएससी (CSC) केंद्र से 'आय प्रमाण पत्र' जल्दी बनवा लें ताकि स्कॉलरशिप का लाभ समय पर मिल सके।";
        digest.setHindiParentSummary(hindi);

        return digest;
    }
}
