package com.Gadour.App.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Timer;
import java.util.TimerTask;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.File;
import com.Gadour.App.Repository.FileRepositroy;
import com.Gadour.App.Repository.UserRepository;

@Service
public class FileService {
	File file;
	@Autowired
	FileRepositroy fileRepositroy;
	
	@Autowired
	UserRepository userRepository;
	
	public File saveFile(MultipartFile file , String Client_id , String id_Folder , String category, boolean inSafety) throws IOException {
		String Filename = file.getOriginalFilename();
			File file2 = new File(Filename,file.getSize(),new Date(),file.getBytes());
			file2.setUser(new ObjectId(Client_id));
			file2.setCategory(category);
			file2.setInSafety(inSafety);
			if(!id_Folder.isEmpty()) file2.setIdFolder(id_Folder);
			return fileRepositroy.save(file2);
		
	}
	
	
	//----------------------------------Readers Section------------------------------
	
	public String addreaders(Boolean access , String id ,String user_id){
		File selectedFile = fileRepositroy.findById(id).get();
		
		selectedFile.setAccessed_read(access);
		List<DAOUser> readers = selectedFile.getReaders();
		if (selectedFile.getAccessed_read()==true) {
			
					
				DAOUser accessedUser = userRepository.findById(user_id).get();	
				
				readers.add(accessedUser);
				
				fileRepositroy.save(selectedFile);
		}
		
		
		return "Add reader Successfully";
		
		
	}
	
	public void deleteReaders(String id , String user_id) {
		File selectedFile = fileRepositroy.findById(id).get();
		
		List<DAOUser> readers = selectedFile.getReaders();
		
		DAOUser accessedUser = userRepository.findById(user_id).get();	
		if (selectedFile.getAccessed_read() == true) {
			for (DAOUser reader : readers) {
				if (reader == accessedUser) {
					readers.remove(reader);
				}
				fileRepositroy.save(selectedFile);
			}
		}
		
	}
	
	public void deleteAllReaders(String id) {
		File selectedFile = fileRepositroy.findById(id).get();
		
		List<DAOUser> readers = selectedFile.getReaders();
		
		readers.removeAll(readers);

	}
	
	//----------------------------------Writers Section------------------------------
	
	public String addWriter(Boolean access , String id ,String user_id ) {
		File selectedFile = fileRepositroy.findById(id).get();
		
		selectedFile.setAccessed_read(access);
		List<DAOUser> writers = selectedFile.getAccessed_write();
		if (selectedFile.getAccess_write() == true) {
			DAOUser accessedUser = userRepository.findById(user_id).get();	
			
			writers.add(accessedUser);
			
			fileRepositroy.save(selectedFile);
		}
		
		return "Writer added Successfully !";
		
	}
	
	public String addTemporaryWriter(Boolean access , String id ,String user_id , int timer_seconds) {
		Timer timer = new Timer();
		
		
		
		File selectedFile = fileRepositroy.findById(id).get();
		
		
		selectedFile.setAccess_write(access);
		
		//fileRepositroy.save(selectedFile);
		
		
		List<String> temp_writers = selectedFile.getTemporal_writer();
		
		String accessedUser = userRepository.findById(user_id).get().getName();
		if ( (selectedFile.getAccess_write() == true)) {
			
			
			
			temp_writers.add(accessedUser);
			
			fileRepositroy.save(selectedFile);
			
		}
		
		
		
		TimerTask task = new TimerTask() {
			int counter = timer_seconds;
			@Override
			public void run() {
				
				if(counter>0) {
					
				
				System.out.println(counter+" seconds");
				System.out.println(timer.equals(0));
				counter--;
				}
				if (counter < 0) {
					timer.cancel();
					
					
				}
				
			
				
		};
		
	
		
			
		
	};
	timer.scheduleAtFixedRate(task, 0, 1000);
	if (timer.equals(1) == true) {
		temp_writers.remove(accessedUser);
		
		
		fileRepositroy.save(selectedFile);
	}
		
	
	return "Added temporary writer for: "+timer_seconds+ " Seconds !";
		
	}
	
	

	public void deleteWriters(String id , String user_id) {
		File selectedFile = fileRepositroy.findById(id).get();
		
		List<DAOUser> writers = selectedFile.getAccessed_write();
		
		DAOUser  accessedUser = userRepository.findById(user_id).get();	
		if (selectedFile.getAccessed_read() == true) {
			for (DAOUser writer : writers) {
				if (writer == accessedUser) {
					writers.remove(writer);
				}
				fileRepositroy.save(selectedFile);
			}
		}
		
	}
	public void deleteAllWriters(String id) {
		File selectedFile = fileRepositroy.findById(id).get();
		
		List<DAOUser> writers = selectedFile.getAccessed_write();
		
		writers.removeAll(writers);
	}
	
}
