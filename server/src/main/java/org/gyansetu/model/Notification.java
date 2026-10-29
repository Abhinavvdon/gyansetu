package org.gyansetu.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "opportunity_id", nullable = false)
    private String opportunityId;

    @Column(name = "opportunity_title", nullable = false)
    private String opportunityTitle;

    @Column(nullable = false)
    private String type; // DEADLINE_URGENT, DEADLINE_APPROACHING, DATE_EXTENDED, DOCUMENT_ALERT

    @Column(nullable = false)
    private String severity; // CRITICAL, WARNING, INFO

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "days_remaining")
    private int daysRemaining;

    @Column(name = "official_url")
    private String officialUrl;

    @Column(name = "action_label")
    private String actionLabel;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "email_sent", nullable = false)
    private boolean emailSent = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public Notification(Long userId, String opportunityId, String opportunityTitle, String type,
                        String severity, String title, String message, int daysRemaining,
                        String officialUrl, String actionLabel) {
        this.userId = userId;
        this.opportunityId = opportunityId;
        this.opportunityTitle = opportunityTitle;
        this.type = type;
        this.severity = severity;
        this.title = title;
        this.message = message;
        this.daysRemaining = daysRemaining;
        this.officialUrl = officialUrl;
        this.actionLabel = actionLabel;
        this.isRead = false;
        this.emailSent = false;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getOpportunityId() { return opportunityId; }
    public void setOpportunityId(String opportunityId) { this.opportunityId = opportunityId; }

    public String getOpportunityTitle() { return opportunityTitle; }
    public void setOpportunityTitle(String opportunityTitle) { this.opportunityTitle = opportunityTitle; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(int daysRemaining) { this.daysRemaining = daysRemaining; }

    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }

    public String getActionLabel() { return actionLabel; }
    public void setActionLabel(String actionLabel) { this.actionLabel = actionLabel; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public boolean isEmailSent() { return emailSent; }
    public void setEmailSent(boolean emailSent) { this.emailSent = emailSent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
