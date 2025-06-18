package com.Gadour.App.Repository;


import com.Gadour.App.Model.HistoryConnexion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository

public interface HistoryConnexionRepository extends MongoRepository<HistoryConnexion, String> {
}
