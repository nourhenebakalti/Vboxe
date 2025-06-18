package com.Gadour.App.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.Session;
import com.Gadour.App.Repository.SessionRepo;
import com.Gadour.App.Repository.UserRepository;
import com.Gadour.App.Service.AuthService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/session")
public class SessionContorller {

	@Autowired 
	private SessionRepo sessionRepo ;
	
	@Autowired
	 private AuthService authService;
	
	@Autowired
	UserRepository userRepository;
	
	@GetMapping("/all")
	public List<Session> sessions () {
		return sessionRepo.findAll();
	
	}
	@DeleteMapping("/logout")
	public void logout() {
		String jwtToken = authService.getToken();
		//System.out.println(jwtToken);
		sessionRepo.deleteByAccessToken(jwtToken);
		String clientid = authService.getUser().getId();
		DAOUser userDTO;
		
		userDTO = userRepository.findById(clientid).get();
		
		userDTO.setStatus(false);
		
		userRepository.save(userDTO);
		
		
	}
	
	
}
