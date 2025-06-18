package com.Gadour.App.Async;

import com.Gadour.App.Model.*;
import com.Gadour.App.Repository.NotificationRepositroy;
import com.Gadour.App.Repository.UserRepository;
import com.Gadour.App.Service.EmailService;
import com.Gadour.App.Twilio.ServiceSms;
import com.Gadour.App.Twilio.SmsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;



@Service
public class AsyncTreatmentImpl implements AsyncTreatment{

    @Autowired
    private  NotificationRepositroy notificationRepositroy;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ServiceSms serviceSms;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    @Async
    @Override
    public void asyncSendNotifAndMailAndSms(Event event, List<String> attends, Event savedEvent, String user, String id) {
        Notification notification = new Notification();
        if (attends != null){
            Details details = new Details();
            details.setCurrentDate(savedEvent.getStart());
            details.setTitleEvent(savedEvent.getTitle());
            notification.setNotif_title("New appointement added");
            notification.setNotifDate(new Date());
            notification.setIdUserEventCreater(event.getUser());
            notification.setIdEvent(savedEvent.getId());
            notification.setType(TypeNotif.Event.toString());
            for (String idAttend : attends) {

                notification.setIdNotification(null);
                notification.setUser(idAttend);
                notification.setNotif_title("New appointement added");
                notification.setNotif_msg("The user " + user + " has added an appointement in your calendar");

                String name = userRepository.findById(idAttend).get().getName();
                details.setIdUser(idAttend);
                details.setName(name);
                notification.setDetails(details);
                notificationRepositroy.save(notification);
                //------------------Mail-----------------------//
                String userName = userRepository.findById(idAttend).get().getUsername();
                String Sharinguser = userRepository.findById(id).get().getName();

                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(userName);
                mailMessage.setSubject("Notification : New appointement added");
                mailMessage.setText("User " + Sharinguser + " want you to participate in his new appointement, to check the event click on this link \n" +
                        "http://localhost:8080/event/find/" + event.getId());
                emailService.sendEmail(mailMessage);
                // envoie des sms
                String phoneNumber =userRepository.findById(idAttend).get().getTel();
                if ( phoneNumber != null){

                    SmsRequest smsRequest= new SmsRequest();
                    smsRequest.setPhoneNumber("+216"+phoneNumber);
                    smsRequest.setMessage("User " + Sharinguser + " want you to participate in his new appointement");
                    try {
                        serviceSms.sendSms(smsRequest);
                    }catch (Exception e){
                        System.out.println(e.getMessage());
                    }
                }

            }
        }
    }
    @Async
    @Override
    public void asyncSendCodeByMailAndSms(DAOUser user) {

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getUsername());
        mailMessage.setSubject("Verification Code: Action Required");
        mailMessage.setText("Dear " + user.getName() + ",Your verification code is: " + user.getCode() + " ,Please use this code to complete the verification process. If you did not request this code, please ignore this message.");

        emailService.sendEmail(mailMessage);

        // envoie des sms

        if ( user.getTel() != null) {

            SmsRequest smsRequest = new SmsRequest();
            smsRequest.setPhoneNumber("+216" + user.getTel());
            smsRequest.setMessage("Dear " + user.getName() + ",Your verification code is: " + user.getCode() + " ,Please use this code to complete the verification process.");
            try {
                serviceSms.sendSms(smsRequest);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }


    @Async
    @Override
    public void asyncSendCodeByMailAndSmsForProfile(DAOUser user) {
        String fullLink = frontendBaseUrl +"/link/"+ user.getLinkPath();
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(user.getUsername());
        mailMessage.setSubject("Accès à votre espace partagé");

        mailMessage.setText(
                "Bonjour " + user.getName() + ",\n\n" +
                        "Voici le lien vers votre espace partagé :\n" +
                        fullLink + "\n\n" +
                        "Code d'accès : " + user.getLinkCode() + "\n\n" +
                        "Merci de ne pas partager ce lien avec des personnes non autorisées.\n\n" +
                        "L'équipe TonApp"
        );

        emailService.sendEmail(mailMessage);


        if (user.getTel() != null) {
            SmsRequest smsRequest = new SmsRequest();
            smsRequest.setPhoneNumber("+216" + user.getTel());
            smsRequest.setMessage(
                    "Votre lien : " + fullLink + "\nCode : " + user.getLinkCode()
            );

            try {
                serviceSms.sendSms(smsRequest);
            } catch (Exception e) {
                System.out.println("Erreur SMS : " + e.getMessage());
            }
        }
    }
    @Async
    @Override
    public void asyncSendCodeByMailAndSmsForMoveFile(String idUser ,String code) {
        if (idUser != null){
            DAOUser user= userRepository.findById(idUser).orElse(null);
            if (user != null){
                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(user.getUsername());
                mailMessage.setSubject("Verification Code: Action Required");
                mailMessage.setText("Dear " + user.getName() + ",Your verification code is: " + code + " ,Please use this code to complete the verification process. If you did not request this code, please ignore this message.");

                emailService.sendEmail(mailMessage);

                // envoie des sms

                if ( user.getTel() != null) {

                    SmsRequest smsRequest = new SmsRequest();
                    smsRequest.setPhoneNumber("+216" + user.getTel());
                    smsRequest.setMessage("Dear " + user.getName() + ",Your verification code is: " +code + " ,Please use this code to complete the verification process.");
                    try {
                        serviceSms.sendSms(smsRequest);
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                }
            }
        }


    }

    @Async
    @Override
    public void asyncSendNotifAndMailDeleteEvent(Event event, List<String> attends) {
        Notification notification = new Notification();
        if (attends != null){

            notification.setType(TypeNotif.Delete.toString());
            for (String idAttend : attends) {

                notification.setIdNotification(null);
                notification.setUser(idAttend);
                notification.setNotif_title("Event canceled");
                notification.setNotif_msg(event.getInitiatorName() + " has cancel the event :"+ event.getTitle());
                notification.setNotifDate(new Date());

                notificationRepositroy.save(notification);
                //------------------Mail-----------------------//
                String userName = userRepository.findById(idAttend).get().getUsername();

                SimpleMailMessage mailMessage = new SimpleMailMessage();
                mailMessage.setTo(userName);
                mailMessage.setSubject("Notification : Event canceled");
                mailMessage.setText( event.getInitiatorName() + " has cancel the event :"+ event.getTitle());
                emailService.sendEmail(mailMessage);


            }
        }
    }

}
