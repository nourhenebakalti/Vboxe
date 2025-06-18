package com.Gadour.App.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.FriendList;

@Repository
public interface FriendRepository extends MongoRepository<FriendList, String> {
	public List<FriendList> findAllByUser1 (String User1);
	
	public List<FriendList> findAllByUser2 (String User2);
	
}
