package com.Gadour.App.Model;

import java.io.File;
import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;

@Document(value = "Business")
public class ProfileBusiness implements Serializable {
	
	@Id
	private String idBusiness ;
	
	private MultipartFile Kbis ;
	
	private MultipartFile Iban ;
	
	private String Owner ;
	
	private String Telephone ;
	
	private Date KbisDate ;

	public ProfileBusiness() {
		
	}

	public String getIdBusiness() {
		return idBusiness;
	}

	public void setIdBusiness(String idBusiness) {
		this.idBusiness = idBusiness;
	}

	public MultipartFile getKbis() {
		return Kbis;
	}

	public void setKbis(MultipartFile kbis) {
		Kbis = kbis;
	}

	public MultipartFile getIban() {
		return Iban;
	}

	public void setIban(MultipartFile iban) {
		Iban = iban;
	}

	public String getOwner() {
		return Owner;
	}

	public void setOwner(String owner) {
		Owner = owner;
	}

	public String getTelephone() {
		return Telephone;
	}

	public void setTelephone(String telephone) {
		Telephone = telephone;
	}

	public Date getKbisDate() {
		return KbisDate;
	}

	public void setKbisDate(Date kbisDate) {
		KbisDate = kbisDate;
	}

}
