package com.Gadour.App.Model;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;
import org.bson.types.ObjectId;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Share")
@Data
public class Share implements Serializable {
	@Id
	String share_id;

	ObjectId iddoc;

	ObjectId idUser1;
	ObjectId idUser2;
	String type = "";
	@CreatedDate
	private Date createdAt ;

}


