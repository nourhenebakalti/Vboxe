package com.Gadour.App.Model;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "FriendList")
public class FriendList {
	@Id
	String id_freinds;
	ObjectId user1;
	ObjectId user2;

	
	public String getId_freinds() {
		return id_freinds;
	}
	public void setId_freinds(String id_freinds) {
		this.id_freinds = id_freinds;
	}
	public ObjectId getUser1() {
		return user1;
	}
	public void setUser1(String currentUser) {
		this.user1 = new ObjectId(currentUser);
	}
	public ObjectId getUser2() {
		return user2;
	}
	public void setUser2(String friends) {
		this.user2 = new ObjectId(friends);
	}

}
