package com.Gadour.App.Model;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document 
public class FolderWithFiles extends Folder {
	List<File> files;

	public List<File> getFiles() {
		return files;
	}

	public void setFiles(List<File> files) {
		this.files = files;
	}
}
