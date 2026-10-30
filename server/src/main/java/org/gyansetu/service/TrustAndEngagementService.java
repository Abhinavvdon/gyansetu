package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

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

    public ScamAlert reportScamAlert(ScamAlert report) {
        if (report == null) {
            throw new IllegalArgumentException("Scam report payload cannot be empty");
        }
        String id = "scam_community_" + System.currentTimeMillis();
        report.setId(id);
        if (report.getDateReported() == null || report.getDateReported().trim().isEmpty()) {
            report.setDateReported(LocalDate.now().toString());
        }
        if (report.getWarningLevel() == null || report.getWarningLevel().trim().isEmpty()) {
            report.setWarningLevel("FRAUD_ALERT");
        }
        // Auto-resolve official genuine portal if not provided
        if (report.getOfficialGenuinePortal() == null || report.getOfficialGenuinePortal().trim().isEmpty()) {
            String claim = ((report.getFakeClaimOrDomain() != null ? report.getFakeClaimOrDomain() : "") + " " +
                    (report.getScamPatternDescription() != null ? report.getScamPatternDescription() : "")).toLowerCase();
            if (claim.contains("ssc")) {
                report.setOfficialGenuinePortal("Official Portal: https://ssc.gov.in ONLY");
            } else if (claim.contains("upsc")) {
                report.setOfficialGenuinePortal("Official Portal: https://upsc.gov.in ONLY");
            } else if (claim.contains("railway") || claim.contains("rrb")) {
                report.setOfficialGenuinePortal("Official Portal: https://indianrailways.gov.in / Regional RRBs");
            } else if (claim.contains("scholarship") || claim.contains("laptop") || claim.contains("nsp")) {
                report.setOfficialGenuinePortal("Official Portal: https://scholarships.gov.in");
            } else if (claim.contains("gate")) {
                report.setOfficialGenuinePortal("Official Portal: https://gate.iitr.ac.in");
            } else if (claim.contains("neet") || claim.contains("nta") || claim.contains("jee")) {
                report.setOfficialGenuinePortal("Official Portal: https://nta.ac.in");
            } else {
                report.setOfficialGenuinePortal("Official Portal: https://www.india.gov.in (National Portal of India)");
            }
        }
        if (report.getSafetyTip() == null || report.getSafetyTip().trim().isEmpty()) {
            report.setSafetyTip("Reported by GyanSetu student community. Always cross-check vacancies on the conducting body's official .gov.in / .nic.in portal.");
        }
        repository.addScamAlert(report);
        return report;
    }

    public Map<String, Object> analyzeNoticeOrMessage(String rawText, String userApiKey) {
        Map<String, Object> result = new LinkedHashMap<>();
        if (rawText == null || rawText.trim().isEmpty()) {
            result.put("verdict", "INVALID_INPUT");
            result.put("trustScore", 0);
            result.put("guidance", "Please paste or type the message, circular, or WhatsApp forward to evaluate.");
            return result;
        }

        String text = rawText.trim();
        String lower = text.toLowerCase();

        // 1. Extract any URLs or domain-like strings in the message
        List<String> extractedUrls = new ArrayList<>();
        java.util.regex.Pattern urlPattern = java.util.regex.Pattern.compile(
                "(https?://[\\w\\-\\.]+(?::\\d+)?(?:/[^\\s]*)?|[a-zA-Z0-9.-]+\\.(?:com|in|org|net|xyz|top|online|site|gov\\.in|nic\\.in|ac\\.in|edu\\.in)[^\\s]*)",
                java.util.regex.Pattern.CASE_INSENSITIVE
        );
        java.util.regex.Matcher matcher = urlPattern.matcher(text);
        while (matcher.find()) {
            extractedUrls.add(matcher.group(1));
        }

        List<String> redFlags = new ArrayList<>();
        List<String> trustSignals = new ArrayList<>();
        int scamRiskScore = 0; // 0 to 100, higher means more suspicious

        // Check for common Indian recruitment & scholarship fraud indicators
        if (lower.contains("direct recruitment without exam") || lower.contains("without exam") || lower.contains("bina exam") || lower.contains("direct joining") || lower.contains("no examination required")) {
            redFlags.add("Claims direct government appointment without entrance/CBT exam (Government departments never recruit Group B/C staff without merit examination).");
            scamRiskScore += 40;
        }

        if (lower.contains("upi") || lower.contains("qr code") || lower.contains("google pay") || lower.contains("phonepe") || lower.contains("paytm") || lower.contains("send money to")) {
            redFlags.add("Requests fee payment via private UPI, QR Code, or personal wallet. Official government portals only use authorized treasury/SBI payment gateways.");
            scamRiskScore += 45;
        }

        if (lower.contains("aadhaar otp") || lower.contains("share otp") || lower.contains("otp bheje") || lower.contains("enter bank pin")) {
            redFlags.add("Solicits Aadhaar OTP or bank credentials. Genuine portals will never ask you to forward OTPs on WhatsApp or SMS.");
            scamRiskScore += 50;
        }

        if (lower.contains("free laptop") || lower.contains("25000") || lower.contains("free tablet") || lower.contains("cash reward") || lower.contains("muft")) {
            redFlags.add("Promises direct unconditional cash handouts or laptops. PIB Fact Check has repeatedly debunked these viral forwards.");
            scamRiskScore += 35;
        }

        if (lower.contains("whatsapp") || lower.contains("telegram channel") || lower.contains("forward this message") || lower.contains("forward to 5 groups")) {
            redFlags.add("Urges forwarding to WhatsApp groups to 'claim benefits'—a definitive hallmark of viral social engineering scams.");
            scamRiskScore += 30;
        }

        // Evaluate extracted URLs
        boolean hasGovDomain = false;
        boolean hasSuspiciousUrl = false;
        String safeAlternative = "https://www.india.gov.in";

        for (String urlStr : extractedUrls) {
            UrlVerificationResult urlResult = verifyUrl(urlStr);
            if (urlResult.isOfficialGovtDomain()) {
                hasGovDomain = true;
                trustSignals.add("Linked domain '" + urlResult.getDomain() + "' is verified government infrastructure (.gov.in / .nic.in).");
            } else if ("SUSPICIOUS_PHISHING_RISK".equals(urlResult.getVerdict())) {
                hasSuspiciousUrl = true;
                redFlags.add("Link '" + urlResult.getDomain() + "' is an unofficial/phishing domain mimicking government bodies.");
                if (urlResult.getSafeOfficialAlternative() != null) {
                    safeAlternative = urlResult.getSafeOfficialAlternative();
                }
                scamRiskScore += 40;
            }
        }

        // Determine authentic alternative based on text content
        if (lower.contains("ssc")) safeAlternative = "https://ssc.gov.in";
        else if (lower.contains("upsc")) safeAlternative = "https://upsc.gov.in";
        else if (lower.contains("railway") || lower.contains("rrb")) safeAlternative = "https://indianrailways.gov.in";
        else if (lower.contains("scholarship") || lower.contains("nsp")) safeAlternative = "https://scholarships.gov.in";
        else if (lower.contains("gate")) safeAlternative = "https://gate.iitr.ac.in";
        else if (lower.contains("nta") || lower.contains("neet") || lower.contains("jee")) safeAlternative = "https://nta.ac.in";

        // Calculate final trust score (100 = 100% genuine, 0 = confirmed fraud)
        int trustScore = Math.max(0, Math.min(100, 100 - scamRiskScore));
        String verdict;
        String guidance;

        if (hasSuspiciousUrl || scamRiskScore >= 60) {
            verdict = "CONFIRMED_SCAM";
            trustScore = Math.min(trustScore, 10);
            guidance = "DANGER: This message contains multiple critical fraud indicators. Do NOT click links, send money, or share Aadhaar/OTP. Use the verified official government portal below.";
        } else if (scamRiskScore >= 30) {
            verdict = "HIGH_RISK_HOAX";
            trustScore = Math.min(trustScore, 35);
            guidance = "HIGH CAUTION: This notification shows typical characteristics of unverified social media forwards. Always verify against official gazettes before taking action.";
        } else if (hasGovDomain && scamRiskScore == 0) {
            verdict = "GENUINE_OFFICIAL_NOTICE";
            trustScore = 95;
            guidance = "VERIFIED: This message references authentic official government channels. Ensure you cross-reference dates on the verified portal.";
        } else {
            verdict = "UNVERIFIED_CIRCULAR";
            trustScore = 50;
            guidance = "UNVERIFIED: No official government domain detected. Exercise caution and verify vacancy circulars on the conducting agency's primary website.";
        }

        // Auto-generate suggested ScamAlert item that can be 1-click added to the radar
        ScamAlert suggestedAlert = new ScamAlert();
        suggestedAlert.setFakeClaimOrDomain(text.length() > 60 ? text.substring(0, 57) + "..." : text);
        suggestedAlert.setWarningLevel(scamRiskScore >= 60 ? "DANGER" : "FRAUD_ALERT");
        suggestedAlert.setScamPatternDescription(!redFlags.isEmpty() ? String.join(" | ", redFlags) : "Unverified viral recruitment forward.");
        suggestedAlert.setOfficialGenuinePortal("Official Portal: " + safeAlternative);
        suggestedAlert.setSafetyTip("Analyzed via GyanSetu AI Shield: Never transfer application fees via private UPI or third-party links.");
        suggestedAlert.setDateReported(LocalDate.now().toString());

        result.put("verdict", verdict);
        result.put("trustScore", trustScore);
        result.put("redFlags", redFlags);
        result.put("trustSignals", trustSignals);
        result.put("extractedUrls", extractedUrls);
        result.put("safeOfficialAlternative", safeAlternative);
        result.put("guidance", guidance);
        result.put("suggestedScamAlert", suggestedAlert);

        return result;
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
