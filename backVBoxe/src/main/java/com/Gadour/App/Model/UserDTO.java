package com.Gadour.App.Model;


import java.util.Date;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.web.multipart.MultipartFile;


public class UserDTO {
	private String username;
	private String password;

	private String name;


	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	private String role;
	private String Profession;

	public Date getCreatedAt() {
		return CreatedAt;
	}

	public void setCreatedAt(Date createdAt) {
		CreatedAt = createdAt;
	}

	public Date getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}

	private Date expirationDate;



	public void setDeletionHours(int deletionHours) {
		this.deletionHours = deletionHours;
	}

	public int getDeletionHours() {
		return deletionHours;
	}

	private int deletionHours;

	private String tel;

	private MultipartFile file;

	private String group ;



	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	private byte[]  profilePicture;
	private String company;
	@CreatedDate
	private Date CreatedAt ;


	public byte[] getProfilePicture() {
		return profilePicture;
	}


	public void setProfilePicture(byte[] profilePicture) {
		this.profilePicture = profilePicture;
	}
	private  Date  lastOnLine;

	public Date getLastOnLine() {
		return lastOnLine;
	}
	public void setLastOnLine(Date lastOnLine) {
		this.lastOnLine = lastOnLine;
	}

	private Boolean status = false;


	private String activation_code;

	private Boolean enabled = false;




	public Boolean getStatus() {
		return status;
	}
	public void setStatus(Boolean status) {
		this.status = status;
	}


	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
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

	public String getProfession() {
		return Profession;
	}
	public void setProfession(String profession) {
		Profession = profession;
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
	public String getActivation_code() {
		return activation_code;
	}
	public void setActivation_code(String activation_code) {
		this.activation_code = activation_code;
	}
	public Boolean getEnabled() {
		return enabled;
	}
	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}
	public MultipartFile getFile() {
		return file;
	}
	public void setFile(MultipartFile file) {
		this.file = file;
	}

}
