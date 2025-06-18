package com.Gadour.App.Service;


import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.Message;
import com.Gadour.App.Model.MessageDto;
import com.Gadour.App.Repository.MessageRepository;
import com.Gadour.App.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MessageService {
    @Autowired
    MessageRepository messageRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailService emailService;
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }
    public Message getMessageById(String id) {

        return messageRepository.findById(id).get();
    }

    public List<Message> getAllMessagesBySender(String senderId) {
        Optional<DAOUser> sender = userRepository.findById(senderId);
        return  messageRepository.findAllBySender(sender.get());
    }

    public List<Message> getAllMessagesByReceiver(String receiverId) {
        Optional<DAOUser> receiver = userRepository.findById(receiverId);
        return messageRepository.findAllByReciever(receiver.get());
    }
    public Message saveMessage(MessageDto messageDto) {
        System.out.println("Sender Email: " + messageDto.getSenderEmail());
        System.out.println("Receiver Email: " + messageDto.getReceiverEmail());

        Optional<DAOUser> senderOpt = Optional.ofNullable(userRepository.findByUsername(messageDto.getSenderEmail()));
        Optional<DAOUser> receiverOpt = Optional.ofNullable(userRepository.findByUsername(messageDto.getReceiverEmail()));

        System.out.println("Sender Found: " + senderOpt.isPresent());
        System.out.println("Receiver Found: " + receiverOpt.isPresent());
        if (senderOpt.isPresent() && receiverOpt.isPresent()) {
            Message message = new Message();
            message.setSender(senderOpt.get());
            message.setReciever(receiverOpt.get());
            message.setSubject(messageDto.getSubject());
            message.setContent(messageDto.getContent());
            message.setMail_date(messageDto.getMailDate());
            message.setId_signature(messageDto.getIdSignature());

            return messageRepository.save(message);
        } else {
            throw new RuntimeException("Sender or Receiver not found");
        }

    }

    public void deleteMessage(String id) {
        messageRepository.deleteById(id);
    }
}
