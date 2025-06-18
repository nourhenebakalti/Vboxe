package com.Gadour.App.Controller;

import java.util.Date;
import java.util.List;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Model.History;
import com.Gadour.App.Repository.HistoryRepo;
import com.Gadour.App.Repository.HistoryRepositoy;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/history")
public class HistoryController {
	
	@Autowired
	HistoryRepositoy historyRepositoy;
	
	@Autowired
	HistoryRepo historyRepo;
	
	History history;
	
	@GetMapping("/all")
	public Document allHistory(){
		return historyRepo.recentHistory();
		
	}
	
	//----------------------User Section-------------------
	@GetMapping("/{id}")
	public Document historyByUser(@PathVariable("id") String id) {
		return historyRepo.userHisory(id);
	}
	
	@GetMapping("/count/user/{id}")
	public Document userHistroyCount (@PathVariable("id") String id) {
		return historyRepo.userHistroyCount(id);
	}
	
	@GetMapping("/count/user/all")
	public Document totalActivity() {
		return historyRepo.totalActivity();
	}
	
	//----------------------File Section-------------------
	@GetMapping("/count/all")
	public Document fileActivities(@RequestParam("filename") String filename) {
		return historyRepo.fileActivityCount(filename);
	}
	
	@GetMapping("/count/upload/all")
	public int uploadCountByName(@RequestParam("userId") ObjectId userId) {

		return historyRepo.NbFilesByUser(userId);
	}
	
	@GetMapping("/count/download/all")
	public Document downloadCountByName (@RequestParam("filename") String filename) {
		return historyRepo.filedownloadCount(filename);
	}
	
	@GetMapping("/count/share/all")
	public Document totalFileShareCount() {
		return historyRepo.TotalFileShareCount();
	}
	
	@GetMapping("/count/share/{id}")
	public Document fileTotalsharecount(@PathVariable("id") String id) {
		return historyRepo.FileShareCount(id);
	}
	
//	@GetMapping("/count/extension/png")
//	public Document pngCounter(@RequestParam("userId") String user) {
//		return historyRepo.pngCounter(user);
//	}
	
	@GetMapping("/count/extension/gif")
	public Document gifCounter() {
		history.setHistoryDate(new Date());
		return historyRepo.gifCounter();
	}
    @GetMapping("/count/extension/pdf")
    public ResponseEntity<Double> pdfCounter(@RequestParam("userId") ObjectId userId) {
        double count = historyRepo.pdfCounter(userId); // Assurez-vous que cette méthode renvoie un `int`
        return ResponseEntity.ok(count); // Retourne un entier avec le statut HTTP 200
    }

    @GetMapping("/count/extension/html")
    public ResponseEntity<Double> htmlCounter(@RequestParam("userId") ObjectId userId) {
        double count = historyRepo.htmlCounter(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/extension/docx")
    public ResponseEntity<Double> docxCounter(@RequestParam("userId") ObjectId userId) {
        double count = historyRepo.docxCounter(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/extension/img")
    public ResponseEntity<Double> jpegCounter(@RequestParam("userId") ObjectId userId) {
        double count = historyRepo.JPEGCounter(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/extension/ppt")
    public ResponseEntity<Double> pptCounter(@RequestParam("userId") ObjectId userId) {
        double count = historyRepo.PowerPointCounter(userId);
        return ResponseEntity.ok(count);
    }


    @GetMapping("/count/extension/dcm")
    public String dcmCounter(@RequestParam("userId") ObjectId userId) {
        return historyRepo.dcmCounter(userId);
    }

	@GetMapping("/count/extension/exe")
	public Document exeCounter() {
		history.setHistoryDate(new Date());
		return historyRepo.exeCounter();
	}

	@GetMapping("/count/extension/rar")
	public Document rarCounter() {
		history.setHistoryDate(new Date());
		return historyRepo.rarCounter();
	}
	
	@GetMapping("/count/extension/wav")
	public Document wavCounter() {
		history.setHistoryDate(new Date());
		return historyRepo.wavCounter();
	}
	@GetMapping("/nbrFilesDepuisMoisDernier")
	public float  nbrFilesDepuisMoisDernier(@RequestParam("userId") ObjectId userId) {
		return historyRepo.nbrFileDepuisMoisDernier(userId);}
//	@GetMapping("/count/extension/wav")
//	public Document aviCounter() {
//		history.setHistoryDate(new Date());
//		return historyRepo.aviCounter();
//	}
@GetMapping("/count/folder/all")
public int CountFoldersByUser(@RequestParam("userId") ObjectId userId) {

	return historyRepo.NbFoldersByUser(userId);
}
	@GetMapping("/nbrFoldersDepuisMoisDernier")
	public float  nbrFoldersDepuisMoisDernier(@RequestParam("userId") ObjectId userId) {
		return historyRepo.nbrFoldersDepuisMoisDernier(userId);}


}
