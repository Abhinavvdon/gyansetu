package org.gyansetu.service;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@EnableScheduling
public class DeadlineAlertScheduler {

    private static final Logger log = LoggerFactory.getLogger(DeadlineAlertScheduler.class);

    private final DeadlineScannerService deadlineScannerService;

    public DeadlineAlertScheduler(DeadlineScannerService deadlineScannerService) {
        this.deadlineScannerService = deadlineScannerService;
    }

    @PostConstruct
    public void init() {
        log.info("⏰ GyanSetu Deadline Alert System Initialized.");
        try {
            deadlineScannerService.scanAndGenerateAlerts(null);
        } catch (Exception ex) {
            log.warn("⚠️ Initial deadline scan completed with notice: {}", ex.getMessage());
        }
    }

    // Runs every day at 8:00 AM Indian Standard Time
    @Scheduled(cron = "0 0 8 * * *")
    public void runDailyDeadlineScan() {
        log.info("🔔 Running daily morning deadline alert scan...");
        deadlineScannerService.scanAndGenerateAlerts(null);
    }
}
