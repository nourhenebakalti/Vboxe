package com.Gadour.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.bson.types.ObjectId;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;

@Document (collection = "Folder")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Folder {
	@Id
	private String folderId;
	private String folderName;
	private String folderParentId;

	private ObjectId client_id;
	private Boolean inSafety = false;
	private Boolean inShare = false;
	@JsonIgnore
	private String code;

	@JsonIgnore
	private String password;
	private Boolean protect = false;
	@CreatedDate
	private Date CreatedAt ;
	public Boolean getInSafety() {
		return inSafety != null ? inSafety : false;
	}

	public Boolean getInShare() {
		return inShare != null ? inShare : false;
	}

}
