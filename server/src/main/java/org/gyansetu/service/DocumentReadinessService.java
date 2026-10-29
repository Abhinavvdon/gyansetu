package org.gyansetu.service;

import org.gyansetu.model.*;
import org.gyansetu.repository.StudentDocumentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DocumentReadinessService {

    private final DataRepository repository;
    private final StudentProfileService profileService;
    private final StudentDocumentRepository studentDocumentRepository;

    public DocumentReadinessService(DataRepository repository,
                                    StudentProfileService profileService,
                                    StudentDocumentRepository studentDocumentRepository) {
        this.repository = repository;
        this.profileService = profileService;
        this.studentDocumentRepository = studentDocumentRepository;
    }

    public List<DocumentItem> getReadinessChecklist(StudentProfile profile) {
        Long userId = (profile != null && profile.getUserId() != null) ? profile.getUserId() : 1L;
        return getReadinessChecklist(userId, profile);
    }

    public List<DocumentItem> getReadinessChecklist(Long userId) {
        StudentProfile profile = profileService.getOrCreateProfile(userId);
        return getReadinessChecklist(userId, profile);
    }

    public List<DocumentItem> getReadinessChecklist(Long userId, StudentProfile profile) {
        Long effectiveUserId = (userId != null) ? userId : (profile != null && profile.getUserId() != null ? profile.getUserId() : 1L);
        Map<String, DocumentItem> docMap = new LinkedHashMap<>();

        // Fetch persisted user-specific overrides from PostgreSQL
        List<StudentDocument> userDocs = studentDocumentRepository.findByUserId(effectiveUserId);
        Map<String, String> statusMap = userDocs.stream()
                .collect(Collectors.toMap(StudentDocument::getDocumentId, StudentDocument::getStatus, (a, b) -> b));

        for (DocumentItem baseDoc : repository.getDefaultDocuments()) {
            DocumentItem copy = new DocumentItem(
                    baseDoc.getId(),
                    baseDoc.getName(),
                    baseDoc.getTypicalLeadDays(),
                    baseDoc.getIssuingAuthority(),
                    baseDoc.getValidityPeriod(),
                    baseDoc.getProTips(),
                    statusMap.getOrDefault(baseDoc.getId(), baseDoc.getStatus())
            );
            docMap.put(copy.getId(), copy);
        }

        if (profile == null) {
            profile = profileService.getOrCreateProfile(effectiveUserId);
        }

        // Map which saved opportunities require these documents
        Set<String> savedIds = profile.getSavedOpportunityIds();
        for (String savedId : savedIds) {
            Opportunity opp = repository.getOpportunities().get(savedId);
            if (opp != null) {
                for (String docName : opp.getRequiredDocuments()) {
                    String lower = docName.toLowerCase();
                    if (lower.contains("income") && docMap.containsKey("doc_income_cert")) {
                        docMap.get("doc_income_cert").getRequiredByOpportunities().add(opp.getTitle());
                    } else if (lower.contains("caste") || lower.contains("obc") || lower.contains("category") || lower.contains("ews")) {
                        if (docMap.containsKey("doc_caste_cert")) docMap.get("doc_caste_cert").getRequiredByOpportunities().add(opp.getTitle());
                    } else if (lower.contains("domicile") || lower.contains("residence")) {
                        if (docMap.containsKey("doc_domicile_cert")) docMap.get("doc_domicile_cert").getRequiredByOpportunities().add(opp.getTitle());
                    } else if (lower.contains("bonafide") || lower.contains("marksheet") || lower.contains("degree") || lower.contains("certificate")) {
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
                        if (!"READY".equalsIgnoreCase(doc.getStatus()) && daysToDeadline <= (doc.getTypicalLeadDays() + 7)) {
                            doc.setUrgent(true);
                        }
                    }
                } catch (Exception ignored) {}
            }
        }

        return new ArrayList<>(docMap.values());
    }

    public DocumentItem updateStatus(Long userId, String docId, String newStatus) {
        Long effectiveUserId = (userId != null) ? userId : 1L;
        Optional<StudentDocument> opt = studentDocumentRepository.findByUserIdAndDocumentId(effectiveUserId, docId);
        StudentDocument studentDoc;
        if (opt.isPresent()) {
            studentDoc = opt.get();
            studentDoc.setStatus(newStatus);
            studentDoc.setUpdatedAt(java.time.LocalDateTime.now());
        } else {
            studentDoc = new StudentDocument(effectiveUserId, docId, newStatus);
        }
        studentDocumentRepository.save(studentDoc);

        // Return updated item from checklist
        List<DocumentItem> items = getReadinessChecklist(effectiveUserId);
        for (DocumentItem item : items) {
            if (item.getId().equalsIgnoreCase(docId)) {
                return item;
            }
        }
        return null;
    }
}
