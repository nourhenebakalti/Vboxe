package com.Gadour.App.Repository;

import com.Gadour.App.Model.DAOUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.Gadour.App.Model.appointment;

import java.util.List;

public interface AppointmentRepository extends MongoRepository<appointment, String> {
    List<appointment> findByUser(DAOUser user);
}
