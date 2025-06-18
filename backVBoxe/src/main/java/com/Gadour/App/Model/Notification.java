package com.Gadour.App.Model;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Data
@Document(collection = "Notification")
public class Notification implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@Id
	private String idNotification ;
	@Indexed
	private String user;
	private String idUserEventCreater;
	private String notif_title;
	private String idEvent;
	private String type;
	private Details details;


	private String notif_msg;
	
	@Indexed(expireAfter = "15d")
	private Date notifDate;

	
}