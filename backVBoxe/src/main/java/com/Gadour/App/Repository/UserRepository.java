package com.Gadour.App.Repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.DAOUser;



@Repository
public interface UserRepository extends MongoRepository<DAOUser, String> {
	DAOUser findByUsername(String username);
	DAOUser findByRole(String role);
	List<DAOUser>findAllByRole(String role);
	
	Boolean existsByUsername(String username);
	DAOUser findByUsernameIgnoreCase(String username);
	Optional<DAOUser> findByLinkCodeAndLinkPath(String linkCode, String linkPath);

	List<DAOUser> findByIsTemporaryTrue();


}