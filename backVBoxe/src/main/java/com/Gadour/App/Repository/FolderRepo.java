package com.Gadour.App.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.Folder;

@Repository
public interface FolderRepo extends MongoRepository<Folder, String> {
	
	public List<Folder> findAllByFolderParentId(String folderParentId);



	
	
	/*@Aggregation(pipeline = {"{$lookup: {\n" +
	        "         from: \"File\",\n"
	        + "  localField: \"_id\",\n"
	        + "  foreignField:\"id_Folder\",\n"
	        + "  as: \"Files\"" +
	        "     }}"})
	    AggregationResults<?> Getfilesfromfolder();*/
	
	
}
