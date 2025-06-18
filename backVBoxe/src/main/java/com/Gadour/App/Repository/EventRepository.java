package com.Gadour.App.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.Gadour.App.Model.Event;

public interface EventRepository extends MongoRepository<Event, String> {
	
	public List<Event> findByStartGreaterThanEqualAndEndLessThanEqual(LocalDateTime start, LocalDateTime end);
	public List<Event> findAllByAttendents (String attendant);

}
