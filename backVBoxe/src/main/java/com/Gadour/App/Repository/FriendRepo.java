package com.Gadour.App.Repository;

import java.util.ArrayList;
import java.util.List;

import com.Gadour.App.Model.Share;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.ArrayOperators;
import org.springframework.data.mongodb.core.aggregation.ObjectOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.FriendList;
import com.Gadour.App.Model.UserDTO;
import com.Gadour.App.Service.AuthService;

@Repository
public class FriendRepo {
	@Autowired
	AuthService authService;
	@Autowired
	MongoTemplate mongoTemplate;
	@Autowired
	FriendRepository friendRepository;

	public Document getFriendsForShare (String iddoc) {

		String id = authService.getUser().getId();
		 ObjectId ids = new ObjectId(id);
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user1").is(ids)),

				Aggregation.lookup("Users", "user2", "_id", "friends"),
				Aggregation.replaceRoot().withValueOf(ObjectOperators.valueOf("password").
						mergeWithValuesOf(ArrayOperators.arrayOf("friends").elementAt(0))),
				Aggregation.project().andExclude("password")


				);

		Document document= mongoTemplate.aggregate(aggregation, "FriendList",FriendList.class).getRawResults();
		if (!document.isEmpty()){

			Object resultsObj = document.get("results");

			if (resultsObj instanceof List<?>) {
				List<?> resultsList = (List<?>) resultsObj;

				List<Document> results = new ArrayList<>();
				for (Object obj : resultsList) {
					if (obj instanceof Document) {
						results.add((Document) obj);
					}
				}

				// Maintenant, la liste results est bien typée
				for (Document user : results) {
					ObjectId iddocObject =new ObjectId(iddoc);
					ObjectId idUser2 =new ObjectId();
					Query query = new Query();
					query.addCriteria(Criteria.where("iddoc").is(iddocObject).and("idUser2").is(user.get("_id")));
					Share share= mongoTemplate.findOne(query, Share.class);
					if (share != null){
						user.append("selected", "true");
					}
					document.put("results", results);
				}
			}
		}
		return document;
}
	public Document getFriends () {

		String id = authService.getUser().getId();
		ObjectId ids = new ObjectId(id);
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user1").is(ids)),

				Aggregation.lookup("Users", "user2", "_id", "friends"),
				Aggregation.replaceRoot().withValueOf(ObjectOperators.valueOf("password").
						mergeWithValuesOf(ArrayOperators.arrayOf("friends").elementAt(0))),
				Aggregation.project().andExclude("password")


		);

		return mongoTemplate.aggregate(aggregation, "FriendList",FriendList.class).getRawResults();

	}
	public Document getAllUsersExceptConnected() {
		String id = authService.getUser().getId();
		ObjectId objectId = new ObjectId(id);

		Query query = new Query();
		query.addCriteria(Criteria.where("_id").ne(objectId));

		List<Document> users = mongoTemplate.find(query, Document.class, "Users");

		Document result = new Document();
		result.put("results", users); // ou "mappedResults", selon ton besoin
		return result;
	}
	
	public void deleteByIdFriend(String idFriend) {
		String id = authService.getUser().getId();
		ObjectId ids = new ObjectId(id);
		ObjectId idfriend = new ObjectId(idFriend);
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user1").is(ids)),
				Aggregation.match(Criteria.where("user2").is(idfriend))	
				);
		
		List<FriendList> s = mongoTemplate.aggregate(aggregation, "FriendList",FriendList.class).getMappedResults();
		friendRepository.deleteById(((FriendList) s.toArray()[0]).getId_freinds());
	}
	
public Document getFriendsByNameOrMail(String words) {
		
		Aggregation aggregation = Aggregation.newAggregation(
				
				Aggregation.project().andExclude("password"),
				Aggregation.match(Criteria.where("name").regex("(.*)" + words + "(.*)", "i").orOperator(Criteria.where("username").regex("(.*)" + words + "(.*)", "i")))
				);		
			
		return mongoTemplate.aggregate(aggregation, "Users",UserDTO.class).getRawResults();

}

}
