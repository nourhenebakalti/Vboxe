package com.Gadour.App.Utils;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public abstract class MongoConfig extends AbstractMongoClientConfiguration {
 
    @Override
    protected boolean autoIndexCreation() {
        return true;
    }
 }
