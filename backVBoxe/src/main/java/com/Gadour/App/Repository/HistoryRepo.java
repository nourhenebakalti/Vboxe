package com.Gadour.App.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.Gadour.App.Model.*;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Service.AuthService;
@Repository
public class HistoryRepo {
	@Autowired
	MongoTemplate mongoTemplate;
	
	@Autowired
	AuthService authService;
	
	@Autowired
	UserRepository userRepository;
	@Autowired
	ShareRepository shareRepository;
	
	@Autowired
	FriendRepository friendRepository;

	@Autowired
	FileRepositroy fileRepository;
	@Autowired
	FolderRepo folderRepo;
	
	public Document recentHistory() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.sort(Direction.DESC , "historyDate"));
		
		return mongoTemplate.aggregate(aggregation, "History" , History.class).getRawResults();
	}

	public Document userHisory(String id) {

		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(id)),
				Aggregation.sort(Direction.DESC , "historyDate"));
		
		return mongoTemplate.aggregate(aggregation, "History" , History.class).getRawResults();
	}
	
	public Document userHistroyCount (String id) {
		String username = userRepository.findById(id).get().getName();
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("user").is(id)),
				Aggregation.count().as(username + " Activities")
				);
		
		return mongoTemplate.aggregate(aggregation, "History" , History.class).getRawResults();
	}
	
	public Document totalActivity () {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.count().as("Total site activities"));
		
		return mongoTemplate.aggregate(aggregation, "History" , History.class).getRawResults();
	}
	
	
	public Document fileActivityCount (String filename) {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("doc_type").is("File")),
				Aggregation.match(Criteria.where("doc_name").is(filename)),
				Aggregation.count().as("Interactions")
				);
				return mongoTemplate.aggregate(aggregation, "History" , History.class).getRawResults();
		
	}
	

	
	public Document filedownloadCount(String filename) {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("actionType").is("Download")),
				Aggregation.match(Criteria.where("doc_type").is("File")),
				Aggregation.match(Criteria.where("doc_name").is(filename)),
				Aggregation.count().as("downloads")
				);
		return mongoTemplate.aggregate(aggregation, "History" , History.class).getRawResults();
	}
	
	public Document TotalFileShareCount() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("type").is("file")),
				Aggregation.count().as("totalFileShared")
				);
		return mongoTemplate.aggregate(aggregation, "Share" , Share.class).getRawResults();
	}
	
	public Document FileShareCount(String id) {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("iddoc").is(id)),
				Aggregation.count().as("ShareCount")
				);
		return mongoTemplate.aggregate(aggregation, "Share" , Share.class).getRawResults();
	}
	
	public Document pngCounter(String userId) {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("png").exists(true)),
				Aggregation.match(Criteria.where("user").is(userId)),
				Aggregation.count().as("pngCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document gifCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("gif").exists(true)),
				Aggregation.count().as("gifCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
//	public Document pdfCounter(String userId) {
//
//
//		Aggregation aggregation = Aggregation.newAggregation(
//				Aggregation.match(Criteria.where("pdf").exists(true)),
//				Aggregation.project("user")
//						.and(ConvertOperators.ToString.toString("user")).as("userconv"),
//				Aggregation.match(Criteria.where("userconv").is(userId)),
//				Aggregation.count().as("pdfCount")
//				);
//		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
//	}
	
	public Document JPEGCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("jpeg").exists(true)),
				Aggregation.count().as("jpegCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document exeCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("exe").exists(true)),
				Aggregation.count().as("exeCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document xmlCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("xml").exists(true)),
				Aggregation.count().as("xmlCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document rarCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("rar").exists(true)),
				Aggregation.count().as("rarCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document wavCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("wav").exists(true)),
				Aggregation.count().as("wavCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document aviCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("avi").exists(true)),
				Aggregation.count().as("aviCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document wmvCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("wmv").exists(true)),
				Aggregation.count().as("jpegCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document dwgCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("dwg").exists(true)),
				Aggregation.count().as("dwgCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document docxCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("docx").exists(true)),
				Aggregation.count().as("docxCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}
	
	public Document psdCounter() {
		Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("psd").exists(true)),
				Aggregation.count().as("psdCount")
				);
		return mongoTemplate.aggregate(aggregation, "File" , File.class).getRawResults();
	}

	public int nbrFile(){
		return fileRepository.findAll().size();
	}
	public double pdfCounter(ObjectId userId) {
		List<File> files = fileRepository.findAllByUser(userId);
		float nombreFiles = nbrFile();
		float count = 0;
		for (int i = 0; i < files.size(); i++) {
			if (files.get(i).getName().contains("pdf")) {
				count++;
			}
		}
		System.out.println(count);
		return (count / nombreFiles)*100;
	}
        public double htmlCounter(ObjectId userId) {
			List<File> files =fileRepository.findAllByUser(userId);
			float nombreFiles =nbrFile();
			float count = 0;
			for (int i=0;i<files.size();i++){
				if (files.get(i).getName().contains("html")){
					count ++;
				}
			}
			System.out.println(count );
			return  (count / nombreFiles)*100 ;
}

    public double PowerPointCounter(ObjectId userId) {
        List<File> files =fileRepository.findAllByUser(userId);
        float nombreFiles =nbrFile();
        float count = 0;
        for (int i=0;i<files.size();i++){
            if (files.get(i).getName().contains("pptx")){
                count ++;
            }
        }
        System.out.println(count );
        return (count/nombreFiles) * 100 ;
    }
    public double docxCounter(ObjectId userId) {
        List<File> files =fileRepository.findAllByUser(userId);
        float nombreFiles =nbrFile();
        float count = 0;
        for (int i=0;i<files.size();i++){
            if (files.get(i).getName().endsWith("docx")||files.get(i).getName().endsWith("doc")){
                count ++;
            }
        }
        System.out.println(count );
        return  (count/nombreFiles) * 100;

    }

    public double JPEGCounter(ObjectId userId) {
        List<File> files =fileRepository.findAllByUser(userId);
        float nombreFiles =nbrFile();
        float count = 0;
        for (int i=0;i<files.size();i++){
            if ((files.get(i).getName().contains("jpeg"))||(files.get(i).getName().contains("png"))||(files.get(i).getName().contains("jpg"))){
                count ++;
            }
        }
        System.out.println(count );
        return (count/nombreFiles) * 100 ;

    }
    public String pngCounter(ObjectId userId) {
        List<File> files =fileRepository.findAllByUser(userId);
        float nombreFiles =nbrFile();
        float count = 0;
        for (int i=0;i<files.size();i++){
            if (files.get(i).getName().contains("png")){
                count ++;
            }
        }
        System.out.println(count );
        return  "Pourcentage de fichiers de type PNG : " + (count/nombreFiles) * 100+"%" ;

    }

    public String dcmCounter(ObjectId userId) {
        List<File> files =fileRepository.findAllByUser(userId);
        float nombreFiles =nbrFile();
        float count = 0;
        for (int i=0;i<files.size();i++){
            if (files.get(i).getName().contains("dcm")){
                count ++;
            }
        }
        System.out.println(count );
        return  "Pourcentage de fichiers de type DICOM : " + (count/nombreFiles) * 100+"%" ;

    }

    public Document fileUploadCount() {
        Aggregation aggregation = Aggregation.newAggregation(Aggregation.match(Criteria.where("actionType").is("Upload")),
                Aggregation.match(Criteria.where("doc_type").is("File")),

                Aggregation.count().as("uploads")
        );
        return mongoTemplate.aggregate(aggregation, "History" , History.class).getRawResults();
    }
    public int NbFilesByUser(ObjectId userId){
        System.out.println(fileRepository.findAllByUser(userId).size());
        return fileRepository.findAllByUser(userId).size();
    }

    public float nbrFileDepuisMoisDernier(ObjectId userId) {
        Date date =new Date();
        int moisActuel = date.getMonth() + 1;
        int moisDernier = moisActuel - 1;
        List<File> files =fileRepository.findAllByUser(userId);
        float count = 0;
        float nombreFiles =NbFilesByUser(userId);
        for (int i=0;i<files.size();i++){
            int  mois = files.get(i).getUploadtime().getMonth() + 1;
            System.out.println("this is mois file " + mois);
            if (mois == moisActuel || mois ==moisDernier){
                count ++;
            }
        }

        return  (count/nombreFiles) * 100 ;}

    public int NbFoldersByUser(ObjectId userId){
        int count = 0;
        List<Folder> folders = folderRepo.findAll();
        System.out.println(folders);
        for (int i=0;i<folders.size();i++){
            System.out.println(folders.get(i).getClient_id());
            if (folders.get(i).getClient_id().equals(userId))
            {
                count ++;}
        }
        System.out.println("this is count folders" + count );
        return count;
    }
    public float nbrFoldersDepuisMoisDernier(ObjectId userId) {
        Date date =new Date();
        int moisActuel = date.getMonth() + 1;
        int moisDernier = moisActuel - 1;
        float count = 0;
        float nombreFolders =NbFoldersByUser(userId);
        List<Folder> folders = folderRepo.findAll();
        for (int i=0;i<folders.size();i++){
            ObjectId idUser =folders.get(i).getClient_id();
            int  mois = folders.get(i).getCreatedAt().getMonth() + 1;
            if (idUser.equals(userId) && (mois == moisActuel || mois ==moisDernier))
            {
                count ++;
            }
        }

        return  (count/nombreFolders) * 100 ;}


    public ArrayList<Share> sahredFiles(ObjectId userId){
        ArrayList<Share> sharesList = new ArrayList ();

        List<Share> shares = shareRepository.findAll();
        System.out.println(shares);
        for (int i=0;i<shares.size();i++){

            if (shares.get(i).getIdUser1().equals(userId))
            {
                System.out.println("rania");
                System.out.println(shares.get(i));
                sharesList.add(shares.get(i));
            }
        }
        System.out.println(sharesList);
        return sharesList;

    }}
