package com.Gadour.App.Controller;




import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import com.Gadour.App.Model.*;
import com.Gadour.App.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.Gadour.App.Security.CustomUserDetailsService;
import com.Gadour.App.Security.JwtUtil;
import com.Gadour.App.Service.AuthService;
import com.google.api.client.json.Json;

import io.jsonwebtoken.impl.DefaultClaims;

@RestController
@CrossOrigin(origins = "*")
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private CustomUserDetailsService userDetailsService;
	@Autowired
	private UserRepository userRepository ;
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	ConfirmationTokenRepository confirmationTokenRepository;
	
	@Autowired
	AuthService authService;

	@Autowired
	private UserRepo userRepo ;
	@Autowired
	private SessionRepo sessionRepo ;
	
	@Autowired
	NotificationRepositroy notificationRepositroy;
	
	@Autowired
	FriendRepository friendRepository;
	@Autowired
	private HistoryConnexionRepository historyConnexionRepo;

	//Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	//CustomUserDetailsService customUser = (CustomUserDetailsService)authentication.getPrincipal();
	//int userid = customUser.get
	

	@PostMapping(value = "/authenticate")
	public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest, DAOUser daoUser )
			throws Exception {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
					authenticationRequest.getUsername(), authenticationRequest.getPassword()));
			
		} catch (DisabledException e) {
			throw new Exception("USER_DISABLED", e);
		}
		catch (BadCredentialsException e) {
			throw new Exception("INVALID_CREDENTIALS", e);
		}
		DAOUser user = userRepository.findByUsername(authenticationRequest.getUsername());
		UserDetails userdetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());

		//System.out.println(userRepository.findByUsername(authenticationRequest.getUsername()).getId());
		InfoToken infoToken = new InfoToken();
		Map<String, String> token = jwtUtil.generateToken(userdetails);
		infoToken.setToken(token);
		infoToken.setTemporary(user.isTemporary());
		//give us the id of the logged in user
		String clientid= userRepository.findByUsername(authenticationRequest.getUsername()).getId();
		String AccToken = token.get("AccessToken");
		String RefToken = token.get("RefreshToken");
		Session newSession = new Session();
		newSession.setId_client(clientid);
		newSession.setAccessToken(AccToken);
		newSession.setResfreshToken(RefToken);
		newSession.setSession_date(new Date());
		sessionRepo.save(newSession);
		DAOUser userDTO;
		userDTO = userRepository.findById(clientid).get();
		userDTO.setLastOnLine(new Date());
		userDTO.setStatus(true);
		userRepository.save(userDTO);
		HistoryConnexion newConnexion = new HistoryConnexion();
		newConnexion.setId_client(clientid);
		newConnexion.setConnexion_date(new Date());
		historyConnexionRepo.save(newConnexion);
		//System.out.println(userRepository.findById(clientid).get().getRole());
		return ResponseEntity.ok(infoToken);
	}

	@PostMapping(value = "/authenticateLink")
	public ResponseEntity<?> connectUserToLink(@RequestBody AuthenticationRequest authenticationRequest )
			throws Exception {
		String linkCode = authenticationRequest.getUsername();
		String linkPath = authenticationRequest.getPassword();
		try {
			Optional<DAOUser> userOptional = userRepository.findByLinkCodeAndLinkPath(linkCode, linkPath);
			DAOUser user= userOptional.orElse(null);

			if (user != null){

				 authenticationRequest.setUsername(user.getUsername());
				 authenticationRequest.setPassword(user.getOriginPassword());
				authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
						authenticationRequest.getUsername(), authenticationRequest.getPassword()));
			}


		} catch (DisabledException e) {
			throw new Exception("USER_DISABLED", e);
		}
		catch (BadCredentialsException e) {
			throw new Exception("INVALID_CREDENTIALS", e);
		}

		Optional<DAOUser> userOptional = userRepository.findByLinkCodeAndLinkPath(linkCode, linkPath);
		DAOUser user= userOptional.orElse(null);
		if (user != null){
			authenticationRequest.setUsername(user.getUsername());
			authenticationRequest.setPassword(user.getOriginPassword());
			UserDetails userdetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
			InfoToken infoToken = new InfoToken();
			//System.out.println(userRepository.findByUsername(authenticationRequest.getUsername()).getId());
			Map<String, String> token = jwtUtil.generateToken(userdetails);
			infoToken.setToken(token);
			infoToken.setTemporary(user.isTemporary());
			//give us the id of the logged in user
			String clientid= userRepository.findByUsername(authenticationRequest.getUsername()).getId();
			String AccToken = token.get("AccessToken");
			String RefToken = token.get("RefreshToken");
			Session newSession = new Session();
			newSession.setId_client(clientid);
			newSession.setAccessToken(AccToken);
			newSession.setResfreshToken(RefToken);
			newSession.setSession_date(new Date());
			sessionRepo.save(newSession);
			DAOUser userDTO;
			userDTO = userRepository.findById(clientid).get();
			userDTO.setLastOnLine(new Date());
			userDTO.setStatus(true);
			userRepository.save(userDTO);
			HistoryConnexion newConnexion = new HistoryConnexion();
			newConnexion.setId_client(clientid);
			newConnexion.setConnexion_date(new Date());
			historyConnexionRepo.save(newConnexion);
			//System.out.println(userRepository.findById(clientid).get().getRole());
			return ResponseEntity.ok(infoToken);
		}
		return ResponseEntity.ok(null);
	}
	
	@PostMapping(value = "/refreshTokens")
	public ResponseEntity<?> refreshAuthenticationToken(@RequestParam("refreshToken") String refreshToken) {
		Session session = sessionRepo.findByResfreshToken(refreshToken);
		UserDetails userdetails = userDetailsService.loadUserById(session.getId_client());
		Map<String, String> token = jwtUtil.generateToken(userdetails);
		String AccToken = token.get("AccessToken");
		
		String RefToken = token.get("RefreshToken");
		
		Session newSession = new Session();
		newSession.setId_client(session.getId_client());
		
		newSession.setAccessToken(AccToken);
		newSession.setResfreshToken(RefToken);
		
		newSession.setSession_date(new Date());
		
		sessionRepo.save(newSession);
		sessionRepo.delete(session);
		
		
	
		
		return ResponseEntity.ok(token);
	}
	
	@PostMapping(value = "/register")
	public ResponseEntity<Boolean> saveUser(@RequestBody UserDTO user ){
		
		return ResponseEntity.ok(userDetailsService.save(user));
	}
	@PostMapping(value = "/registerProfile")
	public ResponseEntity<Boolean> saveUserProfile(@RequestBody UserDTO user ){

		return ResponseEntity.ok(userDetailsService.saveProfile(user));
	}
	@GetMapping(value = "/userauth")
	public ResponseEntity<?> getUser( ){
		DAOUser user= userDetailsService.myUser();
		if (user != null){
			return ResponseEntity.ok(user.getExpirationDate()) ;
		}
		return ResponseEntity.ok(null);
	}
	
	@GetMapping(value="/confirm-account")
	
	public ResponseEntity<?> ConfirmAccount (@RequestParam("token")String confirmationToken) {
		ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);
		Map<String, String> response = new HashMap<>();
		if(token != null)
        {
			DAOUser user = userRepository.findByUsernameIgnoreCase(token.getUserEntity().getUsername());
			user.setIsEnabled(true);
			userRepository.save(user);
			confirmationTokenRepository.delete(token);
			response.put("message", "account activated");
			return ResponseEntity.status(HttpStatus.OK).body(response);
        }else {
        	response.put("message", "error");
        	return ResponseEntity.status(HttpStatus.OK).body(response);
        }
	}
	
	@PostMapping(value = "/addguest")
	public ResponseEntity<?> saveGuest(@RequestBody UserDTO user  ,DAOUser dao) throws Exception {
		
		return ResponseEntity.ok(userDetailsService.saveGuest(user));
	}
	@GetMapping(value = "/allUsers")
	public ResponseEntity<List<DAOUser>> allusers(){
		return ResponseEntity.ok(userRepository.findAll());
	}
	
	@DeleteMapping(value = "/delete/{id}")
	public String deleteUser (@PathVariable String id) {
		userRepository.deleteById(id);
		return "User Deleted Successfully";
	}

	public Map<String, Object> getMapFromIoJsonwebtokenClaims(DefaultClaims claims) {
		Map<String, Object> expectedMap = new HashMap<String, Object>();
		for (Entry<String, Object> entry : claims.entrySet()) {
			expectedMap.put(entry.getKey(), entry.getValue());
		}
		return expectedMap;
	}
	
	@PutMapping(value = "/update")
	public ResponseEntity<?> updateUser (@RequestBody UserDTO user) {
		return ResponseEntity.ok(userDetailsService.update(user));
	}
	
	@PutMapping(value = "/profileinfo")
	public ResponseEntity<?> addPicture (@RequestParam("pic") MultipartFile pic , @RequestParam("profession") String profession 
			, @RequestParam("tel") String tel , @RequestParam("group") String group) throws IOException{
		String clientid= authService.getUser().getId();
		DAOUser userDTO;
		
		userDTO = userRepository.findById(clientid).get();
		
		if(pic != null && !pic.isEmpty()) userDTO.setProfilePicture(pic.getBytes());
		if(profession != null && !profession.isEmpty()) userDTO.setProfession(profession);
		if(tel != null && !tel.isEmpty()) userDTO.setTel(tel);
		if(group != null && !group.isEmpty()) userDTO.setGroup(group);
		userRepository.save(userDTO);
		return ResponseEntity.ok("");
	}
	
	@GetMapping(value = "/profileInfo")
	public ResponseEntity<DAOUser> getProfileInfo(){
		return ResponseEntity.ok(authService.getUser());
	}
	
	@GetMapping(value = "/allGuest")
	public ResponseEntity<List<DAOUser>>allGuest(){
		return ResponseEntity.ok(userRepository.findAllByRole("ROLE_GUEST"));
	}

/*	@GetMapping("/count/user/all/connexion/{year}/{month}")
	public List<UserConnexionCount> usercount(@PathVariable int year , @PathVariable int month)  {
		return userRepo.usercount(year,month);
	} */

	@GetMapping("/count/user/all/connexion/{day}/{year}/{month}")
	public List<UserConnexionCount> usercount(@PathVariable int day,@PathVariable int year , @PathVariable int month){
		return userRepo.countConnexionJour(day,year,month);
	}
}
