package com.Gadour.App.Repository;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.MailModel;
import com.Gadour.App.Service.AuthService;



@Repository
public class MailRepo {
	
	@Autowired
	MongoTemplate mongoTemplate;
	
	@Autowired
	AuthService authService;
	
	public Document myMails() {
		
		String id = authService.getUser().getId();
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("reciever").is(id)),
				Aggregation.sort(Direction.DESC , "mail_date")
				);
		
		return mongoTemplate.aggregate(aggregation, "MailModel", MailModel.class).getRawResults();
	}
	
	public Document mailSent() {
		
		String id = authService.getUser().getId();
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("sender").is(id)),
				Aggregation.sort(Direction.DESC , "mail_date")
				);
		
		return mongoTemplate.aggregate(aggregation, "MailModel", MailModel.class).getRawResults();
	}

}
