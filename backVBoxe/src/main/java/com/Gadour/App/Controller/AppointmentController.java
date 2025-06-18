package com.Gadour.App.Controller;


import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.appointment;
import com.Gadour.App.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService  appointmentService;

    @PostMapping("/create")
    public void createAppointment(@RequestBody appointment ap) {
        // Call the service to save the appointment
        appointmentService.createAppointment(ap);
    }
    @GetMapping("/user/{userId}")
    public List<appointment> getAppointmentsByUser(@PathVariable("userId") DAOUser user) {
        return appointmentService.getAppointmentsByUser(user);
    }
}