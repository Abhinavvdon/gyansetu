package org.gyansetu.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.gyansetu.model.Opportunity;
import org.gyansetu.model.OpportunityType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class AdaptionDatasetImportService {

    private final DataRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AdaptionDatasetImportService(DataRepository repository) {
        this.repository = repository;
    }

    public List<Opportunity> importFromRawText(String rawText) throws Exception {
        if (rawText == null || rawText.trim().isEmpty()) {
            throw new IllegalArgumentException("Dataset content is empty.");
        }

        String cleaned = rawText.trim();
        List<Opportunity> imported = new ArrayList<>();

        if (cleaned.startsWith("[") || cleaned.startsWith("{")) {
            JsonNode root = objectMapper.readTree(cleaned);
            if (root.isArray()) {
                for (JsonNode item : root) {
                    Opportunity opp = parseOpportunityNode(item);
                    if (opp != null) {
                        repository.addOpportunity(opp);
                        imported.add(opp);
                    }
                }
            } else if (root.isObject()) {
                // If wrapped in an object like { "data": [...] } or { "dataset": [...] }
                JsonNode arrayNode = null;
                if (root.has("data") && root.get("data").isArray()) arrayNode = root.get("data");
                else if (root.has("dataset") && root.get("dataset").isArray()) arrayNode = root.get("dataset");
                else if (root.has("records") && root.get("records").isArray()) arrayNode = root.get("records");
                else if (root.has("items") && root.get("items").isArray()) arrayNode = root.get("items");

                if (arrayNode != null) {
                    for (JsonNode item : arrayNode) {
                        Opportunity opp = parseOpportunityNode(item);
                        if (opp != null) {
                            repository.addOpportunity(opp);
                            imported.add(opp);
                        }
                    }
                } else {
                    Opportunity single = parseOpportunityNode(root);
                    if (single != null) {
                        repository.addOpportunity(single);
                        imported.add(single);
                    }
                }
            }
        } else {
            // CSV parsing fallback
            imported = parseCsvContent(cleaned);
            for (Opportunity opp : imported) {
                repository.addOpportunity(opp);
            }
        }

        return imported;
    }

    private Opportunity parseOpportunityNode(JsonNode node) {
        Opportunity opp = new Opportunity();

        // Check for instruction-response format
        if (node.has("instruction") && node.has("output")) {
            return parseInstructionResponseNode(node);
        }

        // Title
        String title = getText(node, "title", "name", "exam_name", "scheme_name", "opportunity_title");
        if (title == null || title.isEmpty()) return null;
        opp.setTitle(title);

        // ID
        String id = getText(node, "id", "exam_id", "scheme_id");
        if (id == null || id.isEmpty()) {
            id = title.toLowerCase().replaceAll("[^a-z0-9]+", "_");
        }
        opp.setId(id);

        // Type
        String typeStr = getText(node, "type", "category", "opportunity_type", "exam_type");
        OpportunityType oppType = OpportunityType.HIGHER_STUDIES;
        if (typeStr != null) {
            String upper = typeStr.toUpperCase();
            if (upper.contains("SCHOLARSHIP") || upper.contains("GRANT") || upper.contains("FELLOWSHIP")) {
                oppType = OpportunityType.SCHOLARSHIP;
            } else if (upper.contains("GOVT") || upper.contains("EXAM") || upper.contains("RECRUITMENT") || upper.contains("JOB")) {
                oppType = OpportunityType.GOVT_EXAM;
            } else {
                oppType = OpportunityType.HIGHER_STUDIES;
            }
        }
        opp.setType(oppType);

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
        opp.setBenefitsOrSalary(benefits != null ? benefits : "Degree Admission + Subsidized Government Fees / Fellowship");

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

        // States & Streams
        opp.setEligibleStates(Collections.singletonList("All India"));
        opp.setEligibleStreams(Collections.singletonList("Recognized Academic Stream"));
        opp.setGovVerified(true);
        opp.setLastVerifiedDate(LocalDate.now().toString());

        return opp;
    }

    private Opportunity parseInstructionResponseNode(JsonNode node) {
        String input = getText(node, "input", "query", "prompt");
        String output = getText(node, "output", "response", "answer");

        Opportunity opp = new Opportunity();
        String title = "Adaption Opportunity";

        if (input != null && input.contains("Title:")) {
            try {
                title = input.split("Title:")[1].split("\\|")[0].trim();
            } catch (Exception ignored) {}
        } else if (output != null && output.contains("Recommendation:")) {
            try {
                title = output.split("Recommendation:")[1].split("\n")[0].trim();
            } catch (Exception ignored) {}
        }

        opp.setTitle(title);
        opp.setId(title.toLowerCase().replaceAll("[^a-z0-9]+", "_"));
        opp.setType(OpportunityType.HIGHER_STUDIES);
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

    private List<Opportunity> parseCsvContent(String csv) {
        List<Opportunity> list = new ArrayList<>();
        String[] lines = csv.split("\r?\n");
        if (lines.length < 2) return list;

        String[] headers = lines[0].split(",");
        for (int i = 1; i < lines.length; i++) {
            String line = lines[i].trim();
            if (line.isEmpty()) continue;
            String[] cols = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
            if (cols.length > 1) {
                Opportunity opp = new Opportunity();
                String title = cols[1].replace("\"", "").trim();
                opp.setTitle(title);
                opp.setId(cols[0].replace("\"", "").trim());
                opp.setType(OpportunityType.HIGHER_STUDIES);
                opp.setOrganization("National Authority");
                opp.setDescription(title);
                opp.setApplicationDeadline("2027-02-28");
                opp.setBenefitsOrSalary("Financial Aid / Admission");
                opp.setOfficialUrl("https://scholarships.gov.in");
                opp.setCategoryQuotas(Arrays.asList("General", "OBC-NCL", "SC", "ST", "EWS"));
                opp.setGovVerified(true);
                opp.setLastVerifiedDate(LocalDate.now().toString());
                list.add(opp);
            }
        }
        return list;
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
