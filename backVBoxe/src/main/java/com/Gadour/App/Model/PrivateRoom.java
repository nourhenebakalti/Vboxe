package com.Gadour.App.Model;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "PrivateRooms")
public class PrivateRoom   {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4524480608823209508L;
	
	@Id
	private String roomId;
	
	private List<String> userid;
	private Date roomCreation;
	private Boolean status = false ;
	
	public String getRoomId() {
		return roomId;
	}
	public void setRoomId(String roomId) {
		this.roomId = roomId;
	}
	public List<String> getUserid() {
		return userid;
	}
	public void setUserid(List<String> ids) {
		this.userid = ids;
	}
	public Date getRoomCreation() {
		return roomCreation;
	}
	public void setRoomCreation(Date roomCreation) {
		this.roomCreation = roomCreation;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(Boolean status) {
		this.status = status;
	}
}
