package com.Gadour.App.Repository;

import com.Gadour.App.Model.Signature;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SignatureRepository extends MongoRepository<Signature, String> {

    List<Signature> findByUserId(String id);


}
