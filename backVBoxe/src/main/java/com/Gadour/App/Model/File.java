package com.Gadour.App.Model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mongodb.lang.NonNull;

@Document(collection = "File")
@Data
public class File implements Serializable {
	@Id
	@NonNull
	private String id ;
	private ObjectId user;

	@NonNull
	private String name ;
	
	@NonNull
	private Long size ;
	
	private Date uploadtime ; 
	
	@JsonIgnore
	private byte[] content ;
	
	private String idFolder;
	
	@JsonIgnore
	private String password;
	
	private Boolean favorite = false;
	private Boolean inSafety = false;
	private Boolean inShare = false;

	private Boolean protect = false;
	
	private String category;

	private Boolean access_write = false;

	private List<DAOUser> accessed_write = new ArrayList<>() ;

	private List<String> temporal_writer = new ArrayList<>() ;

	private Date write_timer;

	private Boolean accessed_read = false ;
	
	List<DAOUser> Readers = new ArrayList<>();

	private Boolean deleted = false;
	
	@Indexed(expireAfter = "3d")
	private Date deletedTime;

	@JsonIgnore
	private String code;


	public File(String name, Long size, Date uploadtime, byte[] content) {
		this.name = name;
		this.size = size;
		this.uploadtime = uploadtime;
		this.content = content;
	}

    public void setFileName(String fileName) {
    }
	public Boolean getInSafety() {
		return inSafety != null ? inSafety : false;
	}
	public Boolean getInShare() {
		return inShare != null ? inShare : false;
	}
}
