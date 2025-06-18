package com.Gadour.App.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.PrivateRoom;

@Repository
public interface RoomRepo extends MongoRepository<PrivateRoom, String> {

}
