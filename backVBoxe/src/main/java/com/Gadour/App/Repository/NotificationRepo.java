package com.Gadour.App.Repository;

import com.Gadour.App.Model.NotifInfo;
import com.Gadour.App.Model.TypeNotif;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.Notification;
import com.Gadour.App.Service.AuthService;

import java.util.List;
import java.util.stream.Collectors;


@Repository
public class NotificationRepo {
	
	@Autowired
	MongoTemplate mongoTemplate;
	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	AuthService authService;
	
	public List<Notification> myNotifications () {

		String id = authService.getUser().getId();

		// Créer une requête Query
		Query query = new Query();
		query.addCriteria(new Criteria().orOperator(
				Criteria.where("user").is(id),
				Criteria.where("idUserEventCreater").is(id)
		));

		// Ajouter le critère de type de notification
		query.addCriteria(Criteria.where("type").is(TypeNotif.Event.toString()));
		// Ajouter le tri par date dans l'ordre décroissant
		query.with(Sort.by(Sort.Direction.DESC, "notifDate"));
		return mongoTemplate.find(query, Notification.class);

	}


	public List<NotifInfo> userNotif () {

		String id = authService.getUser().getId();

		// Créer une requête Query
		Query query = new Query();
		query.addCriteria(Criteria.where("user").is(id));
		//query.with(Sort.by(Sort.Direction.DESC, "notifDate"));
		List<Notification> listNotif =  mongoTemplate.find(query, Notification.class);
		if (listNotif != null){
			List<NotifInfo> notifInfoList = listNotif.stream()
					.map(notification -> mapper.map(notification, NotifInfo.class))
					.collect(Collectors.toList());
			return notifInfoList;
		}

		return null;

	}
}
