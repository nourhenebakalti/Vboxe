package com.Gadour.App.Security;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.Gadour.App.Model.Session;
import com.Gadour.App.Repository.SessionRepo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Service
public class JwtUtil {

	private String secret;
	private int jwtExpirationInMs;
	private int refreshExpirationDateInMs;

	@Value("${jwt.secret}")
	public void setSecret(String secret) {
		this.secret = secret;
	}

	@Value("${jwt.expirationDateInMs}")
	public void setJwtExpirationInMs(int jwtExpirationInMs) {
		this.jwtExpirationInMs = jwtExpirationInMs;
	}
	
	@Value("${jwt.refreshExpirationDateInMs}")
	public void setRefreshExpirationDateInMs(int refreshExpirationDateInMs) {
		this.refreshExpirationDateInMs = refreshExpirationDateInMs;
	}
	@Autowired
	SessionRepo sessionRepo;
	
	
	@Autowired
	private CustomUserDetailsService userDetailsService;
	
	
	
	public Map<String, String> generateToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();

		Collection<? extends GrantedAuthority> roles = userDetails.getAuthorities();

		if (roles.contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
			claims.put("isAdmin", true);
		}
		if (roles.contains(new SimpleGrantedAuthority("ROLE_MANAGER"))) {
			claims.put("isManager", true);
		}
		if (roles.contains(new SimpleGrantedAuthority("ROLE_USER"))) {
			claims.put("isUser", true);
		}
		if (roles.contains(new SimpleGrantedAuthority("ROLE_GUEST"))) {
			claims.put("isGuest", true);
		}
		Map<String, String> tokens = new HashMap<>();
		String AccessToken = doGenerateToken(claims, userDetails.getUsername());
		String RefreshToken = doGenerateRefreshToken(claims, userDetails.getUsername()) ;
		tokens.put("AccessToken", AccessToken);
		tokens.put("RefreshToken", RefreshToken);
		
		return tokens;
	}

	private String doGenerateToken(Map<String, Object> claims, String subject) {
		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
				.signWith(SignatureAlgorithm.HS512, secret).compact();

	}
	
	public String doGenerateRefreshToken(Map<String, Object> claims, String subject) {

		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + refreshExpirationDateInMs))
				.signWith(SignatureAlgorithm.HS512, secret).compact();

	}

	public boolean validateToken(String authToken) {
		try {
			Jws<Claims> claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(authToken);
			
			Session session = sessionRepo.findByAccessToken(authToken);
			
			return session != null;
		} catch (SignatureException | MalformedJwtException | UnsupportedJwtException | IllegalArgumentException ex) {
			throw new BadCredentialsException("INVALID_CREDENTIALS", ex);
		} catch (ExpiredJwtException ex) {
			throw ex;
		}
	}
	
	

	

	public String getUsernameFromToken(String token) {
		Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
		return claims.getSubject();

	}

	public List<SimpleGrantedAuthority> getRolesFromToken(String token) {
		Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();

		List<SimpleGrantedAuthority> roles = new ArrayList<>();

		Boolean isAdmin = claims.get("isAdmin", Boolean.class);
		Boolean isManager = claims.get("isManager",Boolean.class);
		Boolean isUser = claims.get("isUser", Boolean.class);
		Boolean isGuest = claims.get("isGuest",Boolean.class);

		if (isAdmin != null && isAdmin) {
			roles = Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN"));
		}
		if (isManager != null && isManager) {
			roles = Arrays.asList(new SimpleGrantedAuthority("ROLE_MANAGER"));
		}

		if (isUser != null && isUser) {
			roles = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
		}
		if (isGuest != null && isGuest) {
			roles = Arrays.asList(new SimpleGrantedAuthority("ROLE_GUEST"));
		}
		return roles;

	}
	
	private HttpHeaders getHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.set("Content-Type", MediaType.APPLICATION_JSON_VALUE);
		headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
		return headers;
	}
	}
	
	

	

