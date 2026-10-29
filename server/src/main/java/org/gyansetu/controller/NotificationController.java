package org.gyansetu.controller;

import org.gyansetu.model.Notification;
import org.gyansetu.model.Opportunity;
import org.gyansetu.repository.NotificationRepository;
import org.gyansetu.service.DataRepository;
import org.gyansetu.service.DeadlineScannerService;
import org.gyansetu.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/deadline-alerts")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final DeadlineScannerService deadlineScannerService;
    private final EmailService emailService;
    private final DataRepository dataRepository;

    public NotificationController(NotificationRepository notificationRepository,
                                  DeadlineScannerService deadlineScannerService,
                                  EmailService emailService,
                                  DataRepository dataRepository) {
        this.notificationRepository = notificationRepository;
        this.deadlineScannerService = deadlineScannerService;
        this.emailService = emailService;
        this.dataRepository = dataRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications(@RequestParam(required = false) Long userId) {
        List<Notification> list = userId != null
                ? notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                : notificationRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(@RequestParam(required = false) Long userId) {
        long count = userId != null
                ? notificationRepository.countByUserIdAndIsReadFalse(userId)
                : notificationRepository.countByIsReadFalse();

        Map<String, Object> res = new HashMap<>();
        res.put("unreadCount", count);
        return ResponseEntity.ok(res);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setRead(true);
            return ResponseEntity.ok(notificationRepository.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            notificationRepository.markAllAsReadForUser(userId);
        } else {
            List<Notification> all = notificationRepository.findAll();
            all.forEach(n -> n.setRead(true));
            notificationRepository.saveAll(all);
        }
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "All notifications marked as read");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/send-test-alert")
    public ResponseEntity<Map<String, Object>> sendTestAlert(@RequestBody(required = false) Map<String, Object> body) {
        Long userId = null;
        String email = null;

        if (body != null) {
            if (body.get("userId") != null) {
                try {
                    userId = Long.valueOf(body.get("userId").toString());
                } catch (Exception ignored) {}
            }
            if (body.get("email") != null) {
                email = body.get("email").toString();
            }
        }

        Notification notif = deadlineScannerService.sendTestAlert(userId, email);
        EmailService.EmailDispatchResult dispatch = deadlineScannerService.getLastDispatchResult();

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("notification", notif);
        res.put("liveSmtp", dispatch != null && dispatch.liveSmtp());
        res.put("message", dispatch != null ? dispatch.message() : "Test deadline alert generated");
        res.put("previewUrl", "/api/deadline-alerts/email-preview");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> triggerScan(@RequestParam(required = false) Long userId) {
        List<Notification> generated = deadlineScannerService.scanAndGenerateAlerts(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("generatedCount", generated.size());
        res.put("generated", generated);
        return ResponseEntity.ok(res);
    }

    @GetMapping(value = "/email-preview", produces = "text/html")
    public ResponseEntity<String> getEmailPreview(@RequestParam(defaultValue = "Student") String name) {
        Opportunity opp = dataRepository.getOpportunities().get("ssc_cgl_2027");
        if (opp == null && !dataRepository.getOpportunities().isEmpty()) {
            opp = dataRepository.getOpportunities().values().iterator().next();
        }
        String html = emailService.buildHtmlEmailTemplate(
                name,
                opp != null ? opp.getTitle() : "SSC Combined Graduate Level (CGL) 2026-27",
                opp != null ? opp.getOrganization() : "Staff Selection Commission (Govt of India)",
                opp != null ? opp.getApplicationDeadline() : "2026-11-25",
                3,
                opp != null ? opp.getOfficialUrl() : "https://ssc.gov.in",
                opp != null ? opp.getBenefitsOrSalary() : "₹44,900 - ₹1,42,400 (Level 7 Pay Matrix)",
                opp != null ? opp.getRequiredDocuments() : List.of("10th Marksheet", "Caste Certificate", "ID Proof")
        );
        return ResponseEntity.ok(html);
    }
}
