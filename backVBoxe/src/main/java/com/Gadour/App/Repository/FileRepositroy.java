package com.Gadour.App.Repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.File;

@Repository
public interface FileRepositroy extends MongoRepository<File, String> {
	
	
	List<File> findAllByUser(ObjectId id);
	
	 void deleteByidFolder(String idFolder);
	 List<File> findAllByIdFolder(String idFolder);
		
}
