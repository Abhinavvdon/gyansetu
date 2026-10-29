package org.gyansetu.service;

import org.gyansetu.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class DocumentReadinessService {

    private final DataRepository repository;

    public DocumentReadinessService(DataRepository repository) {
        this.repository = repository;
    }

    public List<DocumentItem> getReadinessChecklist(StudentProfile profile) {
        List<DocumentItem> items = new ArrayList<>();
        Map<String, DocumentItem> docMap = new LinkedHashMap<>();

        for (DocumentItem baseDoc : repository.getDefaultDocuments()) {
            DocumentItem copy = new DocumentItem(
                    baseDoc.getId(),
                    baseDoc.getName(),
                    baseDoc.getTypicalLeadDays(),
                    baseDoc.getIssuingAuthority(),
                    baseDoc.getValidityPeriod(),
                    baseDoc.getProTips(),
                    baseDoc.getStatus()
            );
            docMap.put(copy.getId(), copy);
        }

        // Map which saved opportunities require these documents
        Set<String> savedIds = profile.getSavedOpportunityIds();
        for (String savedId : savedIds) {
            Opportunity opp = repository.getOpportunities().get(savedId);
            if (opp != null) {
                for (String docName : opp.getRequiredDocuments()) {
                    if (docName.toLowerCase().contains("income") && docMap.containsKey("doc_income_cert")) {
                        docMap.get("doc_income_cert").getRequiredByOpportunities().add(opp.getTitle());
                    } else if (docName.toLowerCase().contains("caste") || docName.toLowerCase().contains("obc") || docName.toLowerCase().contains("category")) {
                        if (docMap.containsKey("doc_caste_cert")) docMap.get("doc_caste_cert").getRequiredByOpportunities().add(opp.getTitle());
                    } else if (docName.toLowerCase().contains("domicile") || docName.toLowerCase().contains("residence")) {
                        if (docMap.containsKey("doc_domicile_cert")) docMap.get("doc_domicile_cert").getRequiredByOpportunities().add(opp.getTitle());
                    } else if (docName.toLowerCase().contains("bonafide") || docName.toLowerCase().contains("marksheet") || docName.toLowerCase().contains("degree")) {
                        if (docMap.containsKey("doc_bonafide_cert")) docMap.get("doc_bonafide_cert").getRequiredByOpportunities().add(opp.getTitle());
                    }
                }

                // Check deadline urgency
                try {
                    LocalDate today = LocalDate.now();
                    LocalDate deadline = LocalDate.parse(opp.getApplicationDeadline());
                    long daysToDeadline = ChronoUnit.DAYS.between(today, deadline);

                    // If lead time is close to deadline and status is not READY -> flag urgent
                    for (DocumentItem doc : docMap.values()) {
                        if (!"READY".equalsIgnoreCase(doc.getStatus()) && daysToDeadline <= (doc.getTypicalLeadDays() + 5)) {
                            doc.setUrgent(true);
                        }
                    }
                } catch (Exception ignored) {}
            }
        }

        return new ArrayList<>(docMap.values());
    }

    public DocumentItem updateStatus(String docId, String newStatus) {
        for (DocumentItem doc : repository.getDefaultDocuments()) {
            if (doc.getId().equalsIgnoreCase(docId)) {
                doc.setStatus(newStatus);
                return doc;
            }
        }
        return null;
    }
}
