package com.Gadour.App.Service;

import com.Gadour.App.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Gadour.App.Model.appointment;
import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Repository.AppointmentRepository;

import java.util.List;


@Service

public class AppointmentService {

        @Autowired
        private AppointmentRepository appointmentRepository;



        public void createAppointment(appointment app) {
            System.out.println(app);
           appointmentRepository.save(app);
        }
    public List<appointment> getAppointmentsByUser(DAOUser user) {
        return appointmentRepository.findByUser(user);
    }

    }


