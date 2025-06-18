package com.Gadour.App.Service;

import com.Gadour.App.Model.Corbeille;
import com.Gadour.App.Model.Message;
import com.Gadour.App.Repository.CorbeilleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CorbeilleService {

    @Autowired
    private CorbeilleRepository corbeilleRepository;

    public Corbeille getCorbeilleByUserId(String userId) {
        return corbeilleRepository.findByUserId(userId);
    }

    public void addMessageToCorbeille(Message message, String userId) {
        Corbeille corbeille = corbeilleRepository.findByUserId(userId);
        if (corbeille != null) {
            boolean messageExists = false;

            for (Message deletedMessage : corbeille.getDeletedMessages()) {

                if (deletedMessage.getId_message().equals(message.getId_message())) {
                    messageExists = true;
                    break;
                }
            }

            if (!messageExists) {
                corbeille.addDeletedMessage(message);
                corbeilleRepository.save(corbeille);
                System.out.println("Message added to corbeille");
            } else {
                System.out.println("Message already exists in corbeille");
            }
        } else {
            System.out.println("Error: Corbeille not found");
        }
    }
    public Corbeille updateCorbeille(Corbeille corbeille) {
        return corbeilleRepository.save(corbeille);
    }
    public Corbeille createCorbeille(String userId) {
        Corbeille corbeille = new Corbeille();
        corbeille.setUserId(userId);
        return corbeilleRepository.save(corbeille);
    }
}
