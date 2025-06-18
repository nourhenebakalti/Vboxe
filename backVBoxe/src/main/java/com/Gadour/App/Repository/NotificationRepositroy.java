package com.Gadour.App.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.Gadour.App.Model.Notification;

import java.util.List;

public interface NotificationRepositroy extends MongoRepository<Notification, String> {


    List<Notification> findAllByIdEvent(String idEvent);
}
