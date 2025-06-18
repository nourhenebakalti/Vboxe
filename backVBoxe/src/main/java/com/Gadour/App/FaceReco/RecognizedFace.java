package com.Gadour.App.FaceReco;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;


@Document
public class RecognizedFace implements Serializable {
	
	@Id
	private String face_id;
	
	private MultipartFile face;
	
	private String user;

	public String getFace_id() {
		return face_id;
	}

	public void setFace_id(String face_id) {
		this.face_id = face_id;
	}

	public MultipartFile getFace() {
		return face;
	}

	public void setFace(MultipartFile face) {
		this.face = face;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}
}
