package com.Gadour.App.Controller;

import java.io.File;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.Gadour.App.Model.ProfileBusiness;
import com.Gadour.App.Repository.BusinessRepo;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/bus")
public class BusinessController {
	@Autowired
	BusinessRepo businessRepo ;
	
	@PostMapping("/add")
	public ResponseEntity<ProfileBusiness> addProfile(@RequestParam("kbis") MultipartFile kbis , @RequestParam("iban") MultipartFile iban ,
			@RequestParam("owner") String owner , @RequestParam("tel") String tel ){
		
		ProfileBusiness business = new ProfileBusiness();
		business.setKbis(kbis);
		business.setIban(iban);
		business.setOwner(owner);
		business.setTelephone(tel);
		business.setKbisDate(new Date());
		
		ProfileBusiness saveB = businessRepo.save(business);
		return new ResponseEntity<>(saveB , HttpStatus.CREATED);
	}
	
	public ResponseEntity<ProfileBusiness> updateProfile (@RequestParam("id") String id , @RequestParam("kbis") MultipartFile kbis , @RequestParam("iban") MultipartFile iban ,
			@RequestParam("owner") String owner , @RequestParam("tel") String tel){
		
		ProfileBusiness business = businessRepo.findById(id).get();
		MultipartFile Kbiss = business.getKbis();
		business.setKbis(kbis);
		business.setIban(iban);
		business.setOwner(owner);
		business.setTelephone(tel);
		if (Kbiss!= null && (business.getKbis()!=Kbiss)) {
			business.setKbisDate(new Date());
			
			
		}
		ProfileBusiness saveB = businessRepo.save(business);
		return new ResponseEntity<>(saveB , HttpStatus.OK);
	}
}