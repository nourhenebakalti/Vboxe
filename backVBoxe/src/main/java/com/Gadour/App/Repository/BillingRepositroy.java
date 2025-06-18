package com.Gadour.App.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.Gadour.App.Model.Billing;

@Repository
public interface BillingRepositroy extends MongoRepository<Billing, String> {

}
