package org.gyansetu.controller;

import org.gyansetu.model.Notification;
import org.gyansetu.repository.NotificationRepository;
import org.gyansetu.service.DeadlineScannerService;
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

    public NotificationController(NotificationRepository notificationRepository,
                                  DeadlineScannerService deadlineScannerService) {
        this.notificationRepository = notificationRepository;
        this.deadlineScannerService = deadlineScannerService;
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

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Test deadline alert successfully created and dispatched to " + (email != null ? email : "student email"));
        res.put("notification", notif);
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
}
