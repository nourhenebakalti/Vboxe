package com.Gadour.App.Repository;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.File;
import com.Gadour.App.Model.Folder;
import com.Gadour.App.Model.FolderWithFiles;
import com.Gadour.App.Service.AuthService;
import com.Gadour.App.Utils.CustomProjectAggregationOperation;

@Repository
public class FolderRepository {
	@Autowired
	MongoTemplate mongoTemplate;
	@Autowired
	AuthService authService;
	
	@Autowired
	FolderRepo folderRepo;
	
	@Autowired
	private PasswordEncoder bcryptEncoder;
	
	@Autowired
	FileRepositroy fileRepositroy;
	
	Folder folder;
	
	File file;
	
	public List<Folder> getFolders(){
		//mongoTemplate.remove(Criteria.where("id").is(folder.getFolderId()));
		return mongoTemplate.findAll(Folder.class, "Folder");
	}
	public Document getFilesfromfolder(){
		String id = authService.getUser().getId();
		
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("client_id").is(id)),Aggregation.lookup("Folder", "folderParentId", "_id", "Folders"),Aggregation.lookup("File", "_id", "id_Folder", "Files"));
		return mongoTemplate.aggregate(aggregation, "Folder" , FolderWithFiles.class).getRawResults();
	}
	
	
	public Document getContentForder(String id_folder,boolean inSafety) {
		String id =authService.getUser().getId();
		var aggregationMatch = !id_folder.isEmpty() ? Aggregation.match(Criteria.where("folderParentId").is(id_folder)) : Aggregation.match(Criteria.where("folderParentId").isNull());
		var aggregationFileMatch = !id_folder.isEmpty() ? Aggregation.match(Criteria.where("idFolder").is(id_folder)) : Aggregation.match(Criteria.where("idFolder").isNull());
		String query =
	            "{ $lookup: {"
	            + "  from: 'Share',"
	            + "  localField: '_id',"
	            + "  foreignField: 'iddoc',"
	            + "  as: 'share',"
	            + "  pipeline: [{$lookup: {"
	            + "    from: 'Users',"
	            + "    localField: 'idUser2',"
	            + "    foreignField: '_id',"
	            + "	   pipeline: [{$project: {'_id': 0, 'password': 0, '_class':0}}],"
	            + "    as:'user'"
	            + "  }}]"
	            + "}}";
		
		
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("client_id").is(new ObjectId(id))),
				aggregationMatch,
				Aggregation.match(Criteria.where("inSafety").is(inSafety)),
				Aggregation.match(new Criteria().orOperator(
						Criteria.where("inShare").is(false),
						Criteria.where("inShare").is(null)
				)),
				new CustomProjectAggregationOperation(query)
				);

		Aggregation aggregationFiles = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(new ObjectId(id))),
				aggregationFileMatch,
				Aggregation.match(Criteria.where("inSafety").is(inSafety)),
				Aggregation.match(new Criteria().orOperator(
						Criteria.where("inShare").is(false),
						Criteria.where("inShare").is(null)
				)),
				new CustomProjectAggregationOperation(query),
				Aggregation.project().andExclude("content")
				);
		Object folderResult = mongoTemplate.aggregate(aggregation, "Folder" , Folder.class).getRawResults().get("results");
		Object filesResult = mongoTemplate.aggregate(aggregationFiles, "File", File.class).getRawResults().get("results");
		
		Object currentFolder = folderRepo.findById(id_folder);
		
		
		
		Map<String, Object> res = new HashMap<String, Object>();
		res.put("files", filesResult);
		res.put("folders", folderResult);
		res.put("currentFolder", currentFolder);
		
		Document document = new Document();
		document.append("results", res);
		return document;
	}
	
	public ResponseEntity<?> setFileProtect(String idFile, String password) {
		Folder f = folderRepo.findById(idFile).get();
		f.setPassword(bcryptEncoder.encode(password));
		f.setProtect(true);
		
		folderRepo.save(f);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	public ResponseEntity<?> setFileInprotect(Folder f, String password) {
		f.setPassword(null);
		f.setProtect(false);
		
		folderRepo.save(f);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	public byte[] zipFolder(String folderId) throws IOException{
		Folder folder = folderRepo.findById(folderId).get();
		List<File> files = fileRepositroy.findAllByIdFolder(folderId);
		FileOutputStream fos = new FileOutputStream(folder.getFolderName());
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
	    ZipOutputStream zos = new ZipOutputStream(baos);
	    for (File file : files) {
	    	ZipEntry entry = new ZipEntry(file.getName());
	    	entry.setSize(file.getContent().length);
	    	zos.putNextEntry(entry);
	    	zos.write(file.getContent());
	    	zos.closeEntry();
			
		}
	    zos.close();
	    return baos.toByteArray();
	}

	public Boolean renameFolder(String id,String name){
		Folder folder = folderRepo.findById(id).orElse(null);
		if (folder != null && name!= null && !name.isEmpty()){
			folder.setFolderName(name);
			folderRepo.save(folder);
			return true;
		}
		return false;
	}

}
