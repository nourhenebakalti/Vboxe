package com.Gadour.App.Service;

import java.util.Date;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.History;
import com.Gadour.App.Model.MailModel;
import com.Gadour.App.Model.Notification;
import com.Gadour.App.Repository.HistoryRepositoy;
import com.Gadour.App.Repository.MailRepo;
import com.Gadour.App.Repository.MailRepository;
import com.Gadour.App.Repository.NotificationRepositroy;
import com.Gadour.App.Repository.UserRepository;



@Service
public class MailService {
	
	@Autowired
	MailRepository mailRepository;
	
	@Autowired
	AuthService authService;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	MailRepo mailRepo;
	
	@Autowired
	HistoryRepositoy historyRepositoy;
	
	@Autowired
	NotificationRepositroy notificationRepositroy;
	
	@Autowired
    private EmailService emailService;
	
	
	public MailModel sendMail( String reciever , String subject , String content) {
		String NameUser = authService.getUser().getId();
		MailModel mailModel = new MailModel();
		 
		 mailModel.setSender(NameUser);
		 mailModel.setReciever(reciever);
		 mailModel.setSubject(subject);
		 mailModel.setContent(content);
		 mailModel.setMail_date(new Date());
		 
		
		
		return  mailRepository.save(mailModel);
	}
	
	public MailModel updateMail (String reciever , String subject , String content , String id)  {
		MailModel newmailModel =  mailRepository.findById(id).get();
		
		String idUser = authService.getUser().getId();
		
		if((newmailModel.getReciever() != null) && (!newmailModel.getReciever().isEmpty())){newmailModel.setReciever(reciever);}
		if((newmailModel.getSubject() != null) && (!newmailModel.getSubject().isEmpty())){newmailModel.setSubject(subject);}
		if((newmailModel.getContent() != null) && (!newmailModel.getContent().isEmpty())){newmailModel.setSubject(content);}
		newmailModel.setMail_date(new Date());
		if (newmailModel.getEdited()==false) {newmailModel.setEdited(true);}
		
		History history = new History();
		history.setUser(idUser);
		history.setActionType("Update Mail");
		history.setHistoryDate(new Date());
		
		return mailRepository.save(newmailModel) ;
		
	}
	
	public void deleteMail (String id) {
		
		String idUser = authService.getUser().getId();
		
		
		
		mailRepository.deleteById(id);
		
		History history = new History();
		history.setUser(idUser);
		history.setActionType("Update Mail");
		history.setHistoryDate(new Date());
	}
	
	public List<MailModel> MyMails(){
		String id = authService.getUser().getId();
		
		return mailRepository.findAllByReciever(id);
	}
	
	public Document myMailsDesc() {
		return mailRepo.myMails();
	}
	
	public List<MailModel> MailsSent(){
		String id = authService.getUser().getId();
		
		return mailRepository.findAllBySender(id);
	}
	
	public Document mailSentDesc() {
		return mailRepo.mailSent();
	}
	
	public DAOUser addSignature (MultipartFile file) {
		
		String id = authService.getUser().getId();
		DAOUser user = userRepository.findById(id).get();
		
		user.setSignature(file);
		
		return userRepository.save(user);
		
	}
	
	public DAOUser deleteSignature () {
		
		String id = authService.getUser().getId();
		DAOUser user = userRepository.findById(id).get();
		
		user.setSignature(null);
		
		return userRepository.save(user);
		
	}
	
}
