package com.Gadour.App.Controller;

import java.util.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import com.Gadour.App.Async.AsyncTreatment;
import com.Gadour.App.Model.*;
import com.Gadour.App.Repository.FileRepositroy;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Repository.FolderRepo;
import com.Gadour.App.Repository.FolderRepository;
import com.Gadour.App.Repository.HistoryRepositoy;
import com.Gadour.App.Service.AuthService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/folder")
public class FolderController {
	
	@Autowired
	FolderRepo folderRepo;
	@Autowired
	AuthService authService;
	@Autowired
	FolderRepository folderRepository;

	@Autowired
	FileRepositroy fileRepositroy;
	
	@Autowired
	HistoryRepositoy historyRepositoy;
	
	@Autowired
	private PasswordEncoder bcryptEncoder;

	@Autowired
	private AsyncTreatment asyncTreatment;

	@PostMapping("/add")
	public ResponseEntity<Folder>  addFolder (@RequestParam("folderName") String folderName , @RequestParam("idparent") String idparent
			, @RequestParam("inSafety") boolean inSafety) {
		Folder folder = new Folder();
		folder.setFolderName(folderName);
		folder.setInSafety(inSafety);
		folder.setClient_id(new ObjectId(authService.getUser().getId()));
		if(!idparent.isEmpty()) folder.setFolderParentId(idparent);
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Upload");
		history.setDoc_name(folderName);
		history.setDoc_type("Folder");
		history.setDocParent(idparent);
		
		historyRepositoy.save(history);
		
		return new ResponseEntity<Folder>(folderRepo.save(folder) , HttpStatus.CREATED);
	}

	@PutMapping("/update/idParent")
	public ResponseEntity<Boolean> updateFolderIdParent (@RequestParam("id") String id , @RequestParam("idparent") String idparent) {
		Optional<Folder> selectedFolder = folderRepo.findById(id);
		if (selectedFolder.isPresent()) {
			Folder folder = selectedFolder.get();
			folder.setFolderParentId(idparent);
			folderRepo.save(folder);
			return new ResponseEntity<Boolean>(true, HttpStatus.OK);
		} else
			return new ResponseEntity<Boolean>(HttpStatus.BAD_REQUEST);
	}

	@GetMapping("/all")
	public List<Folder> findFolders(){
		List<Folder> list = folderRepository.getFolders();

		return list;
	}
	@GetMapping("/all2")
	public Document findFilesFolder(){
		return folderRepository.getFilesfromfolder();
	}
	@GetMapping("/allContent/{folderId}")
	public ResponseEntity<?> getContentForder(@PathVariable("folderId") String folderId, @Param("password") String password, @Param("isCurrent") String isCurrent,
											  @RequestParam(required = false) boolean inSafety){
		if(!isCurrent.contains("current")) {
			Folder f = folderRepo.findById(folderId).get();
			if(f.getProtect()) {
				if( password == null || !bcryptEncoder.matches(password, f.getPassword())) {
					return new ResponseEntity<>("Invalid password", HttpStatus.FORBIDDEN);
				}
			}			
		}
		return new ResponseEntity<>(folderRepository.getContentForder(folderId,inSafety), HttpStatus.OK);
	}
	
	@GetMapping("/allContent")
	public Object getContentForderNull(@RequestParam(required = false) boolean inSafety){
		
		return folderRepository.getContentForder("",inSafety);
	}
	
