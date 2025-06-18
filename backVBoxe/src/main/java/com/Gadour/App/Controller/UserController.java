package com.Gadour.App.Controller;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    private List<DAOUser> Users;

    @GetMapping("/user")
    public List<DAOUser> getEmployees() {
        return userService.findAll();
    }

    @GetMapping("/role/{id}")
    public DAOUser updateRole(@PathVariable String id, @RequestParam(name = "role") String role) {
        return userService.updateRoleUser(id,role);
    }

    @GetMapping("/update/password/{id}")
    public DAOUser updatePassword(@PathVariable String id, @RequestParam(name = "password") String password) {
        return userService.updatePasswordUser(id,password);
    }
    @GetMapping("/nombreUsers")
    public Integer getNombreUsers() {
        return userService.nbrUser();
    }
    @DeleteMapping("/delete/{id}")
    public boolean deleteUser(@PathVariable String id) {
        return userService.deleteUser(id);
    }
    @GetMapping("/nbrUserDepuisMoisDernier")
    public float  nbrUserDepuisMoisDernier() {
        return userService.nbrUserDepuisMoisDernier();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findUserById(@PathVariable String id) {
        try {
            Optional<DAOUser> user = userService.findById(id);

            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + id);
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
        }
    }


}

