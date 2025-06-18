package com.Gadour.App.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Repository.UserRepository;

@Service
public class AuthService {
	DAOUser user;
	String token;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	@Autowired
	UserRepository userRepository;
	
	public DAOUser getUser() {
		return user;
	}

	public void setUser(DAOUser user) {
		this.user = user;
	}
	
	public DAOUser findById(String id) {
	    return userRepository.findById(id).get();
	}
	
}
