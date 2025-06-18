package com.Gadour.App.Model;

import java.io.Serializable;
import java.util.List;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Events")
public class Event implements Serializable {
	private static final long serialVersionUID = 1L;
	@Id
	private String id;
	private String title;
	private String user;
	private String initiatorName;
	private List<String> attendents;
	private List<DetailsInfo> confirmedGuestsList;
	private List<DetailsInfo> unconfirmedGuestsList;
	private String description;
	private String start;
	private String end;
	private Boolean allDay; // c-à-d toute la journée ou nn

}
