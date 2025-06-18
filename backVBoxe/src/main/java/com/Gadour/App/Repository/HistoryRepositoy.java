package com.Gadour.App.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.Gadour.App.Model.History;

public interface HistoryRepositoy extends MongoRepository<History, String> {



}
