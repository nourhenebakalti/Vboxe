package com.Gadour.App.Repository;


import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.File;
import com.Gadour.App.Model.FileBin;
import com.Gadour.App.Service.AuthService;

@Repository
public class FileRepo {
	@Autowired
	MongoTemplate mongoTemplate;
	@Autowired
	AuthService authService;
	
	@Autowired
	FolderRepo folderRepo;
	
	@Autowired
	FileRepositroy fileRepositroy;
	
	@Autowired
	private PasswordEncoder bcryptEncoder;

	public   Document files(){
		String id = authService.getUser().getId();
		
			Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(id)),
				    Aggregation.group().sum("size").as("totalsize"),
				    Aggregation.project("totalsize"));
			
			return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}

	public ResponseEntity<?> setFileProtect(String idFile, String password) {
		File f = fileRepositroy.findById(idFile).get();
		f.setPassword(bcryptEncoder.encode(password));
		f.setProtect(true);
		
		fileRepositroy.save(f);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	public ResponseEntity<?> setFileInprotect(File f, String password) {
		f.setPassword(null);
		f.setProtect(false);
		
		fileRepositroy.save(f);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	public Document favFiles() {
		String id = authService.getUser().getId();
		
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(id)),
				Aggregation.match(Criteria.where("favorite").is(true)),Aggregation.project().andExclude("content"));
		
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}

	/*public List<File> recentFile() {
		
		 List<File> result = fileRepositroy.findAll(Sort.by(Sort.Direction.DESC, "uploadtime"));
		 
		 return result;
	}*/
	
	
	public Document recentFile() {
		String id = authService.getUser().getId();
		
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(id)),
				Aggregation.sort(Direction.DESC, "uploadtime"),Aggregation.project().andExclude("content"));
		
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	
	public Document filesBin() {
		String id = authService.getUser().getId();
		
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(id)),
				Aggregation.match(Criteria.where("deleted").is(true)),Aggregation.project().andExclude("content"));
				
		
		
		
		return mongoTemplate.aggregate(aggregation, "File" , FileBin.class).getRawResults();
	}
	
	public Document count_me() {
		String id = authService.getUser().getId();
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(id)),
				Aggregation.count().as("files")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
		
	}
	
	public Document findByCategoryDesc(String category) {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("category").is(category)),
				Aggregation.sort(Direction.DESC , "uploadtime")
				);
		
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	//public Document filenumbers

	public int getStorageSize(){
		Document stats = mongoTemplate.executeCommand(new Document("collStats", "File"));
		 return (int)stats.get("storageSize");
	}

	public Boolean renameFile(String id, String name){
		File file = fileRepositroy.findById(id).orElse(null);
		if (file != null && name!= null && !name.isEmpty()){
			file.setName(name);
			fileRepositroy.save(file);
			return true;
		}
		return false;
	}
	
}
