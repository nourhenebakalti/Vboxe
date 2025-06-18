package com.Gadour.App.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.Gadour.App.Model.ShareDetails;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.File;
import com.Gadour.App.Model.Folder;
import com.Gadour.App.Model.Share;
import com.Gadour.App.Service.AuthService;
import com.Gadour.App.Utils.CustomProjectAggregationOperation;

@Repository
public class ShareRepo {
	@Autowired
	AuthService authService;
	@Autowired
	FileRepositroy fileRepositroy;
	@Autowired
	FolderRepo folderRepo;
	@Autowired
	MongoTemplate mongoTemplate;
	@Autowired
	ShareRepository shareRepository;
	public Document shareContent () {
		
		String id = authService.getUser().getId();
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("idUser2").is(id)),
				Aggregation.match(Criteria.where("type").is("folder")),
				Aggregation.lookup("Folder", "iddoc", "_id", "folder"), 
				Aggregation.replaceRoot().withValueOf(ObjectOperators.valueOf("idcc").
						mergeWithValuesOf(ArrayOperators.arrayOf("folder").elementAt(0)))
				
				);
			return mongoTemplate.aggregate(aggregation, "Share",Share.class).getRawResults();
		/*Aggregation aggregationFiles = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(id)),
				
				Aggregation.project().andExclude("content")
				);
		Object folderResult = mongoTemplate.aggregate(aggregation, "Folder" , Folder.class).getRawResults().get("results");
		Object filesResult = mongoTemplate.aggregate(aggregationFiles, "File", File.class).getRawResults().get("results");
		
		Object currentFolder = folderRepo.findById(id_folder);*/
		
	}
	
		public Document shareFiles () {
		String id = authService.getUser().getId();
		
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("idUser2").is(id)),
				Aggregation.match(Criteria.where("type").is("file")),
				Aggregation.lookup("File", "iddoc", "_id", "Files"), 
				Aggregation.replaceRoot().withValueOf(ObjectOperators.valueOf("idcc").
						mergeWithValuesOf(ArrayOperators.arrayOf("folder").elementAt(0)))
				
				);
			return mongoTemplate.aggregate(aggregation, "Share",Share.class).getRawResults();
			
	}
		
		public Document allShare (boolean inSafety) {
			
			String id = authService.getUser().getId();
			String queryFolder =
		            "{ $lookup: {"
		            + "  from: 'Folder',"
		            + "  localField: 'iddoc',"
		            + "  foreignField: '_id',"
		            + "  as: 'folder',"
		            + "  pipeline: ["
					+ "  { $match: { inSafety: " + inSafety + " } },"
					+ "  {$lookup: {"
		            + "    from: 'Users',"
		            + "    localField: 'client_id',"
		            + "    foreignField: '_id',"
		            + "	   pipeline: [{$project: {'_id': 0, 'password': 0, '_class':0}}],"
		            + "    as:'userInfo'"
		            + "  }}]"
		            + "}}";

			String queryFiles =
		            "{ $lookup: {"
		            + "  from: 'File',"
		            + "  localField: 'iddoc',"
		            + "  foreignField: '_id',"
		            + "  as: 'files',"
		            + "  pipeline: ["
					+ "  {$project: {'content': 0}},"
					+  " { $match: { inSafety: " + inSafety + " } },"
					+ "  {$lookup: {"
		            + "    from: 'Users',"
		            + "    localField: 'user',"
		            + "    foreignField: '_id',"
		            + "	   pipeline: [{$project: {'_id': 0, 'password': 0, '_class':0}}],"
		            + "    as:'userInfo'"
		            + "  }}]"
		            + "}}";
			
			Aggregation aggregationFolder = Aggregation.newAggregation(Aggregation.match(Criteria.where("idUser2").is(new ObjectId(id))),
					Aggregation.match(Criteria.where("type").is("folder")),
					new CustomProjectAggregationOperation(queryFolder),
					Aggregation.replaceRoot().withValueOf(ObjectOperators.valueOf("idcc").
							mergeWithValuesOf(ArrayOperators.arrayOf("folder").elementAt(0))) 
					
					);

			Aggregation aggregationFile = Aggregation.newAggregation(
					Aggregation.match(Criteria.where("idUser2").is(new ObjectId(id))),
					Aggregation.match(Criteria.where("type").is("file")),
					new CustomProjectAggregationOperation(queryFiles),
					Aggregation.replaceRoot().withValueOf(ObjectOperators.valueOf("idcc").
							mergeWithValuesOf(ArrayOperators.arrayOf("files").elementAt(0)))


			);
			Object folderResult = mongoTemplate.aggregate(aggregationFolder, "Share" , Share.class).getRawResults().get("results");
			Object filesResult = mongoTemplate.aggregate(aggregationFile, "Share", Share.class).getRawResults().get("results");

			// Convertir en List<Document> pour manipulation
			List<Document> folderList = (folderResult instanceof List) ? (List<Document>) folderResult : new ArrayList<>();
			List<Document> fileList = (filesResult instanceof List) ? (List<Document>) filesResult : new ArrayList<>();

			Query query = new Query();
			query.addCriteria(Criteria.where("inShare").is(true).and("inSafety").is(inSafety)
					.and("user").is(new ObjectId(id)));

			// Récupérer les documents depuis MongoDB sous forme de List<Document>
			List<Document> sharedFiles = mongoTemplate.find(query, Document.class, "File");
			// Ajouter les documents récupérés à la liste existante
			fileList.addAll(sharedFiles);
			// pour les folders
			Query query1 = new Query();
			query1.addCriteria(Criteria.where("inShare").is(true).and("inSafety").is(inSafety)
					.and("client_id").is(new ObjectId(id)));

			// Récupérer les documents depuis MongoDB sous forme de List<Document>
			List<Document> sharedFolders = mongoTemplate.find(query1, Document.class, "Folder");
			folderList.addAll(sharedFolders);


			// Filtrer les documents vides
			folderList = folderList.stream()
					.filter(doc -> !doc.isEmpty() && doc.values().stream().anyMatch(value -> value != null && !value.toString().trim().isEmpty()))
					.collect(Collectors.toList());

			fileList = fileList.stream()
					.filter(doc -> !doc.isEmpty() && doc.values().stream().anyMatch(value -> value != null && !value.toString().trim().isEmpty()))
					.collect(Collectors.toList());
			Map<String, Object> res = new HashMap<String, Object>();
			res.put("files", fileList);
			res.put("folders", folderList);
			res.put("currentFolder", null);
			Document document = new Document();
			document.append("results", res);
			//System.out.println("rrrrrrrrrrr "+document);
			return document;
		}
		
		Document FileShareCount() {
			Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("type").is("file")),
					Aggregation.count().as("totalFileShared")
					);
			return mongoTemplate.aggregate(aggregation, "Share" , Share.class).getRawResults();
		}

	public List<ShareDetails>  all () {
		String id = authService.getUser().getId();
		LookupOperation lookupFile = LookupOperation.newLookup()
				.from("File")
				.localField("iddoc")
				.foreignField("_id")
				.as("file");

		LookupOperation lookupUser = LookupOperation.newLookup()
				.from("Users")
				.localField("idUser2")
				.foreignField("_id")
				.as("user");
		UnwindOperation unwindAddress = Aggregation.unwind("file");
		UnwindOperation unwindCompany = Aggregation.unwind("user");
		Aggregation aggregation = Aggregation.newAggregation(
				Aggregation.match(Criteria.where("idUser1").is(new ObjectId(id))),
				lookupFile,
				lookupUser,
				unwindAddress,
				unwindCompany,
				Aggregation.project("id","iddoc", "createdAt", "user.name","user.username").and("file.name").as("fileName")
		);
		List<ShareDetails> filesResult = mongoTemplate.aggregate(aggregation, "Share",ShareDetails.class).getMappedResults();
		System.out.println(filesResult.toString());

		return filesResult;
	}
	public Boolean deleteShare (String iddoc) {
		String id = authService.getUser().getId();
		ObjectId iddocObject =new ObjectId(iddoc);
		ObjectId idUser2 =new ObjectId(id);
		Query query = new Query();
		query.addCriteria(Criteria.where("iddoc").is(iddocObject).and("idUser2").is(idUser2));
		Share share= mongoTemplate.findOne(query, Share.class);
		if (share != null && share.getType()!= null ){
			if (share.getType().equals("file")){
				File file =  fileRepositroy.findById(iddoc).orElse(null);
				if (file != null){
					file.setUser(new ObjectId(id));
					file.setId(null);
					file.setInShare(true);
					fileRepositroy.save(file);
				}
			}
			if (share.getType().equals("folder")){
				Folder folder= folderRepo.findById(iddoc).orElse(null);
				if (folder != null){
					folder.setClient_id(new ObjectId(id));
					folder.setFolderId(null);
					folder.setInShare(true);
					folderRepo.save(folder);
				}
			}
			shareRepository.deleteById(share.getShare_id());
			return true;
		}
		return false;
	}

}
