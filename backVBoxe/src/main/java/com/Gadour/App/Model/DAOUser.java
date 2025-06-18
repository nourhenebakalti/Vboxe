package com.Gadour.App.Model;


import java.io.Serializable;
import java.security.SecureRandom;
import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mongodb.lang.NonNull;

@Document(collection = "Users")
public class DAOUser implements Serializable {

	private static final String ALPHANUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private static final String DIGITS = "0123456789";
	private static final SecureRandom random = new SecureRandom();
	/**
	 * 
	 */
	private static final long serialVersionUID = -5731765386854457923L;
	@Id
	private String id;
	@NonNull
	private String username;
	@NonNull
	@JsonIgnore
	private String password;

	@JsonIgnore
	private String passwordCoffre;


	private Boolean hasPasswordCoffre=false;

	@JsonIgnore
	private String code;
	
	private String name;
	
	@NonNull
	private String role;
	
	private String profession;
	
	private String tel;
	private MultipartFile signature;


	private String group ;
	
	private String company;
	
	private String client_number;

	private String linkCode;
	private String linkPath;

	private boolean isTemporary;

	public void setTemporary(boolean temporary) {
		isTemporary = temporary;
	}

	public boolean isTemporary() {
		return isTemporary;
	}

	private String originPassword;
	public String getOriginPassword() {
		return originPassword;
	}

	public void setOriginPassword(String originPassword) {
		this.originPassword = originPassword;
	}


	public void setLinkCode(String linkCode) {
		this.linkCode = linkCode;
	}

	public void setLinkPath(String linkPath) {
		this.linkPath = linkPath;
	}


	public String getLinkCode() {
		return linkCode;
	}

	public String getLinkPath() {
		return linkPath;
	}





	public void setDeletionHours(int deletionHours) {
		this.deletionHours = deletionHours;
	}

	public int getDeletionHours() {
		return deletionHours;
	}

	private int deletionHours;


	public String getGroup() {
		return group;
	}
	public void setGroup(String group) {
		this.group = group;
	}
	private byte[]  profilePicture;
	

	
	private  Date  lastOnLine;
	
	private Boolean status = false;
	
	
	private Boolean isEnabled = false;
	
	   
	private byte[] photo;

	private String photoBase64;
	@CreatedDate
	private Date CreatedAt ;

	private Date expirationDate;

	public Date getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Boolean getStatus() {
		return status;
	}
	public void setStatus(Boolean status) {
		this.status = status;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Date getLastOnLine() {
		return lastOnLine;
	}
	public void setLastOnLine(Date lastOnLine) {
		this.lastOnLine = lastOnLine;
	}
	
	public String getProfession() {
		return profession;
	}
	public void setProfession(String prof) {
		profession = prof;
	}
	
	
	public byte[] getProfilePicture() {
		return profilePicture;
	}
	public void setProfilePicture(byte[] profilePicture) {
		this.profilePicture = profilePicture;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public Date getCreatedAt() {
		return CreatedAt;
	}
	public void setCreatedAt(Date createdAt) {
		CreatedAt = createdAt;
	}
	public Boolean getIsEnabled() {
		return isEnabled;
	}
	public void setIsEnabled(Boolean isEnabled) {
		this.isEnabled = isEnabled;
	}
	public MultipartFile getSignature() {
		return signature;
	}
	public void setSignature(MultipartFile signature) {
		this.signature = signature;
	}
	public String getClient_number() {
		return client_number;
	}
	public void setClient_number(String client_number) {
		this.client_number = client_number;
	}
	public byte[] getPhoto() {
		return photo;
	}
	public void setPhoto(byte[] photo) {
		this.photo = photo;
	}
	public String getPhotoBase64() {
		return photoBase64;
	}
	public void setPhotoBase64(String photoBase64) {
		this.photoBase64 = photoBase64;
	}

	public void setPasswordCoffre(String passwordCoffre) {
		this.passwordCoffre = passwordCoffre;
	}

	public void setHasPasswordCoffre(Boolean hasPasswordCoffre) {

		this.hasPasswordCoffre = hasPasswordCoffre;
	}

	public String getPasswordCoffre() {
		return passwordCoffre;
	}

	public Boolean getHasPasswordCoffre() {
		return hasPasswordCoffre != null ? hasPasswordCoffre : Boolean.FALSE;
	}

	public void generateLinks() {

		this.linkCode = generateDigitRandomCode(6);
		this.linkPath =  generateRandomCode(12);
	}

	private String generateRandomCode(int length) {
		StringBuilder sb = new StringBuilder(length);
		for (int i = 0; i < length; i++) {
			sb.append(ALPHANUM.charAt(random.nextInt(ALPHANUM.length())));
		}
		return sb.toString();
	}
	private String generateDigitRandomCode(int length) {
		StringBuilder sb = new StringBuilder(length);
		for (int i = 0; i < length; i++) {
			sb.append(DIGITS.charAt(random.nextInt(DIGITS.length())));
		}
		return sb.toString();
	}
}
