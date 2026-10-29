package org.gyansetu.repository;

import org.gyansetu.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findAllByOrderByCreatedAtDesc();

    long countByUserIdAndIsReadFalse(Long userId);

    long countByIsReadFalse();

    boolean existsByOpportunityIdAndDaysRemaining(String opportunityId, int daysRemaining);

    boolean existsByUserIdAndOpportunityIdAndDaysRemaining(Long userId, String opportunityId, int daysRemaining);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId OR n.userId IS NULL")
    void markAllAsReadForUser(Long userId);
}
