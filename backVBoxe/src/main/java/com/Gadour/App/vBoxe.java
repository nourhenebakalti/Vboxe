package com.Gadour.App;

import org.bson.types.ObjectId;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;


import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

@SpringBootApplication
@EnableWebSocket
@EnableAsync
@EnableScheduling
@EnableMongoAuditing
public class vBoxe {
	@Bean
	public Jackson2ObjectMapperBuilderCustomizer customizer()
	{
	    return builder -> builder.serializerByType(ObjectId.class,new ToStringSerializer());
	}

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
	public static void main(String[] args) {
		SpringApplication.run(vBoxe.class, args);
	}
	
	

}
