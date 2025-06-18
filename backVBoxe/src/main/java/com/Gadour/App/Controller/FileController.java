package com.Gadour.App.Controller;



import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import com.Gadour.App.Async.AsyncTreatment;
import com.Gadour.App.Model.*;
import com.Gadour.App.Service.FileEncryptionService;
import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import com.Gadour.App.Repository.FavoriteRepository;
import com.Gadour.App.Repository.FileRepo;
import com.Gadour.App.Repository.FileRepositroy;
import com.Gadour.App.Repository.FolderRepo;
import com.Gadour.App.Repository.HistoryRepositoy;
import com.Gadour.App.Service.AuthService;
import com.Gadour.App.Service.FileService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/file")
public class FileController {
	@Autowired
	private FileRepositroy fileRepositroy;
	@Autowired
	private ModelMapper mapper;
	@Autowired
	FileService fileService;
	
	@Autowired
	FileRepo fileRepo;
	
	@Autowired
	AuthService authService;
	
	@Autowired
	private PasswordEncoder bcryptEncoder;
	
	@Autowired
	FolderRepo folderRepo;
	@Autowired
	FileEncryptionService fileEncryptionService;

	@Autowired
	FavoriteRepository favoriteRepository;
	
	@Autowired
	HistoryRepositoy historyRepositoy;
	@Autowired
	AsyncTreatment asyncTreatment;



	
	
