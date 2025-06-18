package com.Gadour.App.Repository;
import com.Gadour.App.Model.Corbeille;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CorbeilleRepository extends MongoRepository<Corbeille, String> {
    Corbeille findByUserId(String userId);
}
