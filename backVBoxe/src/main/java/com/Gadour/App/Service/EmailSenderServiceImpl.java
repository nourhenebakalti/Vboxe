package com.Gadour.App.Service;
import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Repository.UserRepo;
import com.Gadour.App.Repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    private final JavaMailSender mailSender;
    @Autowired
    UserRepository userRepository;

    public EmailSenderServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;

    }

    public void sendEmail(String to) {

        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom("vboxe2022@gmail.com");
        simpleMailMessage.setTo(to);
        simpleMailMessage.setSubject("Vboxe code");
        int code =  new ObjectId().toString().hashCode();
        simpleMailMessage.setText("votre code est   "+"VB"+code);

        // il voius manque d'ajouter ce code chez le user on creant repository+setcode a chaque envoi du mail

      DAOUser daoUser=userRepository.findByUsername("taymabenhmida1@gmail.com");
      daoUser.setCode("VB"+code);
      userRepository.save(daoUser);

        this.mailSender.send(simpleMailMessage);
    }

	@Override
	public void sendEmail(String to, String subject) {
		// TODO Auto-generated method stub
		
	}
}