	public static final String DIRECTORY = System.getProperty("user.home") + "/Desktop/temp2";

	
	
	
	@PostMapping("/upload")
	public ResponseEntity<?> uploadFile(@RequestParam("files") MultipartFile[] files , @RequestParam("idFolder") String id_Folder ,
										@RequestParam("inSafety") boolean inSafety ,
			@RequestParam(required = false , value = "category") String category) throws IOException {
		for (MultipartFile file : files) {
			fileService.saveFile(file, authService.getUser().getId(),id_Folder , category,inSafety);
			
			History history = new History();
			history.setUser(authService.getUser().getId());
			history.setActionType("Upload");
			history.setDoc_type("File");
			history.setDoc_name(file.getOriginalFilename());
			
			history.setFile_type(file.getOriginalFilename().substring(file.getOriginalFilename().length()-3));
			history.setDocParent(id_Folder);
			history.setHistoryDate(new Date());
			
			historyRepositoy.save(history);
			
			
		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}


	@PostMapping("/chiffrer")
	public ResponseEntity<?> hashFile(@RequestParam("files") MultipartFile[] files , @RequestParam("idFolder") String id_Folder ,
										@RequestParam(required = false , value = "category") String category) {
		for (MultipartFile file : files) {
			// chiffrer
			ByteArrayResource secondFile= fileEncryptionService.cryptFile(file);
			long size = file.getSize();
			if (secondFile != null){
				size = secondFile.getByteArray().length;
				File file2 = new File(secondFile.getFilename(),size,new Date(),secondFile.getByteArray());
				file2.setUser(new ObjectId(authService.getUser().getId()));
				file2.setCategory(category);
				file2.setInSafety(true);
				if(!id_Folder.isEmpty()) file2.setIdFolder(id_Folder);
				fileRepositroy.save(file2);
				History history = new History();
				history.setUser(authService.getUser().getId());
				history.setActionType("Upload");
				history.setDoc_type("File");
				history.setDoc_name(secondFile.getFilename());
				history.setFile_type(file.getOriginalFilename().substring(file.getOriginalFilename().length()-3));
				history.setDocParent(id_Folder);
				history.setHistoryDate(new Date());
				historyRepositoy.save(history);
			}

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PostMapping("/dechiffrer/{idFile}")
	public ResponseEntity<?> hashFile(@PathVariable String idFile ) {

		if (idFile != null){
			Optional<File> fileOptional = fileRepositroy.findById(idFile);
			if (fileOptional.isPresent()){
				File file = fileOptional.get();
				// appel pour avoir fichier dechiffrer
				ByteArrayResource secondFile= fileEncryptionService.decryptFile(fileOptional.get());
				long size = file.getSize();
				if (secondFile != null){
					size = secondFile.getByteArray().length;
					File file2 = new File(secondFile.getFilename(),size,new Date(),secondFile.getByteArray());
					file2.setUser(new ObjectId(authService.getUser().getId()));
					file2.setCategory(file.getCategory());
					file2.setInSafety(true);
					file2.setIdFolder(file.getIdFolder());
					fileRepositroy.save(file2);
					fileRepositroy .deleteById(idFile);
					History history = new History();
					history.setUser(authService.getUser().getId());
					history.setActionType("Upload");
					history.setDoc_type("File");
					history.setDoc_name(secondFile.getFilename());
					history.setFile_type(file.getName().substring(file.getName().length()-3));
					history.setDocParent(file.getIdFolder());
					history.setHistoryDate(new Date());
					historyRepositoy.save(history);
				}
			}

		}
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@GetMapping("/download")
	public ResponseEntity<?> downloadFile (@Param("id") String id, @Param("password") String password, HttpServletResponse response) throws Exception {
		Optional<File> result = fileRepositroy.findById(id);
		
		
		if (!result.isPresent()) {
			throw new Exception("Could not find File with ID : "+ id);
		}
		File file = result.get() ;
		if(file.getProtect()) {
			if( password == null || !bcryptEncoder.matches(password, file.getPassword())) {
				return new ResponseEntity<>("Invalid password", HttpStatus.FORBIDDEN);
			}
		}
		response.setContentType("application/octet-stream");
		
		String headerKey = "Content-Disposition";
		String headerValue = "attachement; filename= "+ file.getName();
		
		response.setHeader(headerKey, headerValue);
		
		ServletOutputStream outputStream = response.getOutputStream();
		
		outputStream.write(file.getContent());
		outputStream.close();
		
		String selctedFile = fileRepositroy.findById(id).get().getName();
		//System.out.println(fileRepositroy.findById(id).get().getName());
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Download");
		history.setDoc_type("File");
		history.setDoc_name(selctedFile);
		history.setHistoryDate(new Date());
		
		historyRepositoy.save(history);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	
	
	@GetMapping("/downloads")
	public ResponseEntity<?> downloadFiles (HttpServletResponse response , File[] files) throws Exception {
		for (File file : files) {
		
		Optional<File> result = fileRepositroy.findById(file.getId());
		
		
		if (!result.isPresent()) {
			throw new Exception("Could not find File with ID : "+ file.getId());
		}
		File file2 = result.get() ;
		
		response.setContentType("application/octet-stream");
		
		String headerKey = "Content-Disposition";
		String headerValue = "attachement; filename= "+ file.getName();
		
		response.setHeader(headerKey, headerValue);
		
		ServletOutputStream outputStream = response.getOutputStream();
		
		outputStream.write(file.getContent());
		outputStream.close();
		
		String selctedFile = fileRepositroy.findById(file.getId()).get().getName();
		//System.out.println(fileRepositroy.findById(id).get().getName());
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Download");
		history.setDoc_type("File");
		history.setDoc_name(selctedFile);

		history.setFile_type(selctedFile.substring(selctedFile.length()-3));
		
		history.setHistoryDate(new Date());
		
		historyRepositoy.save(history);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteFile(@PathVariable("id") String id) {
		String selctedFile = fileRepositroy.findById(id).get().getName();
		fileRepositroy.deleteById(id);		
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Delete");
		history.setDoc_type("File");
		history.setDoc_name(selctedFile);
		history.setHistoryDate(new Date());
		
		historyRepositoy.save(history);
		Map<String, String> response = new HashMap<>();
		response.put("message", "File Deleted Successfully !");
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	@GetMapping("/find/{id}")
	public FileDto findFile(@PathVariable("id") String id) throws Exception {
		Optional<File> file = fileRepositroy.findById(id);
		FileDto fileDto = null;
		if(file.isPresent()){
			fileDto = mapper.map(file.get(),FileDto.class);
		}
        return fileDto;
    }
	public byte[] convertDocxToPdf(byte[] docxContent) throws Exception {
		try (InputStream docxInputStream = new ByteArrayInputStream(docxContent);
			 ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream()) {

			XWPFDocument document = new XWPFDocument(docxInputStream);
			Document pdfDocument = new Document();
			PdfWriter.getInstance(pdfDocument, pdfOutputStream);
			pdfDocument.open();

			List<XWPFParagraph> paragraphs = document.getParagraphs();
			for (XWPFParagraph paragraph : paragraphs) {
				pdfDocument.add(new Paragraph(paragraph.getText()));
			}

			pdfDocument.close();

			// Capture the generated PDF data

			return pdfOutputStream.toByteArray();
			// Now you have the PDF content in "pdfByteArray"
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@DeleteMapping("/deletes")
	public void deleteFolderwithFiles(@RequestParam("idFolder") String idFolder ) {
		fileRepositroy.deleteByidFolder(idFolder);
	}
	
	@GetMapping("/all")
	public List<File> allFiles() {
		return fileRepositroy.findAll();
	}
	
	@GetMapping("/userfiles")
	public List<File> userFiles() {
		String id = authService.getUser().getId();
		System.out.println(id);
		return fileRepositroy.findAllByUser(new ObjectId(id));
	}
	@GetMapping("/folderfiles/{idFolder}")
	public List<File> folderfiles(@PathVariable("idFolder") String idFolder){
		return fileRepositroy.findAllByIdFolder(idFolder);
	}
	 
	@PutMapping("/update")
	public ResponseEntity<File>  updateFile (@RequestBody File file) {
		
		
		 fileRepositroy.save(file);
		
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Update");
		history.setDoc_type("File");
		history.setDoc_name(file.getName());
		history.setHistoryDate(new Date());
		
		historyRepositoy.save(history);
		
		return new ResponseEntity<File>(HttpStatus.OK);
	}
	@PutMapping("/update/name")
	public ResponseEntity<File> updateFileName (@RequestParam("id") String id , @RequestParam("name") String name){
		File selectedFile = fileRepositroy.findById(id).get();
		
		selectedFile.setName(name);
		
		return new ResponseEntity<File>(fileRepositroy.save(selectedFile) , HttpStatus.OK);
	}
	
	@PutMapping("/update/folderid")
	public ResponseEntity<File> updateFileFolderid (@RequestParam("id") String id , @RequestParam("folder_id") String folder_id) {
		File selectedFile = fileRepositroy.findById(id).get();
		
		if (folderRepo.existsById(folder_id) == true) {
			selectedFile.setIdFolder(folder_id);
			return new ResponseEntity<File>(fileRepositroy.save(selectedFile) , HttpStatus.OK);
		}else
			return new ResponseEntity<File>(HttpStatus.BAD_REQUEST);
	}
	 
	@PutMapping("/update/remove/folderid")
	public ResponseEntity<?> removeFolderId (@RequestParam("id") String id) {
		File selectedFile = fileRepositroy.findById(id).get();
		if (selectedFile.getIdFolder() != null) {
			selectedFile.setIdFolder(null);
			return new ResponseEntity<File> (fileRepositroy.save(selectedFile) , HttpStatus.OK);
		}else {
			Map<String, String> msg = new HashMap<>();
			msg.put("Message", "This file doesn't exist in any of the folders!");
			return new ResponseEntity<>(msg , HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/total")
	public Long totalSize () {
		Long total = 0L;

		String id = authService.getUser().getId();
		List<File> privateFiles = fileRepositroy.findAllByUser( new ObjectId(id));
		for (File file : privateFiles) {
			 Long S=file.getSize();
			total+=S;
		}
		return total;
	}

	@PutMapping("/protect")
	public ResponseEntity<?> setFileProtect(@RequestParam("id") String id, @RequestParam("password") String password) {
		String selectedFile = fileRepositroy.findById(id).get().getName();
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Protect");
		history.setDoc_type("File");
		
		history.setDoc_name(selectedFile);
		
		history.setHistoryDate(new Date());
		
		historyRepositoy.save(history);
		return fileRepo.setFileProtect(id, password);
		

		
		
	}
	
	@PutMapping("/inprotect")
	public ResponseEntity<?> setFileInprotect(@RequestParam("id") String id, @RequestParam("password") String password) {
		File f = fileRepositroy.findById(id).get();
		if(password == null || !bcryptEncoder.matches(password, f.getPassword())) {
			return new ResponseEntity<>("Invalid password", HttpStatus.FORBIDDEN);
		}
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Inprotect");
		history.setDoc_type("File");
		
		history.setDoc_name(f.getName());
		
		history.setHistoryDate(new Date());
		
		historyRepositoy.save(history);
		return fileRepo.setFileInprotect(f, password);
		
		
	}
	
	@GetMapping("/count")
	public org.bson.Document FileCount() {
		return fileRepo.count_me();
	}
	
	@GetMapping("/find/category")
	public org.bson.Document findByCategory(@RequestParam("category") String category) {
		return fileRepo.findByCategoryDesc(category);
	}
	
	//-------------Readers Section----------------
	@PostMapping("/reader/add")
	
	public ResponseEntity<String> addReaders(@RequestParam(required = true , name = "access") Boolean access ,
			@RequestParam(required = true , name = "id") String id ,
			@RequestParam(required = false , name = "user_id") String user_id ) {
			String newReader = fileService.addreaders(access, id, user_id);
		
				return new ResponseEntity<String>(newReader , HttpStatus.CREATED);
		
	}
	
	
	@DeleteMapping("/reader/delete")
	public void deleteReaders(@RequestParam("id") String id , @RequestParam("user_id") String user_id) {
		fileService.deleteReaders(id, user_id);
	}
	
	//-------------Writers Section----------------
	
	@PostMapping("/writer/add")
	public ResponseEntity<String> addWriter(@RequestParam(required = true , name = "access") Boolean access ,
	@RequestParam(required = true , name = "id") String id ,
	@RequestParam(required = false , name = "user_id") String user_id){
		String newWriter = fileService.addWriter(access, id, user_id);
	return new ResponseEntity<String>(newWriter , HttpStatus.CREATED);
		
	}
	
	@PostMapping("/writer/temp")
	public String addTempWriter(@RequestParam(required = true , name = "access") Boolean access ,
	@RequestParam(required = true , name = "id") String id ,
	@RequestParam(required = false , name = "user_id") String user_id,
	@RequestParam(required = true , name = "timer")int timer) {
		
		return fileService.addTemporaryWriter(access, id, user_id, timer);
		
	}
	
	
	@DeleteMapping("/writer/delete")
	public void deleteWriter(@RequestParam("id") String id , @RequestParam("user_id") String user_id) {
		fileService.deleteWriters(id, user_id);
	}
	
	
	//-------------favorite Files------------------
	@GetMapping("/favorite")
	public org.bson.Document favFiles(){
		return fileRepo.favFiles();
	}
	
	@PutMapping("/favorite/add")
		public File favAdd(@RequestParam("id") String id ) {
			File selectedFile = fileRepositroy.findById(id).get();
			
			
			
			selectedFile.setFavorite(true);
			
			History history = new History();
			history.setUser(authService.getUser().getId());
			history.setActionType("Add to Favourite");
			history.setDoc_type("File");
			
			history.setDoc_name(selectedFile.getName());
			
			history.setHistoryDate(new Date());
		
			historyRepositoy.save(history);
			
		return fileRepositroy.save(selectedFile);
		
	}
	
	
	
	@PutMapping("/favorite/remove")
	public File favRemove(@RequestParam("id") String id ) {
		File selectedFile = fileRepositroy.findById(id).get();
		
		selectedFile.setFavorite(false);
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Delete from Favourite");
		history.setDoc_type("File");
		
		history.setDoc_name(selectedFile.getName());
		
		history.setHistoryDate(new Date());
	
		historyRepositoy.save(history);
	
	return fileRepositroy.save(selectedFile);
	
}
	
	
	//-----------------Recent Files----------------
	@GetMapping("/recent")
	public org.bson.Document recentFiles(){
		return fileRepo.recentFile();
	}
	
	
	//-----------------Files bin-------------------
	@GetMapping("/bin/all")
	public org.bson.Document bin_files() {
		return fileRepo.filesBin();
	}
	
	@PutMapping("/bin/add")
	public ResponseEntity<File> add_toBin(@RequestParam("id") String id) {
		
		File selectedFile = fileRepositroy.findById(id).get();
		
		selectedFile.setDeleted(true);
		
		selectedFile.setDeletedTime(new Date());
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Add to Bin");
		history.setDoc_type("File");
		
		history.setDoc_name(selectedFile.getName());
		
		history.setHistoryDate(selectedFile.getDeletedTime());
	
		historyRepositoy.save(history);
		
		return new ResponseEntity<File>(fileRepositroy.save(selectedFile) , HttpStatus.OK);
	}
	
	@PutMapping("/bin/remove")
	public ResponseEntity<File> remove_toBin(@RequestParam("id") String id) {
		
		File selectedFile = fileRepositroy.findById(id).get();
		
		selectedFile.setDeleted(false);
		
		selectedFile.setDeletedTime(null);
		
		History history = new History();
		history.setUser(authService.getUser().getId());
		history.setActionType("Remove from Bin");
		history.setDoc_type("File");
		
		history.setDoc_name(selectedFile.getName());
		
		history.setHistoryDate(new Date());
	
		historyRepositoy.save(history);
		
		return new ResponseEntity<File>(fileRepositroy.save(selectedFile) , HttpStatus.OK);
	}

	@GetMapping("/limitSize")
	public int StorageSize () {
		return fileRepo.getStorageSize();
	}

	@PostMapping("/deplaceCode/{idFile}")
	public ResponseEntity<Boolean> addCodeForFile(@PathVariable String idFile){
		File file= fileRepositroy.findById(idFile).orElse(null);
		if (file != null){
			String code = String.format("%06d", new Random().nextInt(999999));
			file.setCode(code);
			file =fileRepositroy.save(file);
			asyncTreatment.asyncSendCodeByMailAndSmsForMoveFile(file.getUser().toString(),code);
			return new ResponseEntity<>(true, HttpStatus.OK);
		}
		return new ResponseEntity<>(false, HttpStatus.OK);

	}

	@PostMapping("/deplaceCodeVerif")
	public ResponseEntity<Boolean> checkSecondMoveFile( @RequestBody MoveEntityRequest moveEntityRequest){
		if(moveEntityRequest != null && moveEntityRequest.getId() != null ) {
			File file = fileRepositroy.findById(moveEntityRequest.getId()).orElse(null);
			if (file == null ) {
				return ResponseEntity.notFound().build();
			}

			if( file.getCode() == null) {
				return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
			}
			else if(moveEntityRequest.getCode().equals(file.getCode())) {
				file.setCode(null);
				file.setInSafety(moveEntityRequest.getInSafety());
				fileRepositroy.save(file);
				return new ResponseEntity<>(true, HttpStatus.OK);
			}
		}
		return new ResponseEntity<>(false,HttpStatus.FORBIDDEN);
	}

	@PostMapping("/rename/{id}")
	public Boolean renameFile (@PathVariable String id,@RequestParam("name") String name) {
		return fileRepo.renameFile(id,name);
	}

}
	


