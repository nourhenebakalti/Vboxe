package com.Gadour.App.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.Session;

@Repository
public interface SessionRepo extends MongoRepository<Session, String> {

	Session findByAccessToken(String AccessToken);
	Session findByResfreshToken(String RefreshToken);
	Session deleteByAccessToken (String AccessToken);
	
}
