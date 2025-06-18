package com.Gadour.App.Controller;

import com.Gadour.App.Model.Message;
import com.Gadour.App.Model.MessageDto;
import com.Gadour.App.Repository.UserRepository;
import com.Gadour.App.Service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @GetMapping
    public ResponseEntity<List<Message>> getAllMessages() {
        List<Message> messages = messageService.getAllMessages();
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(@PathVariable String id) {
        Message messages = messageService.getMessageById(id);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
    @GetMapping("/sender/{sender}")
    public ResponseEntity<List<Message>> getAllMessagesBySender(@PathVariable String sender) {
        List<Message> messages = messageService.getAllMessagesBySender(sender);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/receiver/{receiver}")
    public ResponseEntity<List<Message>> getAllMessagesByReceiver(@PathVariable String receiver) {
        List<Message> messages = messageService.getAllMessagesByReceiver(receiver);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Message> saveMessage(@RequestBody MessageDto message) {
            Message savedMessage = messageService.saveMessage(message);
            return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String id) {
        messageService.deleteMessage(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
