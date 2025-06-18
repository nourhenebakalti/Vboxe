package com.Gadour.App.Repository;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;

import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.CriteriaDefinition;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.Event;
import com.Gadour.App.Service.AuthService;

import java.util.List;

@Repository
public class EventRepo {

	@Autowired
	MongoTemplate mongoTemplate;
	@Autowired
	AuthService authService;
	
	public Document allEventsDesc(String user) {
		
		
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("attendents").is(user)),
				Aggregation.sort(Direction.DESC , "start")
				);
		
		return mongoTemplate.aggregate(aggregation, "Events" , Event.class).getRawResults();
	}
	
	public List<Event> myEvents () {
		String id = authService.getUser().getId();
		String group = authService.getUser().getGroup();

		Criteria criteria = new Criteria().orOperator(
				Criteria.where("user").is(id), // Événements créés par l'utilisateur
				Criteria.where("attendents").in(id) // Événements où l'utilisateur est invité
		);
		
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(criteria),
				Aggregation.sort(Direction.DESC , "start")
				);
		AggregationResults<Event> aggregationResults =mongoTemplate.aggregate(aggregation, "Events" , Event.class);
		return aggregationResults.getMappedResults();
	}
	
	
}
