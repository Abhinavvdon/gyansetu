package org.gyansetu.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gyansetu.model.Opportunity;
import org.gyansetu.model.OpportunityType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class AdaptionDatasetImportService {

    private final DataRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Filters out raw attribute fragments or field values accidentally treated as titles
    private static final Pattern JUNK_TITLE_PATTERN = Pattern.compile(
            "^(st:|sc:|obc:|ews:|general:|pay matrix|level \\d+|inr |rs\\.?|₹|book grant|tuition fee|stipend|government of india|national authority|\\d{3};|benefits|salary|quota|eligibility|instruction|output|prompt|recommendation).*$",
            Pattern.CASE_INSENSITIVE
    );

    public AdaptionDatasetImportService(DataRepository repository) {
        this.repository = repository;
    }

    public List<Opportunity> importFromRawText(String rawText) throws Exception {
        if (rawText == null || rawText.trim().isEmpty()) {
            throw new IllegalArgumentException("Dataset content is empty.");
        }

        String cleaned = rawText.trim();
        List<Opportunity> imported = new ArrayList<>();

        // 1. Try standard JSON array or JSON object
        if (cleaned.startsWith("[") || (cleaned.startsWith("{") && !cleaned.contains("\n{"))) {
            try {
                JsonNode root = objectMapper.readTree(cleaned);
                if (root.isArray()) {
                    for (JsonNode item : root) {
                        Opportunity opp = parseOpportunityNode(item);
                        if (opp != null && isValidOpportunity(opp)) {
                            repository.addOpportunity(opp);
                            imported.add(opp);
                        }
                    }
                } else if (root.isObject()) {
                    JsonNode arrayNode = null;
                    for (String key : Arrays.asList("data", "dataset", "records", "items", "opportunities")) {
                        if (root.has(key) && root.get(key).isArray()) {
                            arrayNode = root.get(key);
                            break;
                        }
                    }
                    if (arrayNode != null) {
                        for (JsonNode item : arrayNode) {
                            Opportunity opp = parseOpportunityNode(item);
                            if (opp != null && isValidOpportunity(opp)) {
                                repository.addOpportunity(opp);
                                imported.add(opp);
                            }
                        }
                    } else {
                        Opportunity single = parseOpportunityNode(root);
                        if (single != null && isValidOpportunity(single)) {
                            repository.addOpportunity(single);
                            imported.add(single);
                        }
                    }
                }
                if (!imported.isEmpty()) return imported;
            } catch (Exception ignored) {
                // Not standard single JSON, continue to JSONL or CSV
            }
        }

        // 2. Try JSONL (one JSON object per line)
        String[] lines = cleaned.split("\r?\n");
        boolean triedJsonl = false;
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
                triedJsonl = true;
                try {
                    JsonNode lineNode = objectMapper.readTree(trimmed);
                    Opportunity opp = parseOpportunityNode(lineNode);
                    if (opp != null && isValidOpportunity(opp)) {
                        repository.addOpportunity(opp);
                        imported.add(opp);
                    }
                } catch (Exception ignored) {}
            }
        }

        if (triedJsonl && !imported.isEmpty()) {
            return imported;
        }

        // 3. Try structured CSV with strict header detection
        imported = parseCsvWithHeaders(lines);
        for (Opportunity opp : imported) {
            if (isValidOpportunity(opp)) {
                repository.addOpportunity(opp);
            }
        }

        return imported;
    }

    private Opportunity parseOpportunityNode(JsonNode node) {
        if (node == null || node.isNull()) return null;

        // Check for instruction-response / fine-tune format
        if (node.has("instruction") || node.has("output") || node.has("response")) {
            Opportunity fromInstruction = parseInstructionResponseNode(node);
            if (fromInstruction != null) return fromInstruction;
        }

        // Title
        String title = getText(node, "title", "name", "exam_name", "scheme_name", "opportunity_title");
        if (title == null || title.trim().isEmpty() || JUNK_TITLE_PATTERN.matcher(title.trim()).matches()) {
            return null;
        }
        title = title.trim();

        Opportunity opp = new Opportunity();
        opp.setTitle(title);

        // ID
        String id = getText(node, "id", "exam_id", "scheme_id");
        if (id == null || id.isEmpty()) {
            id = title.toLowerCase().replaceAll("[^a-z0-9]+", "_");
        }
        opp.setId(id);

        // Type
        String typeStr = getText(node, "type", "category", "opportunity_type", "exam_type");
        opp.setType(classifyOpportunityType(typeStr, title));

        // Organization
        String org = getText(node, "organization", "conducting_body", "authority", "ministry", "institution");
        opp.setOrganization(org != null ? org : "Government of India / National Authority");

        // Description
        String desc = getText(node, "description", "summary", "about", "details");
        opp.setDescription(desc != null ? desc : title + " conducted by " + opp.getOrganization() + ".");

        // Deadline
        String deadline = getText(node, "applicationDeadline", "application_deadline", "deadline", "closing_date", "last_date");
        opp.setApplicationDeadline(deadline != null ? deadline : "2027-02-15");

        // Exam Date
        String examDate = getText(node, "examOrDisbursementDate", "exam_date", "examDate", "test_date");
        opp.setExamOrDisbursementDate(examDate != null ? examDate : "2027-04-10");

        // Official URL
        String url = getText(node, "officialUrl", "official_url", "portal_url", "website", "link");
        opp.setOfficialUrl(url != null ? url : "https://scholarships.gov.in");

        // Benefits or Salary
        String benefits = getText(node, "benefitsOrSalary", "benefits", "salary", "stipend", "pay_scale", "fellowship");
        opp.setBenefitsOrSalary(benefits != null ? benefits : "Admission / Fellowship / Subsidized Seat");

        // Fees
        opp.setApplicationFeeGeneral(getDouble(node, 0.0, "applicationFeeGeneral", "application_fee_general", "fee_general", "fee"));
        opp.setApplicationFeeReserved(getDouble(node, 0.0, "applicationFeeReserved", "application_fee_reserved", "fee_reserved"));
        opp.setApplicationFeeFemale(getDouble(node, 0.0, "applicationFeeFemale", "application_fee_female", "fee_female"));
        opp.setHasFeeWaiver(opp.getApplicationFeeReserved() < opp.getApplicationFeeGeneral() || opp.getApplicationFeeFemale() < opp.getApplicationFeeGeneral());

        // Limits & Criteria
        opp.setMinEducationLevel(getText(node, "minEducationLevel", "min_education_level", "education_level", "qualification", "Graduate"));
        opp.setGenderEligibility(getText(node, "genderEligibility", "gender_eligibility", "gender", "ALL"));

        if (node.has("maxAnnualFamilyIncome") && !node.get("maxAnnualFamilyIncome").isNull()) {
            opp.setMaxAnnualFamilyIncome(node.get("maxAnnualFamilyIncome").asDouble());
        }

        // Quotas list
        if (node.has("categoryQuotas") && node.get("categoryQuotas").isArray()) {
            List<String> quotas = new ArrayList<>();
            for (JsonNode q : node.get("categoryQuotas")) quotas.add(q.asText());
            opp.setCategoryQuotas(quotas);
        } else {
            opp.setCategoryQuotas(Arrays.asList("General", "OBC-NCL", "SC", "ST", "EWS"));
        }

        opp.setEligibleStates(Collections.singletonList("All India"));
        opp.setEligibleStreams(Collections.singletonList("Recognized Academic Stream"));
        opp.setGovVerified(true);
        opp.setLastVerifiedDate(LocalDate.now().toString());

        return opp;
    }

    private Opportunity parseInstructionResponseNode(JsonNode node) {
        String output = getText(node, "output", "response", "answer");
        if (output != null && output.contains("{") && output.contains("}")) {
            int start = output.indexOf("{");
            int end = output.lastIndexOf("}");
            if (start != -1 && end > start) {
                try {
                    JsonNode embedded = objectMapper.readTree(output.substring(start, end + 1));
                    Opportunity opp = parseOpportunityNode(embedded);
                    if (opp != null) return opp;
                } catch (Exception ignored) {}
            }
        }

        String input = getText(node, "input", "query", "prompt");
        String title = null;

        if (input != null && input.contains("Title:")) {
            try {
                title = input.split("Title:")[1].split("\\|")[0].trim();
            } catch (Exception ignored) {}
        } else if (output != null && output.contains("Recommendation:")) {
            try {
                title = output.split("Recommendation:")[1].split("\n")[0].trim();
            } catch (Exception ignored) {}
        }

        if (title == null || title.isEmpty() || JUNK_TITLE_PATTERN.matcher(title).matches()) {
            return null;
        }

        Opportunity opp = new Opportunity();
        opp.setTitle(title);
        opp.setId(title.toLowerCase().replaceAll("[^a-z0-9]+", "_"));
        opp.setType(classifyOpportunityType("", title));
        opp.setOrganization("Conducting Authority / National Institute");
        opp.setDescription(output != null ? output.substring(0, Math.min(output.length(), 250)) : title);
        opp.setApplicationDeadline("2027-03-01");
        opp.setExamOrDisbursementDate("2027-05-15");
        opp.setOfficialUrl("https://scholarships.gov.in");
        opp.setBenefitsOrSalary("Admission & Government Fellowship / Subsidized Seat");
        opp.setCategoryQuotas(Arrays.asList("General", "OBC-NCL", "SC", "ST", "EWS"));
        opp.setGovVerified(true);
        opp.setLastVerifiedDate(LocalDate.now().toString());

        return opp;
    }

    private List<Opportunity> parseCsvWithHeaders(String[] lines) {
        List<Opportunity> list = new ArrayList<>();
        if (lines.length < 2) return list;

        String[] headers = splitCsvLine(lines[0]);
        int titleIdx = findHeaderIndex(headers, "title", "opportunity_title", "exam_name", "scheme_name", "name");
        int typeIdx = findHeaderIndex(headers, "type", "category", "opportunity_type");
        int orgIdx = findHeaderIndex(headers, "organization", "conducting_body", "authority", "ministry");
        int deadlineIdx = findHeaderIndex(headers, "applicationdeadline", "application_deadline", "deadline", "closing_date");
        int benefitsIdx = findHeaderIndex(headers, "benefitsorsalary", "benefits_or_salary", "benefits", "salary", "stipend");
        int idIdx = findHeaderIndex(headers, "id", "exam_id", "scheme_id");
        int urlIdx = findHeaderIndex(headers, "officialurl", "official_url", "portal_url", "website");

        // Require a valid title column header; do not blindly guess arbitrary columns!
        if (titleIdx == -1) {
            return list;
        }

        for (int i = 1; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;
            String[] cols = splitCsvLine(line);
            if (titleIdx < cols.length) {
                String title = cleanCol(cols[titleIdx]);
                if (title.isEmpty() || JUNK_TITLE_PATTERN.matcher(title).matches()) continue;

                Opportunity opp = new Opportunity();
                opp.setTitle(title);
                String id = (idIdx != -1 && idIdx < cols.length) ? cleanCol(cols[idIdx]) : "";
                if (id.isEmpty()) id = title.toLowerCase().replaceAll("[^a-z0-9]+", "_");
                opp.setId(id);

                String typeStr = (typeIdx != -1 && typeIdx < cols.length) ? cleanCol(cols[typeIdx]) : "";
                opp.setType(classifyOpportunityType(typeStr, title));

                String org = (orgIdx != -1 && orgIdx < cols.length) ? cleanCol(cols[orgIdx]) : "Government of India / National Authority";
                opp.setOrganization(org);
                opp.setDescription(title + " conducted by " + org + ".");

                String deadline = (deadlineIdx != -1 && deadlineIdx < cols.length) ? cleanCol(cols[deadlineIdx]) : "2027-02-15";
                opp.setApplicationDeadline(deadline);

                String benefits = (benefitsIdx != -1 && benefitsIdx < cols.length) ? cleanCol(cols[benefitsIdx]) : "Financial Aid / Admission";
                opp.setBenefitsOrSalary(benefits);

                String url = (urlIdx != -1 && urlIdx < cols.length) ? cleanCol(cols[urlIdx]) : "https://scholarships.gov.in";
                opp.setOfficialUrl(url);

                opp.setCategoryQuotas(Arrays.asList("General", "OBC-NCL", "SC", "ST", "EWS"));
                opp.setGovVerified(true);
                opp.setLastVerifiedDate(LocalDate.now().toString());

                if (isValidOpportunity(opp)) {
                    list.add(opp);
                }
            }
        }
        return list;
    }

    private OpportunityType classifyOpportunityType(String typeStr, String title) {
        String combined = ((typeStr != null ? typeStr : "") + " " + (title != null ? title : "")).toUpperCase();
        if (combined.contains("SCHOLARSHIP") || combined.contains("FELLOWSHIP") || combined.contains("STIPEND") || combined.contains("GRANT") || combined.contains("PRAGATI") || combined.contains("SAKSHAM") || combined.contains("POST-MATRIC") || combined.contains("NSP")) {
            return OpportunityType.SCHOLARSHIP;
        }
        if (combined.contains("EXAM") || combined.contains("RECRUITMENT") || combined.contains("OFFICER") || combined.contains("CGL") || combined.contains("UPSC") || combined.contains("SSC") || combined.contains("IBPS") || combined.contains("RRB") || combined.contains("CIVIL SERVICES") || combined.contains("CONSTABLE") || combined.contains("INSPECTOR") || combined.contains("PO ")) {
            return OpportunityType.GOVT_EXAM;
        }
        if (combined.contains("GATE") || combined.contains("CAT") || combined.contains("CUET") || combined.contains("JAM") || combined.contains("NIMCET") || combined.contains("CEED") || combined.contains("NID") || combined.contains("NEET") || combined.contains("CLAT") || combined.contains("M.TECH") || combined.contains("MBA") || combined.contains("M.SC") || combined.contains("HIGHER") || combined.contains("ADMISSION") || combined.contains("ENTRANCE")) {
            return OpportunityType.HIGHER_STUDIES;
        }
        if ("SCHOLARSHIP".equalsIgnoreCase(typeStr)) return OpportunityType.SCHOLARSHIP;
        if ("GOVT_EXAM".equalsIgnoreCase(typeStr)) return OpportunityType.GOVT_EXAM;
        return OpportunityType.HIGHER_STUDIES;
    }

    private boolean isValidOpportunity(Opportunity opp) {
        if (opp == null || opp.getTitle() == null) return false;
        String t = opp.getTitle().trim();
        if (t.length() < 3 || t.length() > 150) return false;
        if (JUNK_TITLE_PATTERN.matcher(t).matches()) return false;
        if (t.startsWith("{") || t.startsWith("[") || t.startsWith("\"") || t.startsWith(":")) return false;
        return true;
    }

    private String[] splitCsvLine(String line) {
        return line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
    }

    private int findHeaderIndex(String[] headers, String... candidates) {
        for (int i = 0; i < headers.length; i++) {
            String cleanH = cleanCol(headers[i]).toLowerCase().replaceAll("[^a-z0-9]", "");
            for (String candidate : candidates) {
                String cleanC = candidate.toLowerCase().replaceAll("[^a-z0-9]", "");
                if (cleanH.equals(cleanC) || cleanH.contains(cleanC)) {
                    return i;
                }
            }
        }
        return -1;
    }

    private String cleanCol(String col) {
        if (col == null) return "";
        String s = col.trim();
        if (s.startsWith("\"") && s.endsWith("\"") && s.length() >= 2) {
            s = s.substring(1, s.length() - 1).trim();
        }
        return s;
    }

    private String getText(JsonNode node, String... keys) {
        for (String k : keys) {
            if (node.has(k) && !node.get(k).isNull()) {
                String val = node.get(k).asText().trim();
                if (!val.isEmpty()) return val;
            }
        }
        return null;
    }

    private double getDouble(JsonNode node, double defaultVal, String... keys) {
        for (String k : keys) {
            if (node.has(k) && node.get(k).isNumber()) {
                return node.get(k).asDouble();
            }
        }
        return defaultVal;
    }
}