package com.Gadour.App.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.Gadour.App.Model.Favorite;
import com.Gadour.App.Model.File;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {

	void save(File selectedFile);

	
	

}
