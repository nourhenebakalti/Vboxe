package com.Gadour.App.Controller;

import java.util.Date;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Model.FriendList;
import com.Gadour.App.Model.Notification;
import com.Gadour.App.Repository.FriendRepo;
import com.Gadour.App.Repository.FriendRepository;
import com.Gadour.App.Repository.NotificationRepositroy;
import com.Gadour.App.Service.AuthService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/friend")
public class FriendsController {
	@Autowired
	FriendRepository friendRepository;
	
	@Autowired
	AuthService authService;
	@Autowired
	FriendRepo friendRepo;
	
	@Autowired
	NotificationRepositroy notificationRepositroy;
	
	@PostMapping("/add")
	public ResponseEntity<FriendList>addFriend(@RequestParam("user") String user2) {
		String id = authService.getUser().getId();
		FriendList newFriend = new FriendList();
		newFriend.setUser1(id);
		newFriend.setUser2(user2);
		
		//--------------NOTIFICATION PART------------------------
		
		String user1 = authService.getUser().getName();
		
		Notification notification = new Notification();
		notification.setUser(user2);
		notification.setNotif_title("New User friend");
		notification.setNotif_msg("The user " + user1 + " Has added you as a friend !" );
		notification.setNotifDate(new Date());
		
		notificationRepositroy.save(notification);
		
		FriendList S = friendRepository.save(newFriend);
		
		
		return new ResponseEntity<FriendList>(S , HttpStatus.CREATED);
		
	}
	
	@GetMapping("/all")
	public List<FriendList>FriendList(){
		String id = authService.getUser().getId();
		return friendRepository.findAllByUser1(id);
	}
	
	@GetMapping("/allFriends")
	public Document getFriends(){
		return  friendRepo.getFriends();
	}
	@GetMapping("/allUsers")
	public Document getUsers(){
		return  friendRepo.getAllUsersExceptConnected();
	}

	@GetMapping("/allFriendsforshare/{idDoc}")
	public Document getFriendsForShare(@PathVariable String idDoc){
		return  friendRepo.getFriendsForShare(idDoc);
	}
	
	@DeleteMapping("/delete/{idFriend}")
	public String deleteFolder(@PathVariable("idFriend") String idFriend) {
		friendRepo.deleteByIdFriend(idFriend);
		
		//--------------NOTIFICATION PART------------------------
		FriendList friendList = friendRepository.findById(idFriend).get();
		
		String user1 = authService.getUser().getName();
		
		Notification notification = new Notification();
		notification.setUser(friendList.getUser2().toString());
		notification.setNotif_title("Friend removed you");
		notification.setNotif_msg("The user " + user1 + " Has removed you from his friendlist !" );
		notification.setNotifDate(new Date());
		
		notificationRepositroy.save(notification);
		
		return "deleted";
	}
	
	@GetMapping("/search/{words}")
	public Document getFriendsByNameOrMail(@PathVariable("words") String words ){
		return  friendRepo.getFriendsByNameOrMail(words);
	}
	
	
	

}
