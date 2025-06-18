package com.Gadour.App.Controller;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.Gadour.App.Repository.*;
import com.Gadour.App.Model.*;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Model.File;
import com.Gadour.App.Model.Folder;
import com.Gadour.App.Model.Notification;
import com.Gadour.App.Model.Share;
import com.Gadour.App.Service.AuthService;
import com.Gadour.App.Service.EmailService;
import com.Gadour.App.Twilio.SmsRequest;
import com.Gadour.App.Twilio.TwilioSmsSender;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/share")
public class ShareController {
	@Autowired
	ShareRepository shareRepository;
	
	@Autowired
	ShareRepo shareRepo;
	
	@Autowired
	AuthService authService;
	
	@Autowired
	NotificationRepositroy notificationRepositroy;
	
	@Autowired
	FileRepositroy fileRepositroy;
	
	@Autowired
	UserRepository userRepository;
	@Autowired
	HistoryRepo HistoryRepo;

	@Autowired
    private EmailService emailService;
	
	@Autowired
	private TwilioSmsSender twilioSmsSender;
	@Autowired
	FolderRepo folderRepo;

	File file;
	Folder folder;
	
	@PostMapping("/add")
	public boolean Sharing (@RequestBody ShareRequest shareRequest,@RequestParam("document") String idDoc , @RequestParam("type") String type) {
		if (shareRequest != null && shareRequest.getCollaboratorList() != null){
			for (Collaborator collaborator:shareRequest.getCollaboratorList()){
				shareFileOrFolder(idDoc, collaborator.getIdUser(), type);
			}
			 return true;
		}
		return false;
	}

	private Share shareFileOrFolder(String idDoc, String idUser2, String type) {
		String idUser1 = authService.getUser().getId();
		Share share = new Share();
		share.setIddoc(new ObjectId(idDoc));
		share.setIdUser1(new ObjectId(idUser1));
		share.setIdUser2(new ObjectId(idUser2));
		share.setType(type);


		//--------------NOTIFICATION PART------------------------

		Optional<File> iddocument = fileRepositroy.findById(idDoc);
		String docName =null;
		if(iddocument.isEmpty()){
			Optional<Folder> folder1 = folderRepo.findById(idDoc);
			if (folder1.isPresent()){
				docName = folder1.get().getFolderName();
			}
			List<File> files= fileRepositroy.findAllByIdFolder(idDoc);
			//List<File> files= fileRepositroy.findAllByidFolder(idDoc);
			for (File file:files){
				shareFileOrFolder(file.getId(),idUser2,"file");
			}
			//"folder"
		}else {
			docName = iddocument.get().getName();
		}


		String user1 = authService.getUser().getName();

		Notification notification = new Notification();
		notification.setUser(idUser2);
		notification.setNotif_title("New Document Shared");
		notification.setNotif_msg("The user " + user1 + " Shared new document: " + docName);
		notification.setNotifDate(new Date());

		notificationRepositroy.save(notification);

		//-------------------MAIL NOTIFICATION-------------------
		String Sharinguser = userRepository.findById(idUser1).get().getName();
		String email = userRepository.findById(idUser2).get().getUsername();

		String phone = userRepository.findById(idUser2).get().getTel();

		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(email);
		mailMessage.setSubject("Notification : New document shared with you");
		mailMessage.setText("User " + Sharinguser + " has shared new document with you, to check the file click on this link \n" +
		"http://localhost:8080/file/find/" + idDoc);


		emailService.sendEmail(mailMessage);

		//------------------------SMS Request--------------------------
		SmsRequest smsRequest = new SmsRequest();
		smsRequest.setPhoneNumber("+216"+phone);
		smsRequest.setMessage("User " + Sharinguser + " has shared new document with you, to check the file click on this link \n" +
				"http://localhost:8080/file/find/" + idDoc);
		try {
			twilioSmsSender.sendSms(smsRequest);
		}catch (Exception e){
			System.out.println(e.getMessage());
		}


		return shareRepository.save(share);
	}

	@PostMapping("/folder/add")
	public Share sharingFolder (@RequestParam("document") String idDoc , @RequestParam("user2") String idUser2 , @RequestParam("type") String type) {
		String idUser1 = authService.getUser().getId();
		Share share = new Share();
		share.setIddoc(new ObjectId(idDoc));
		share.setIdUser1(new ObjectId(idUser1));
		share.setIdUser2(new ObjectId(idUser2));
		share.setType(type);


		//--------------NOTIFICATION PART------------------------

		Optional<Folder> iddocument = folderRepo.findById(idDoc);

		String docName = iddocument.get().getFolderName();


		String user1 = authService.getUser().getName();

		Notification notification = new Notification();
		notification.setUser(idUser2);
		notification.setNotif_title("New Document Shared");
		notification.setNotif_msg("The user " + user1 + " Shared new document: " + docName);
		notification.setNotifDate(new Date());

		notificationRepositroy.save(notification);

		//-------------------MAIL NOTIFICATION-------------------
		String Sharinguser = userRepository.findById(idUser1).get().getName();
		String email = userRepository.findById(idUser2).get().getUsername();

		String phone = userRepository.findById(idUser2).get().getTel();

		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(email);
		mailMessage.setSubject("Notification : New document shared with you");
		mailMessage.setText("User " + Sharinguser + " has shared new document with you, to check the file click on this link \n" +
				"http://localhost:8080/file/find/" + idDoc);


		emailService.sendEmail(mailMessage);

		//------------------------SMS Request--------------------------
		SmsRequest smsRequest = new SmsRequest();
		smsRequest.setPhoneNumber("+216"+phone);
		smsRequest.setMessage("User " + Sharinguser + " has shared new document with you, to check the file click on this link \n" +
				"http://localhost:8080/file/find/" + idDoc);
		try {
			twilioSmsSender.sendSms(smsRequest);
		}catch (Exception e){
			System.out.println(e.getMessage());
		}
	        emailService.sendEmail(mailMessage);





		return shareRepository.save(share);
	}

	@GetMapping("/sharedDocuments")
	public  ResponseEntity<Document>sharedDocuments(){
		Document S = shareRepo.shareContent();
		return new ResponseEntity<>(S, HttpStatus.OK);
	}
	
	@GetMapping("/sharedFiles")
	public ResponseEntity<Document> sharedFiles() {
		Document S = shareRepo.shareFiles();
		return new ResponseEntity<>(S, HttpStatus.OK);
	}
	
	@GetMapping("/allShared")
	public ResponseEntity<Document> allShared( @RequestParam(required = false) boolean inSafety) {
		Document S = shareRepo.allShare( inSafety);
		return new ResponseEntity<>(S, HttpStatus.OK);
	}
	@GetMapping("/find/{id}")
	public Share findByid (@PathVariable("id") String id) {
		return shareRepository.findById(id).get();
	}

	@GetMapping("/allShare")
	public List<ShareDetails> allShare() {
		return  shareRepo.all();

	}
	@DeleteMapping("/delete")
	public void deleteShare(@RequestParam("id") String id) {
		 shareRepository.deleteById(id);


	}

	// supprimer partage
	@PostMapping("/khouloud")
	public Boolean supprimerPartage(@RequestParam("iddoc") String iddoc){
		return shareRepo.deleteShare(iddoc);
	}
}
