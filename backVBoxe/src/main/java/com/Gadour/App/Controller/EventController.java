package com.Gadour.App.Controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

import com.Gadour.App.Async.AsyncTreatment;
import com.Gadour.App.Model.*;
import com.Gadour.App.Twilio.ServiceSms;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Repository.EventRepo;
import com.Gadour.App.Repository.EventRepository;
import com.Gadour.App.Repository.HistoryRepositoy;
import com.Gadour.App.Repository.NotificationRepositroy;
import com.Gadour.App.Repository.UserRepository;
import com.Gadour.App.Service.AuthService;
import com.Gadour.App.Service.EmailService;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/event")
class EventController {

	@Autowired
	private EventRepository  eventRepository;

	@Autowired
	private AuthService authService;

	@Autowired
	private EventRepo eventRepo;

	@Autowired
	private NotificationRepositroy notificationRepositroy;

	@Autowired
	private HistoryRepositoy historyRepositoy;

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ServiceSms serviceSms;

	@Autowired
	EmailService emailService;
	@Autowired
	MongoTemplate mongoTemplate;

	@Autowired
	private AsyncTreatment asyncTreatment;

	@GetMapping("/all")
	public List<Event> allEvents() {
		return eventRepository.findAll();
	}

	@PostMapping("/add")
	public ResponseEntity<Map<String, String>> addEvent(@RequestBody Event event) {
		String id = authService.getUser().getId();

		String user = authService.getUser().getName();

		event.setUser(id);
		event.setInitiatorName(user);

		Event savedEvent = eventRepository.save(event);

		//--------------------Notification------------------//
		List<String> attends = event.getAttendents();
		// envoie notif && mail && sms
		asyncTreatment.asyncSendNotifAndMailAndSms(event, attends, savedEvent, user, id);
		//--------------------History------------------//
		History history = new History();
		history.setUser(id);
		history.setActionType("Added an Event");
		history.setHistoryDate(new Date());
		historyRepositoy.save(history);
		//--------------------Mail------------------//
		Map<String, String> msg = new HashMap<>();
		msg.put("Message", "Event "+ event.getTitle() + " is added");
		return new ResponseEntity<Map<String,String>> (msg , HttpStatus.CREATED);
	}

	@GetMapping(value = "/getUserAuth/{username}")
	public DAOUser getUserByUsername(@PathVariable String username){
		return userRepository.findByUsername(username);
	}

	@PatchMapping("/update")
	public Event updateEvent(@RequestBody Event event) {
		String id = authService.getUser().getId();
		event.setUser(id);
		// add async treatment to update notif if date is treated
		return eventRepository.save(event);
	}

	@GetMapping("/find")
	public List<Event> findbyattendant (@RequestParam("id") String id) {
		return eventRepository.findAllByAttendents(id);
	}

	@GetMapping("/findall")
	public Document findAllattdesc (@RequestParam("user") String user) {
		return eventRepo.allEventsDesc(user);
	}

	@GetMapping("findall/my")
	public List<Event> myEvents () {
		return eventRepo.myEvents();
	}

	@GetMapping("/find/{id}")
	public Optional<Event> findByEvent (@PathVariable("id") String id) {
		return eventRepository.findById(id);
	}

	@DeleteMapping("/delete/{id}")
	public Boolean removeEvent(@PathVariable("id") String id) {
		Optional<Event> event= eventRepository.findById(id);
		if (event.isPresent()){
			List<String> idUserInvited = event.get().getAttendents();
			eventRepository.deleteById(id);
			List<Notification> eventNotif = notificationRepositroy.findAllByIdEvent(id);
			if (eventNotif != null && !eventNotif.isEmpty()){
				for (Notification notif:eventNotif){
					notificationRepositroy.delete(notif);
				}
			}
			// traitement async pour l'envoie des email idUserInvited
			asyncTreatment.asyncSendNotifAndMailDeleteEvent(event.get(), idUserInvited);
			return true;
		}

		return false;
	}




	@GetMapping("/events")
	public List<Event> getEventsInRange(@RequestParam(value = "start", required = true) String start,
										@RequestParam(value = "end", required = true) String end) {
		Date startDate = null;
		Date endDate = null;
		SimpleDateFormat inputDateFormat=new SimpleDateFormat("yyyy-MM-dd");

		try {
			startDate = inputDateFormat.parse(start);
		} catch (ParseException e) {
			throw new BadDateFormatException("bad start date: " + start);
		}

		try {
			endDate = inputDateFormat.parse(end);
		} catch (ParseException e) {
			throw new BadDateFormatException("bad end date: " + end);
		}

		LocalDateTime startDateTime = LocalDateTime.ofInstant(startDate.toInstant(),
				ZoneId.systemDefault());

		LocalDateTime endDateTime = LocalDateTime.ofInstant(endDate.toInstant(),
				ZoneId.systemDefault());

		return eventRepository.findByStartGreaterThanEqualAndEndLessThanEqual(startDateTime, endDateTime);
	}

	@PostMapping("/usersname")
	public ResponseEntity<List<String>> getNamesOfCollabs(@RequestBody List<String> listIdsUsers){

		List<String> listNames = new ArrayList<>();
		if (listIdsUsers!= null){
			for (String id:listIdsUsers){
				Query query= new Query();
				query.addCriteria(Criteria.where("id").is(id));//name
				query.fields().include("name");
				DAOUser user= mongoTemplate.findOne(query, DAOUser.class);
				listNames.add(user.getName());
			}
		}

		return ResponseEntity.ok(listNames);
	}
}

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
class BadDateFormatException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public BadDateFormatException(String dateString) {
		super(dateString);
	}
}


