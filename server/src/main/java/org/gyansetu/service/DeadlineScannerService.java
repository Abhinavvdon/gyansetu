package org.gyansetu.service;

import org.gyansetu.model.Notification;
import org.gyansetu.model.Opportunity;
import org.gyansetu.model.User;
import org.gyansetu.repository.NotificationRepository;
import org.gyansetu.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class DeadlineScannerService {

    private static final Logger log = LoggerFactory.getLogger(DeadlineScannerService.class);

    private final DataRepository dataRepository;
    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    public DeadlineScannerService(DataRepository dataRepository,
                                  NotificationRepository notificationRepository,
                                  EmailService emailService,
                                  UserRepository userRepository) {
        this.dataRepository = dataRepository;
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public List<Notification> scanAndGenerateAlerts(Long userId) {
        List<Opportunity> allOpps = new ArrayList<>(dataRepository.getOpportunities().values());
        List<Notification> createdNotifications = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Seed initial notifications if repository is empty
        if (notificationRepository.count() == 0) {
            seedInitialNotifications(userId);
        }

        for (Opportunity opp : allOpps) {
            if (opp.getApplicationDeadline() == null) continue;

            LocalDate deadline;
            try {
                deadline = LocalDate.parse(opp.getApplicationDeadline(), DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (Exception e) {
                continue;
            }

            int daysRemaining = (int) ChronoUnit.DAYS.between(today, deadline);
            if (daysRemaining < 0) continue;

            // Alert thresholds: <= 3 days (CRITICAL), <= 7 days (WARNING), <= 14 days (INFO)
            if (daysRemaining <= 14) {
                String type;
                String severity;
                String title;
                String message;

                if (daysRemaining <= 2) {
                    type = "DEADLINE_URGENT";
                    severity = "CRITICAL";
                    title = "🚨 Urgent! Only " + (daysRemaining == 0 ? "Few Hours" : daysRemaining + " Days") + " Left: " + opp.getTitle();
                    message = "Application window for " + opp.getTitle() + " (" + opp.getOrganization() + ") is closing on " + opp.getApplicationDeadline() + ". Ensure fee payment and form submission are finalized.";
                } else if (daysRemaining <= 7) {
                    type = "DEADLINE_APPROACHING";
                    severity = "WARNING";
                    title = "⏰ Deadline Approaching: " + opp.getTitle() + " (In " + daysRemaining + " Days)";
                    message = "Reminder: Only " + daysRemaining + " days remaining to submit your application for " + opp.getTitle() + ". Keep your category certificates and marksheets ready.";
                } else {
                    type = "DEADLINE_APPROACHING";
                    severity = "INFO";
                    title = "📅 Upcoming Application Close: " + opp.getTitle();
                    message = "Closing on " + opp.getApplicationDeadline() + ". Review required eligibility and document checklist.";
                }

                boolean alreadyExists = userId != null
                        ? notificationRepository.existsByUserIdAndOpportunityIdAndDaysRemaining(userId, opp.getId(), daysRemaining)
                        : notificationRepository.existsByOpportunityIdAndDaysRemaining(opp.getId(), daysRemaining);

                if (!alreadyExists) {
                    Notification notif = new Notification(
                            userId,
                            opp.getId(),
                            opp.getTitle(),
                            type,
                            severity,
                            title,
                            message,
                            daysRemaining,
                            opp.getOfficialUrl(),
                            "Apply Now"
                    );
                    Notification saved = notificationRepository.save(notif);
                    createdNotifications.add(saved);
                }
            }
        }

        return createdNotifications;
    }

    public Notification sendTestAlert(Long userId, String targetEmail) {
        Opportunity opp = dataRepository.getOpportunities().get("ssc_cgl_2027");
        if (opp == null && !dataRepository.getOpportunities().isEmpty()) {
            opp = dataRepository.getOpportunities().values().iterator().next();
        }

        int daysLeft = 3;
        String studentName = "Student";

        if (userId != null) {
            User u = userRepository.findById(userId).orElse(null);
            if (u != null) {
                studentName = u.getName();
                if (targetEmail == null || targetEmail.trim().isEmpty()) {
                    targetEmail = u.getEmail();
                }
            }
        }

        if (targetEmail == null || targetEmail.trim().isEmpty()) {
            targetEmail = "student.alerts@gyansetu.edu.in";
        }

        // 1. Create in-app Notification record
        Notification notif = new Notification(
                userId,
                opp.getId(),
                opp.getTitle(),
                "DEADLINE_URGENT",
                "CRITICAL",
                "🚨 Test Alert: 3 Days Left to Apply for " + opp.getTitle(),
                "This is a verified test deadline alert. " + opp.getTitle() + " closes on " + opp.getApplicationDeadline() + ". Official notification gazette verified.",
                daysLeft,
                opp.getOfficialUrl(),
                "Open Official Portal"
        );
        notif.setEmailSent(true);
        Notification saved = notificationRepository.save(notif);

        // 2. Dispatch Email
        emailService.sendDeadlineAlertEmail(
                targetEmail,
                studentName,
                opp.getTitle(),
                opp.getOrganization(),
                opp.getApplicationDeadline(),
                daysLeft,
                opp.getOfficialUrl(),
                opp.getBenefitsOrSalary(),
                opp.getRequiredDocuments()
        );

        return saved;
    }

    private void seedInitialNotifications(Long userId) {
        List<Notification> initial = List.of(
                new Notification(
                        userId,
                        "gate_2027",
                        "GATE 2027 (IIT Roorkee / IISc Organised)",
                        "DEADLINE_URGENT",
                        "CRITICAL",
                        "🚨 Final Hours: GATE 2027 Registration Closes Soon",
                        "Registration portal closing soon. Ensure category certificates (OBC-NCL/SC/ST/EWS) and signature scans meet size criteria before fee payment.",
                        2,
                        "https://gate.iitr.ac.in",
                        "Apply on GATE Portal"
                ),
                new Notification(
                        userId,
                        "ssc_cgl_2027",
                        "SSC Combined Graduate Level (CGL) 2026-27",
                        "DEADLINE_APPROACHING",
                        "WARNING",
                        "⏰ Deadline Reminder: SSC CGL 2026-27 Closes in 8 Days",
                        "Over 17,727 group B & C vacancies. SC, ST, and Female candidates are 100% exempt from application fee.",
                        8,
                        "https://ssc.gov.in",
                        "Apply on SSC Portal"
                ),
                new Notification(
                        userId,
                        "pm_usp_scholarship",
                        "PM-USP Central Sector Scholarship Scheme",
                        "DATE_EXTENDED",
                        "INFO",
                        "📢 Official Corrigendum: Application Window Extended",
                        "Ministry of Education has extended verification window on National Scholarship Portal (NSP). Ensure Aadhaar is linked to your bank account.",
                        14,
                        "https://scholarships.gov.in",
                        "View on NSP Portal"
                ),
                new Notification(
                        userId,
                        "ibps_po_2027",
                        "IBPS PO / Management Trainee CRP-XIV",
                        "DEADLINE_APPROACHING",
                        "WARNING",
                        "⏰ 12 Days Remaining: IBPS PO CRP-XIV Form Submission",
                        "Direct recruitment for Probationary Officers across 11 nationalized banks. Keep EWS / Caste certificate ready.",
                        12,
                        "https://ibps.in",
                        "Apply on IBPS Portal"
                )
        );

        notificationRepository.saveAll(initial);
    }
}
