package org.gyansetu.service;

import org.gyansetu.model.NotificationChange;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationTrackerService {

    private final DataRepository repository;

    public NotificationTrackerService(DataRepository repository) {
        this.repository = repository;
    }

    public List<NotificationChange> getLiveChanges() {
        return repository.getNotificationChanges();
    }
}
