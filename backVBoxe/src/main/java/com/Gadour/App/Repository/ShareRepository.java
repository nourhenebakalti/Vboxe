package com.Gadour.App.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.Share;

@Repository
public interface ShareRepository extends MongoRepository<Share, String> {

    public void deleteById(String share_id);

}
