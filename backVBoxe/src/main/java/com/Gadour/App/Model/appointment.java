package com.Gadour.App.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.util.Date;

@Document(collection = "Appointments")
public class appointment {

    @Id
    private String id;

    @DBRef
    private DAOUser user;  // Reference to the DAOUser

    private String ipAddress;  // IP address of the user
    private String addressFromIp;  // Address derived from the IP address
    private Date appointmentStartTime;  // Timestamp of when the appointment started

    public appointment() {
        this.appointmentStartTime = new Date();  // Default to current time
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public DAOUser getUser() {
        return user;
    }

    public void setUser(DAOUser user) {
        this.user = user;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getAddressFromIp() {
        return addressFromIp;
    }

    public void setAddressFromIp(String addressFromIp) {
        this.addressFromIp = addressFromIp;
    }

    public Date getAppointmentStartTime() {
        return appointmentStartTime;
    }

    public void setAppointmentStartTime(Date appointmentStartTime) {
        this.appointmentStartTime = appointmentStartTime;
    }


}
