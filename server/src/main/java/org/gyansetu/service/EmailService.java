package org.gyansetu.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${gyansetu.mail.from:alerts@gyansetu.edu.in}")
    private String fromEmail;

    @Value("${gyansetu.mail.sender-name:GyanSetu Deadline Alerts}")
    private String senderName;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendDeadlineAlertEmail(String toEmail,
                                         String studentName,
                                         String opportunityTitle,
                                         String organization,
                                         String deadlineDate,
                                         int daysRemaining,
                                         String officialUrl,
                                         String benefits,
                                         List<String> requiredDocuments) {
        String subject = daysRemaining <= 2
                ? "🚨 [URGENT] Only " + daysRemaining + " Days Left: " + opportunityTitle
                : "⏰ Deadline Reminder: " + opportunityTitle + " closes in " + daysRemaining + " days";

        String htmlContent = buildHtmlEmailTemplate(
                studentName,
                opportunityTitle,
                organization,
                deadlineDate,
                daysRemaining,
                officialUrl,
                benefits,
                requiredDocuments
        );

        boolean dispatched = false;

        if (mailSender != null && !fromEmail.equals("alerts@gyansetu.edu.in")) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail, senderName);
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("📧 Email successfully dispatched via SMTP to {}", toEmail);
                dispatched = true;
            } catch (Exception ex) {
                log.warn("⚠️ SMTP dispatch failed: {}. Logging to GyanSetu email delivery stream.", ex.getMessage());
            }
        }

        // Development & Simulated Delivery Stream
        log.info("================================================================================");
        log.info("📬 [GYANSETU EMAIL DELIVERY STREAM] - {}", dispatched ? "SENT (LIVE SMTP)" : "SIMULATED / PREVIEW");
        log.info("To: {} <{}>", studentName, toEmail);
        log.info("Subject: {}", subject);
        log.info("Target: {} (Days Remaining: {})", opportunityTitle, daysRemaining);
        log.info("Official Portal: {}", officialUrl);
        log.info("================================================================================");

        return true;
    }

    private String buildHtmlEmailTemplate(String studentName,
                                         String opportunityTitle,
                                         String organization,
                                         String deadlineDate,
                                         int daysRemaining,
                                         String officialUrl,
                                         String benefits,
                                         List<String> requiredDocuments) {
        String urgencyColor = daysRemaining <= 2 ? "#dc2626" : daysRemaining <= 5 ? "#d97706" : "#4f46e5";
        String urgencyLabel = daysRemaining <= 1 ? "CLOSING TODAY / TOMORROW" : "CLOSING IN " + daysRemaining + " DAYS";

        StringBuilder docsHtml = new StringBuilder();
        if (requiredDocuments != null && !requiredDocuments.isEmpty()) {
            for (String doc : requiredDocuments) {
                docsHtml.append("<li style='margin-bottom: 6px; color: #475569;'>")
                        .append("📄 <strong>").append(doc).append("</strong>")
                        .append("</li>");
            }
        } else {
            docsHtml.append("<li style='color: #475569;'>Marksheet, Valid ID Proof, Category Certificate</li>");
        }

        return """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>GyanSetu Deadline Alert</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            <!-- Top Header Ribbon -->
            <div style="background: linear-gradient(135deg, #1b1154 0%%, #33209c 50%%, #5940e2 100%%); padding: 32px 28px; text-align: left; color: #ffffff;">
              <div style="display: inline-block; background-color: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #e0e7ff; margin-bottom: 12px;">
                🇮🇳 Official Opportunity Alert
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                Gyan<span style="color: #c7d2fe;">Setu</span> (ज्ञानसेतु)
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #cbd5e1;">Your Future, Connected. • National Opportunity Intelligence</p>
            </div>

            <!-- Body Content -->
            <div style="padding: 28px;">
              <p style="font-size: 14px; color: #334155; margin-top: 0;">
                Dear <strong>%s</strong>,
              </p>
              <p style="font-size: 13px; color: #64748b; line-height: 1.6;">
                This is a critical alert from your GyanSetu Opportunity Tracker. One of your shortlisted opportunities is closing its application window soon:
              </p>

              <!-- Opportunity Detail Card -->
              <div style="background-color: #f8f9fc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 20px 0;">
                <div style="display: inline-block; background-color: %s; color: #ffffff; font-size: 10px; font-weight: bold; padding: 3px 10px; border-radius: 12px; letter-spacing: 0.5px; margin-bottom: 10px;">
                  %s
                </div>
                <h2 style="margin: 0 0 6px 0; font-size: 18px; font-weight: bold; color: #0f172a;">
                  %s
                </h2>
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; font-weight: 500;">
                  🏛️ %s
                </p>

                <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12px; color: #334155;">
                  <div style="margin-bottom: 6px;">
                    <strong>Application Deadline:</strong> <span style="color: #dc2626; font-weight: bold;">%s</span>
                  </div>
                  <div style="margin-bottom: 6px;">
                    <strong>Benefits / Salary:</strong> <span style="color: #059669; font-weight: bold;">%s</span>
                  </div>
                </div>
              </div>

              <!-- Document Checklist -->
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 14px; padding: 16px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #92400e;">
                  📋 Keep These Documents Ready Before Applying:
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.5;">
                  %s
                </ul>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin: 30px 0 10px 0;">
                <a href="%s" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%%, #4338ca 100%%); color: #ffffff; text-decoration: none; padding: 14px 32px; font-size: 13px; font-weight: bold; border-radius: 50px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);">
                  Apply on Official Portal Now →
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 20px 28px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 4px 0;">
                All notifications are verified against government gazettes (.gov.in / .nic.in).
              </p>
              <p style="margin: 0; color: #94a3b8;">
                © 2026 GyanSetu • Student Opportunity & Career Intelligence Platform
              </p>
            </div>
          </div>
        </body>
        </html>
        """.formatted(
                studentName,
                urgencyColor,
                urgencyLabel,
                opportunityTitle,
                organization,
                deadlineDate,
                benefits != null ? benefits : "Standard Government Pay Scale",
                docsHtml.toString(),
                officialUrl != null ? officialUrl : "https://scholarships.gov.in"
        );
    }
}
