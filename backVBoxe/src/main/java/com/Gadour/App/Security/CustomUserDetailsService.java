package com.Gadour.App.Security;

import java.io.File;
import java.util.*;

import com.Gadour.App.Async.AsyncTreatment;
import com.Gadour.App.Model.*;
import com.Gadour.App.Repository.FriendRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Gadour.App.Repository.ConfirmationTokenRepository;
import com.Gadour.App.Repository.UserRepository;
import com.Gadour.App.Service.AuthService;
import com.Gadour.App.Service.EmailService;



@Service
public class CustomUserDetailsService implements UserDetailsService {

	
	@Autowired
	private AsyncTreatment asyncTreatment;
	@Autowired
	private UserRepository userDao;

	@Autowired
	private FriendRepository friendRepository;
	
	@Autowired
	private ConfirmationTokenRepository confirmationTokenRepository;
	
	@Autowired
	private AuthService authService;
	
	@Autowired
    private EmailService emailService;
	
	@Autowired
	private PasswordEncoder bcryptEncoder;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		List<SimpleGrantedAuthority> roles = null;
		
			
		DAOUser user = userDao.findByUsername(username);
		if (user != null && user.getIsEnabled()== true) {
			roles = Arrays.asList(new SimpleGrantedAuthority(user.getRole()));
			return new User(user.getUsername(), user.getPassword(), roles);
		}
		throw new UsernameNotFoundException("User not found with the name " + username);	
		}
	

	public UserDetails loadUserById(String id)  {
		List<SimpleGrantedAuthority> roles = null;
		
			
		DAOUser user = authService.findById(id);
		if (user != null && user.getIsEnabled()== true) {
			roles = Arrays.asList(new SimpleGrantedAuthority(user.getRole()));
			return new User(user.getUsername(), user.getPassword(), roles);
		}
		throw new UsernameNotFoundException("User not found with the id " + id);
			}


	public Boolean save(UserDTO user) {
		DAOUser newUser = new DAOUser();
		if (userDao.existsByUsername(user.getUsername())) {
			return false;
		}else {
		newUser.setUsername(user.getUsername());
		}
		newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
		newUser.setName(user.getName());
		newUser.setRole(user.getRole());
		newUser.setClient_number("VB" + new ObjectId().toString().hashCode());
		newUser.setTel(user.getTel());

		 userDao.save(newUser);

		 ConfirmationToken confirmationToken = new ConfirmationToken(newUser);
		 confirmationTokenRepository.save(confirmationToken);
		 SimpleMailMessage mailMessage = new SimpleMailMessage();
	        mailMessage.setTo(user.getUsername());
	        mailMessage.setSubject("Complete Registration!");
	        mailMessage.setText("To confirm your account, please click here : "
	                +"http://localhost:8080/confirm-account?token="+confirmationToken.getConfirmationToken());
	        emailService.sendEmail(mailMessage);
		 return true;
	}

	public DAOUser myUser(){
		String id = authService.getUser().getId();
		DAOUser newUser = userDao.findById(id).orElse(null);
		return newUser;
	}
	public Boolean saveProfile(UserDTO user) {
		DAOUser newUser = new DAOUser();
		if (userDao.existsByUsername(user.getUsername())) {
			return false;
		}else {
		newUser.setUsername(user.getUsername());
		}
		newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
		newUser.setName(user.getName());
		newUser.setTemporary(true);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(new Date());
		calendar.add(Calendar.HOUR_OF_DAY, user.getDeletionHours());
		newUser.setExpirationDate(calendar.getTime());
		newUser.setDeletionHours(user.getDeletionHours());
		newUser.setTemporary(true);
		newUser.setOriginPassword(user.getPassword());
		newUser.setRole(user.getRole());
		newUser.setClient_number("VB" + new ObjectId().toString().hashCode());
		newUser.setTel(user.getTel());
		newUser.setIsEnabled(true);
		newUser.generateLinks();
		newUser= userDao.save(newUser);

		//*********************
		String id = authService.getUser().getId();
		FriendList newFriend = new FriendList();
		newFriend.setUser1(newUser.getId() );
		newFriend.setUser2(id);
		FriendList S = friendRepository.save(newFriend);
		asyncTreatment.asyncSendCodeByMailAndSmsForProfile(newUser);
		ConfirmationToken confirmationToken = new ConfirmationToken(newUser);
		confirmationTokenRepository.save(confirmationToken);
		return true;
	}
	
	
	 
	    public ResponseEntity<?> confirmEmail(String confirmationToken) {
	        ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);

	        if(token != null)
	        {
	            DAOUser user = userDao.findByUsernameIgnoreCase(token.getUserEntity().getUsername());
	            user.setIsEnabled(true);;
	            userDao.save(user);
	            return ResponseEntity.ok("Email verified successfully!");
	        }
	        return ResponseEntity.badRequest().body("Error: Couldn't verify email");
	    }
	
	
	
	
	
	
	public DAOUser saveGuest(UserDTO user) {
		DAOUser newUser = new DAOUser();
		newUser.setUsername(user.getUsername());
		newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
		newUser.setName(user.getName());
		newUser.setRole("ROLE_GUEST");
		newUser.setCreatedAt(new Date());
	
		return userDao.save(newUser);
	}

	public DAOUser update(UserDTO user) {
		String id = authService.getUser().getId();
		DAOUser newUser = userDao.findById(id).get();
		if(user.getUsername() != null && !user.getUsername().isEmpty()) newUser.setUsername(user.getUsername());
		if(user.getPassword() != null) newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
		if(user.getName() != null && !user.getName().isEmpty()) newUser.setName(user.getName());
		if(user.getRole() != null && !user.getRole().isEmpty()) newUser.setRole(user.getRole());
		if(user.getTel() != null && !user.getTel().isEmpty()) newUser.setTel(user.getTel());
		if(user.getProfilePicture() != null) newUser.setProfilePicture(user.getProfilePicture());
		if(user.getProfession() != null && !user.getProfession().isEmpty()) newUser.setProfession(user.getProfession());
		if(user.getGroup() != null && !user.getGroup().isEmpty()) newUser.setGroup(user.getGroup());
		if(user.getCompany() != null && !user.getCompany().isEmpty()) newUser.setCompany(user.getCompany());
	
		return userDao.save(newUser);
	}

}
