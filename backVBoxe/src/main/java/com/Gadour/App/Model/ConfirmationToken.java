package com.Gadour.App.Model;

import java.util.Date;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;



@Document(collection = "ConfirmationToken")
public class ConfirmationToken {
	
	@Id
	private String tokenId;
	
	
	private String confirmationToken;
	
	 private Date createdDate;
	 
	 
	 private DAOUser user;

	    public ConfirmationToken() {}

	    public ConfirmationToken(DAOUser user) {
	        this.user = user;
	        createdDate = new Date();
	        confirmationToken = UUID.randomUUID().toString();
	    }

	public String getTokenId() {
		return tokenId;
	}

	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}

	public String getConfirmationToken() {
		return confirmationToken;
	}

	public void setConfirmationToken(String confirmationToken) {
		this.confirmationToken = confirmationToken;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	
	
	 public DAOUser getUserEntity() {
	        return user;
	    }

	    public void setUserEntity(DAOUser user) {
	        this.user = user;
	    }
}
