package com.Gadour.App.Repository;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findAllBySender(DAOUser sender) ;
    List<Message> findAllByReciever(DAOUser reciever);


}