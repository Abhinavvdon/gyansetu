package org.gyansetu.model;

import java.util.ArrayList;
import java.util.List;

public class UrlVerificationResult {
    private String inputUrl;
    private String domain;
    private int trustScore; // 0 - 100
    private String verdict; // GENUINE_OFFICIAL_PORTAL, OFFICIAL_ACADEMIC_INSTITUTION, SUSPICIOUS_PHISHING_RISK, UNVERIFIED_THIRD_PARTY, INVALID_URL
    private boolean isOfficialGovtDomain;
    private boolean isSslSecure;
    private List<String> riskReasons = new ArrayList<>();
    private List<String> trustSignals = new ArrayList<>();
    private String safeOfficialAlternative;
    private String guidance;

    public UrlVerificationResult() {}

    public String getInputUrl() { return inputUrl; }
    public void setInputUrl(String inputUrl) { this.inputUrl = inputUrl; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public int getTrustScore() { return trustScore; }
    public void setTrustScore(int trustScore) { this.trustScore = trustScore; }

    public String getVerdict() { return verdict; }
    public void setVerdict(String verdict) { this.verdict = verdict; }

    public boolean isOfficialGovtDomain() { return isOfficialGovtDomain; }
    public void setOfficialGovtDomain(boolean officialGovtDomain) { isOfficialGovtDomain = officialGovtDomain; }

    public boolean isSslSecure() { return isSslSecure; }
    public void setSslSecure(boolean sslSecure) { isSslSecure = sslSecure; }

    public List<String> getRiskReasons() { return riskReasons; }
    public void setRiskReasons(List<String> riskReasons) { this.riskReasons = riskReasons; }

    public List<String> getTrustSignals() { return trustSignals; }
    public void setTrustSignals(List<String> trustSignals) { this.trustSignals = trustSignals; }

    public String getSafeOfficialAlternative() { return safeOfficialAlternative; }
    public void setSafeOfficialAlternative(String safeOfficialAlternative) { this.safeOfficialAlternative = safeOfficialAlternative; }

    public String getGuidance() { return guidance; }
    public void setGuidance(String guidance) { this.guidance = guidance; }
}
