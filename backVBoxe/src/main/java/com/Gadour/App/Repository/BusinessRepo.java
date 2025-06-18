package com.Gadour.App.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.ProfileBusiness;

@Repository
public interface BusinessRepo extends MongoRepository<ProfileBusiness, String> {

}
