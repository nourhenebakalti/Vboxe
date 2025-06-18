package com.Gadour.App.Controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.History;
import com.Gadour.App.Model.MailModel;
import com.Gadour.App.Model.Notification;
import com.Gadour.App.Repository.HistoryRepositoy;
import com.Gadour.App.Repository.MailRepository;
import com.Gadour.App.Repository.NotificationRepositroy;
import com.Gadour.App.Repository.UserRepository;
import com.Gadour.App.Service.AuthService;
import com.Gadour.App.Service.EmailService;
import com.Gadour.App.Service.MailService;



@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/mail")
public class MailController {
	
	@Autowired
	MailRepository mailRepository;
	
	@Autowired
	MailService mailService;
	
	@Autowired
	HistoryRepositoy historyRepositoy;
	
	@Autowired
	AuthService authService;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
    private EmailService emailService;
	
	@Autowired
	NotificationRepositroy notificationRepositroy;
	
	@GetMapping("/recieved")
	public ResponseEntity<Document> recievedMails(){
		Document msgs = mailService.myMailsDesc();
		
		return new ResponseEntity<Document>(msgs , HttpStatus.OK);
	}
	
	@GetMapping("/sent")
	public ResponseEntity<Document> sentMails(){
		Document msgs = mailService.mailSentDesc();
		
		return new ResponseEntity<Document>(msgs , HttpStatus.OK);
	}
	
	@PostMapping("/add")
	public ResponseEntity<Map<String, String>>sendMail(@RequestParam("reciever") String reciever , @RequestParam("subject") String subject,
			@RequestParam("content") String content) {
		
		MailModel mailModel = new MailModel();
		
		String sender = authService.getUser().getId();
		
		DAOUser user = userRepository.findById(sender).get();
		
		mailModel.setSender(sender);
		mailModel.setReciever(reciever);
		mailModel.setSubject(subject);
		mailModel.setContent(content);
		mailModel.setMail_date(new Date());
		mailModel.setSignature(user.getSignature());
		
		mailRepository.save(mailModel);
		//---------------Notification---------------------
		
		Notification notification = new Notification();
		
		notification.setUser(reciever);
		notification.setNotif_title("You recieved new mail !");
		notification.setNotif_msg("User " + sender + " sent you a mail" );
		notification.setNotifDate(new Date());
		
		notificationRepositroy.save(notification);
		
		//----------------History---------------
		History history = new History();
		history.setUser(sender);
		history.setActionType("Send Mail");
		history.setHistoryDate(new Date());
		
		
		//------------------gmail--------------
		
		String senderMail = userRepository.findById(sender).get().getName();
		String recieverMail = userRepository.findById(reciever).get().getUsername();
		
		 SimpleMailMessage mailMessage = new SimpleMailMessage();
	        mailMessage.setTo(recieverMail);
	        mailMessage.setSubject("Notification : New mail sent");
	        mailMessage.setText("User " + senderMail + " has sent you a new mail to access the mail click on the link below \n "
	        		+ "http://localhost:8080/mail/find/"+mailModel.getId_mail()
	        		);
	        emailService.sendEmail(mailMessage);
		
		
	        Map<String, String> msg = new HashMap<>();
	        msg.put("Message", "Message sent !");
		return  new ResponseEntity<Map<String, String>>(msg , HttpStatus.CREATED);
		
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<MailModel>updateMail(@RequestParam(required = false , value = "reciever") String reciever , @RequestParam("subject") String subject 
			,@RequestParam("content") String content ,@PathVariable("id") String id){
		MailModel mailupdate = mailService.updateMail(reciever, subject, content, id);
		
		return new ResponseEntity<MailModel>(mailupdate , HttpStatus.OK);
		
		
	}
	
	@GetMapping("/mymails")
	
		public ResponseEntity<List<MailModel>> mymails(){
		return new ResponseEntity<List<MailModel>>(mailService.MailsSent() , HttpStatus.OK);
	}
	
	@PutMapping("/update/signature")
	public ResponseEntity<DAOUser> addSignature (@RequestParam("signature") MultipartFile signature){
		DAOUser user = mailService.addSignature(signature);
		
		return new ResponseEntity<DAOUser>(user , HttpStatus.OK);
	}
	
	@PutMapping("/update/signature/delete")
	public ResponseEntity<DAOUser> deleteSignature (){
		DAOUser user = mailService.deleteSignature();
		
		return new ResponseEntity<DAOUser>(user , HttpStatus.OK);
	}
	
	@DeleteMapping("/delete/{id}")
	public void deleteMail(@PathVariable("id") String id){
		mailService.deleteMail(id);
		 
	}
	
	@GetMapping("/find/{id}")
	public Optional<MailModel> findMailByid (@PathVariable("id") String id) {
		return mailRepository.findById(id);
	}

}
