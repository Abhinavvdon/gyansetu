package org.gyansetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "student_documents",
    uniqueConstraints = @UniqueConstraint(name = "uk_user_document", columnNames = {"user_id", "document_id"})
)
public class StudentDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "document_id", nullable = false, length = 100)
    private String documentId;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "MISSING"; // READY, IN_PROGRESS, MISSING

    @Column(name = "document_number", length = 100)
    private String documentNumber;

    @Column(name = "expiry_date")
    private String expiryDate;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public StudentDocument() {}

    public StudentDocument(Long userId, String documentId, String status) {
        this.userId = userId;
        this.documentId = documentId;
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
