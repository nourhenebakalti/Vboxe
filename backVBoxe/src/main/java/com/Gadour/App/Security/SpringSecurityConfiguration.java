package com.Gadour.App.Security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.Gadour.App.Model.ConfirmationToken;
import com.Gadour.App.Repository.ConfirmationTokenRepository;




@Configuration
@EnableWebSecurity
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter{
	
	@Autowired
	private CustomUserDetailsService userDetailsService;
	
	@Autowired
	private CustomJwtAuthenticationFilter customJwtAuthenticationFilter;
	
	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	
	ConfirmationToken confirmationToken;
	
	
	@Bean
	public PasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
	}
	
	
	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
	}
	
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception
	{
		return super.authenticationManagerBean();
	}
	
	@Override
	public void configure(HttpSecurity http) throws Exception {
		CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:4200/"));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PUT","OPTIONS","PATCH", "DELETE"));
        corsConfiguration.setAllowCredentials(true);
        //corsConfiguration.setExposedHeaders(List.of("Authorization"));
        
        // You can customize the following part based on your project, it's only a sample
        //http.authorizeRequests().antMatchers("/**").permitAll().anyRequest()
         //       .authenticated().and().csrf().disable().cors().configurationSource(request -> corsConfiguration);
		
		http
		.authorizeRequests().antMatchers("/helloadmin").hasRole("ADMIN")
		.antMatchers("/addguest","/allGuest").hasAnyRole("ADMIN","MANAGER")
		.antMatchers("/bus/add").hasAnyRole("ADMIN","MANAGER")
		.antMatchers("/hellouser").hasAnyRole("USER","ADMIN")
		.antMatchers("/authenticate","/authenticateLink", "/register","/refreshTokens","/send-email", "/confirm-account" ,
				"/file/find/**" , "/mail/find/**" , "/event/find/**","/allUsers","/currentusername","/current","/count/user/all/connexion/**","/users/nombreUsers","/users/nbrUserDepuisMoisDernier",
				"/count/extension/pdf","/count/upload/all","/count/extension/html","/count/extension/docx","/nbrFilesDepuisMoisDernier","/count/folder/all","/history/**").permitAll().anyRequest().authenticated()

		.and().exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).
		and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).
		and().csrf().disable().cors().configurationSource(request -> corsConfiguration).and().addFilterBefore(customJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
	}

}
