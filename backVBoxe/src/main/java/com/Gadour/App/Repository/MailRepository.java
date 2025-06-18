package com.Gadour.App.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.Gadour.App.Model.MailModel;



public interface MailRepository extends MongoRepository<MailModel, String> {
	
	List<MailModel> findAllBySender(String sender) ;
	List<MailModel> findAllByReciever(String reciever);

}
