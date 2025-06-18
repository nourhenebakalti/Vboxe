package com.Gadour.App.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.Gadour.App.Model.*;
import com.Gadour.App.Repository.EventRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Repository.FriendRepository;
import com.Gadour.App.Repository.NotificationRepo;
import com.Gadour.App.Repository.NotificationRepositroy;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/notification")
public class NotificationController {
	
	@Autowired
	NotificationRepositroy notificationRepositroy;
	@Autowired
	EventRepository eventRepository;
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	FriendRepository friendRepository;
	
	@Autowired
	NotificationRepo notificationRepo;
	
	
	@GetMapping("/all")
	public List<Notification> allNotifs(){
		
		return notificationRepositroy.findAll();
	}
	
	@GetMapping("/my/all")
	
	public List<Notification> myNotification () {
		return notificationRepo.myNotifications();
		
	}

	@PostMapping("/update")
	public void updateNotification(@RequestBody Notification notification){
		Notification notif= notificationRepositroy.save(notification);
		Optional<Event> event= eventRepository.findById(notif.getIdEvent());
		if (event.isPresent()){
			Event myEvent = event.get();
			if (notif.getDetails() != null){
				DetailsInfo detailsInfo = mapper.map(notif.getDetails(), DetailsInfo.class);
				if (detailsInfo.getProposedDate() != null){
					if (myEvent.getUnconfirmedGuestsList() != null){
						myEvent.getUnconfirmedGuestsList().add(detailsInfo);
					}else {
						List<DetailsInfo> unconfirmedGuestsList = new ArrayList<>();
						unconfirmedGuestsList.add(detailsInfo);
						myEvent.setUnconfirmedGuestsList(unconfirmedGuestsList);
					}
				}else {
					if (myEvent.getConfirmedGuestsList() != null){
						myEvent.getConfirmedGuestsList().add(detailsInfo);
					}else {
						List<DetailsInfo> confirmedGuestsList = new ArrayList<>();
						confirmedGuestsList.add(detailsInfo);
						myEvent.setConfirmedGuestsList(confirmedGuestsList);
					}
				}
				eventRepository.save(myEvent);
			}
		}
	}


	@GetMapping("/getmesnotif")
	public List<NotifInfo> getNotifByUser(){
		return notificationRepo.userNotif();
	}

	@PostMapping("")
	public Notification addNotification(@RequestBody Notification notification) {
		Notification savedNotification = notificationRepositroy.save(notification);

		Optional<Event> event = eventRepository.findById(savedNotification.getIdEvent());
		if (event.isPresent()) {
			Event myEvent = event.get();
		}

		return savedNotification;
	}
}
