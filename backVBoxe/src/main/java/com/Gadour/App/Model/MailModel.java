package com.Gadour.App.Model;

import java.io.Serializable;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mongodb.lang.NonNull;

@Document(collection = "Mail")
public class MailModel implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	@Id
	@JsonIgnore
	private String id_mail;
	@NonNull
	private String sender;
	@NonNull
	private String reciever;
	
	@NonNull
	private String subject;
	
	private String content;
	
	private Date mail_date;
	
	private Boolean edited = false;
	
	private MultipartFile attachment;
	
	private MultipartFile signature;

	public String getId_mail() {
		return id_mail;
	}

	public void setId_mail(String id_mail) {
		this.id_mail = id_mail;
	}

	public String getSender() {
		return sender;
	}

	public void setSender(String sender) {
		this.sender = sender;
	}

	public String getReciever() {
		return reciever;
	}

	public void setReciever(String reciever) {
		this.reciever = reciever;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subbject) {
		this.subject = subbject;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getMail_date() {
		return mail_date;
	}

	public void setMail_date(Date mail_date) {
		this.mail_date = mail_date;
	}

	public Boolean getEdited() {
		return edited;
	}

	public void setEdited(Boolean edited) {
		this.edited = edited;
	}

	public MultipartFile getSignature() {
		return signature;
	}

	public void setSignature(MultipartFile signature) {
		this.signature = signature;
	}

	public MultipartFile getAttachment() {
		return attachment;
	}

	public void setAttachment(MultipartFile attachment) {
		this.attachment = attachment;
	}

	



}