	@DeleteMapping("/delete/{folderId}")
	public ResponseEntity<?>  deleteFolder(@PathVariable("folderId") String folderId) {
		String folderName = folderRepo.findById(folderId).get().getFolderName();
		folderRepo.deleteById(folderId);

		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Delete");
		history.setDoc_name(folderName);
		history.setDoc_type("Folder");
		
		
		historyRepositoy.save(history);
		Map<String, String> response = new HashMap<>();
		response.put("message", "File Deleted Successfully !");
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	@GetMapping("/find/{folderId}")
	public Folder findFolder(@PathVariable String folderId) {
		if (folderRepo.findById(folderId).isPresent()){
			return folderRepo.findById(folderId).get();
		}
		return null;
	}
	
	@GetMapping("/findByTimestamp/{id}")
	public Optional<Folder> findFolderByTimeStamp(@PathVariable("folderId") String folderId) {
		return folderRepo.findById(folderId);
	}
	
	@GetMapping("/subfolders/{folderParentId}")
	public List<Folder> findSubFolders (@PathVariable("folderParentId") String folderParentId){
		return folderRepo.findAllByFolderParentId(folderParentId);
	}
	
	@PutMapping("/protect")
	public ResponseEntity<?> setFileProtect(@RequestParam("id") String id, @RequestParam("password") String password) {
		String folderName = folderRepo.findById(id).get().getFolderName();
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Protect");
		history.setDoc_name(folderName);
		history.setDoc_type("Folder");
		
		
		historyRepositoy.save(history);
		
		return folderRepository.setFileProtect(id, password);
	}
	
	@PutMapping("/inprotect")
	public ResponseEntity<?> setFileInprotect(@RequestParam("id") String id, @RequestParam("password") String password) {
		Folder f = folderRepo.findById(id).get();
		if(password == null || !bcryptEncoder.matches(password, f.getPassword())) {
			return new ResponseEntity<>("Invalid password", HttpStatus.FORBIDDEN);
		}
		
		String folderName = folderRepo.findById(id).get().getFolderName();
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("inProtect");
		history.setDoc_name(folderName);
		history.setDoc_type("Folder");
		
		
		historyRepositoy.save(history);

		return folderRepository.setFileInprotect(f, password);
	}
	@GetMapping("/download")
	public ResponseEntity<?> downloadFile (@Param("id") String id, @Param("password") String password, HttpServletResponse response) throws Exception {
		Optional<Folder> forlder = folderRepo.findById(id);
		
		if (!forlder.isPresent()) {
			throw new Exception("Could not find File with ID : "+ id);
		}
		Folder folder = forlder.get() ;
		if(folder.getProtect()) {
			if( password == null || !bcryptEncoder.matches(password, folder.getPassword())) {
				return new ResponseEntity<>("Invalid password", HttpStatus.FORBIDDEN);
			}
		}
		response.setContentType("application/octet-stream");
		
		String headerKey = "Content-Disposition";
		String headerValue = "attachement; filename= "+ folder.getFolderName() + ".zip";
		
		response.setHeader(headerKey, headerValue);
		
		ServletOutputStream outputStream = response.getOutputStream();
		
		outputStream.write(folderRepository.zipFolder(id));
		outputStream.close();
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PutMapping("/update")
	public ResponseEntity<Folder> updateFolder (@RequestParam("id") String id , @RequestParam("folderName") String folderName){
		Folder selectedFolder = folderRepo.findById(id).get();
		
		selectedFolder.setFolderName(folderName);
		
		return new ResponseEntity<Folder>(folderRepo.save(selectedFolder) , HttpStatus.OK);
	}

	@PostMapping("/deplaceCode/{idFile}")
	public ResponseEntity<Boolean> addCodeForFile(@PathVariable String idFile){
		Folder folder= folderRepo.findById(idFile).orElse(null);
		if (folder != null){
			String code = String.format("%06d", new Random().nextInt(999999));
			folder.setCode(code);
			folder =folderRepo.save(folder);
			asyncTreatment.asyncSendCodeByMailAndSmsForMoveFile(folder.getClient_id().toString(),code);
			return new ResponseEntity<>(true, HttpStatus.OK);
		}
		return new ResponseEntity<>(false, HttpStatus.OK);

	}

	@PostMapping("/deplaceCodeVerif")//3XD4F1TXLDXMTY89R9AEY66N   Recovery code 677546
	public ResponseEntity<Boolean> checkSecondMoveFile( @RequestBody MoveEntityRequest moveEntityRequest){
		if(moveEntityRequest != null && moveEntityRequest.getId() != null ) {
			Folder folder = folderRepo.findById(moveEntityRequest.getId()).orElse(null);
			if (folder == null ) {
				return ResponseEntity.notFound().build();
			}

			if( folder.getCode() == null) {
				return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
			}
			else if(moveEntityRequest.getCode().equals(folder.getCode())) {
				folder.setCode(null);
				folder.setInSafety(moveEntityRequest.getInSafety());
				folderRepo.save(folder);
				List<File> listFile= fileRepositroy.findAllByIdFolder(folder.getFolderId());
				List<Folder> subFolders = folderRepo.findAllByFolderParentId(folder.getFolderId());
				moveContent(moveEntityRequest,listFile,subFolders);
				return new ResponseEntity<>(true, HttpStatus.OK);
			}
		}
		return new ResponseEntity<>(false,HttpStatus.FORBIDDEN);
	}

	private void moveContent(MoveEntityRequest moveEntityRequest,List<File> listFile,List<Folder> subFolders) {
		if(listFile != null){
			for(File file:listFile){
				file.setInSafety(moveEntityRequest.getInSafety());
				fileRepositroy.save(file);
			}
		}
		if(subFolders != null){
			for (Folder folder1:subFolders){
				folder1.setInSafety(moveEntityRequest.getInSafety());
				folderRepo.save(folder1);
				List<File> listFile1= fileRepositroy.findAllByIdFolder(folder1.getFolderId());
				List<Folder> subFolders1 = folderRepo.findAllByFolderParentId(folder1.getFolderId());
				if (listFile1 != null || subFolders1 != null){
					moveContent(moveEntityRequest,listFile1,subFolders1);
				}
			}
		}
	}

	@PostMapping("/rename/{id}")
	public Boolean renameFolder (@PathVariable String id,@RequestParam("name") String name) {
		return folderRepository.renameFolder(id,name);
	}
}
