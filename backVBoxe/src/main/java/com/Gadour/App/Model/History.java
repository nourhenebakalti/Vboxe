package com.Gadour.App.Model;

import java.io.Serializable;
import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "History")
public class History implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	
	private String id_history ;

	private String user;

	private String actionType;
	
	private String doc_type;
	
	private String file_type;
	
	private String doc_name;

	private String docParent;
	
	@Indexed(expireAfter = "30d")
	private Date historyDate;

	public String getId_history() {
		return id_history;
	}

	public void setId_history(String id_history) {
		this.id_history = id_history;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getActionType() {
		return actionType;
	}

	public void setActionType(String actionType) {
		this.actionType = actionType;
	}

	public String getDoc_type() {
		return doc_type;
	}

	public void setDoc_type(String doc_type) {
		this.doc_type = doc_type;
	}



	public String getDocParent() {
		return docParent;
	}

	public void setDocParent(String id_Folder) {
		this.docParent = id_Folder;
	}

	public Date getHistoryDate() {
		return historyDate;
	}

	public void setHistoryDate(Date historyDate) {
		this.historyDate = historyDate;
	}

	public String getDoc_name() {
		return doc_name;
	}

	public void setDoc_name(String doc_name) {
		this.doc_name = doc_name;
	}

	public String getFile_type() {
		return file_type;
	}

	public void setFile_type(String file_type) {
		this.file_type = file_type;
	}

}	
