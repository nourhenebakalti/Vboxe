package com.Gadour.App.Service;

import com.Gadour.App.Model.Notification;
import com.Gadour.App.Repository.NotificationRepositroy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class NotificationService {

    private final NotificationRepositroy notificationRepository;

    @Autowired
    public NotificationService(NotificationRepositroy notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(Notification notification) {
                return notificationRepository.save(notification);
    }
}
