package com.Gadour.App.Model;

import java.util.Date;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document (collection = "Sessions")
public class Session {
	@Id
	private String id_session ;

	private String id_client ;
	
	private String accessToken ;
	private String resfreshToken ;
	private Date Session_date ;
	

	public String getId_session() {
		return id_session;
	}

	public void setId_session(String id_session) {
		this.id_session = id_session;
	}

	public String getId_client() {
		return id_client;
	}

	public void setId_client(String id_client) {
		this.id_client = id_client;
	}

	

	

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public String getResfreshToken() {
		return resfreshToken;
	}

	public void setResfreshToken(String resfreshToken) {
		this.resfreshToken = resfreshToken;
	}

	public Date getSession_date() {
		return Session_date;
	}

	public void setSession_date(Date session_date) {
		Session_date = session_date;
	}
	
	
}
