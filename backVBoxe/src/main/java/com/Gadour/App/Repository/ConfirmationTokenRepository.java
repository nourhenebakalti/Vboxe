package com.Gadour.App.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.ConfirmationToken;

@Repository
public interface ConfirmationTokenRepository extends MongoRepository<ConfirmationToken, String> {
	
	 ConfirmationToken findByConfirmationToken(String confirmationToken);

}
