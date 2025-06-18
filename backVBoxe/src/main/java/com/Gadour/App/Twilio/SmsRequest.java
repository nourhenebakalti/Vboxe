package com.Gadour.App.Twilio;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotBlank;

public class SmsRequest {

    @NotBlank
    private  String phoneNumber; // destination

    public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}


	public void setMessage(String message) {
		this.message = message;
	}


	@NotBlank
    private  String message;

    
    
    public String getPhoneNumber() {
		return phoneNumber;
	}


	public String getMessage() {
		return message;
	}


	@Override
    public String toString() {
        return "SmsRequest{" +
                "phoneNumber= ..." + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
