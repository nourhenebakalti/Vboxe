package com.Gadour.App.Controller;
import com.Gadour.App.Model.Corbeille;
import com.Gadour.App.Model.Message;
import com.Gadour.App.Service.CorbeilleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/corbeille")
public class CorbeilleController {

    @Autowired
    private CorbeilleService corbeilleService;

    @GetMapping("/{userId}")
    public ResponseEntity<Corbeille> getCorbeilleByUserId(@PathVariable String userId) {
        Corbeille corbeille = corbeilleService.getCorbeilleByUserId(userId);
        if (corbeille != null) {
            return new ResponseEntity<>(corbeille, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/addMessage/{userId}")
    public ResponseEntity<String> addMessageToCorbeille(@RequestBody Message message, @PathVariable String userId) {
        corbeilleService.addMessageToCorbeille(message, userId);
        return new ResponseEntity<>("Message added to Corbeille successfully", HttpStatus.OK);
    }

    @PostMapping("/createCorbeille/{userId}")
    public ResponseEntity<String> createCorbeille(@PathVariable String userId) {
        Corbeille corbeille = corbeilleService.createCorbeille(userId);
        return new ResponseEntity<>("Corbeille created successfully with ID: " + corbeille.getId(), HttpStatus.CREATED);
    }
    @PutMapping("/{userId}")
    public ResponseEntity<Corbeille> updateCorbeille(@PathVariable String userId, @RequestBody List<Message> corbeilleData) {
        Corbeille corbeille = corbeilleService.getCorbeilleByUserId(userId);
        if (corbeille != null) {
            corbeille.setDeletedMessages(corbeilleData); // Assuming only deletedMessages can be updated
            Corbeille updatedCorbeille = corbeilleService.updateCorbeille(corbeille);
            return new ResponseEntity<>(updatedCorbeille, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}