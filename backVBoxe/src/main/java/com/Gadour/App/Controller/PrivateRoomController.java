package com.Gadour.App.Controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.PrivateRoom;
import com.Gadour.App.Repository.RoomRepo;
import com.Gadour.App.Repository.UserRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/room")

public class PrivateRoomController {
	
	@Autowired
	private RoomRepo roomRepo;
	@Autowired
	private UserRepository userRepository;
	String userid ="";
	@PostMapping("/add")
	public PrivateRoom addRoom (@RequestBody PrivateRoom privateRoom ,String id, DAOUser daoUser , DAOUser[] users) throws Exception {
		Optional<DAOUser> status = userRepository.findById(id);
		if (!status.isPresent()) {
			throw new Exception("Could not find File with ID : "+ id);
		}else
		userid=daoUser.getId();
		List<String> ids = new ArrayList<>() ;
		ids.add(userid);
		
		PrivateRoom room = new PrivateRoom();
		room.setRoomCreation(new Date());
		room.setUserid(ids);
		
		room.setStatus(true);
		PrivateRoom rooms = roomRepo.save(room);
		
		return roomRepo.save(rooms);
		
		
	}
	
	@GetMapping("/all")
	public List<PrivateRoom> allRoom(){
		return roomRepo.findAll();
	}
	
	
}
