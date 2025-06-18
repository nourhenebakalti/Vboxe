package com.Gadour.App.Controller;

import com.Gadour.App.Async.AsyncTreatment;
import com.Gadour.App.Model.AccessRequest;
import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.Folder;
import com.Gadour.App.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Random;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/coffre-fort")

public class CoffreFortController {

    private final UserRepository userRepository ;
    private final PasswordEncoder bcryptEncoder;
    private final AsyncTreatment asyncTreatment;

    @Autowired
    public CoffreFortController(UserRepository userRepository, PasswordEncoder bcryptEncoder, AsyncTreatment asyncTreatment) {
        this.userRepository = userRepository;
        this.bcryptEncoder = bcryptEncoder;
        this.asyncTreatment = asyncTreatment;
    }

    @PostMapping("/add-password")
    public ResponseEntity<Boolean> addPasswordCoffre(@RequestParam String email, @RequestParam String passwordCoffre) {
        DAOUser user = userRepository.findByUsername(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // Crypter le mot de passe du coffre-fort avant de le stocker
        String encryptedPasswordCoffre = bcryptEncoder.encode(passwordCoffre);
        user.setPasswordCoffre(encryptedPasswordCoffre);
        user.setHasPasswordCoffre(true);

        userRepository.save(user);
        return ResponseEntity.ok(true);
    }

    @PostMapping("/checkAccess")
    public ResponseEntity<Boolean> checkAccess( @RequestBody AccessRequest accessRequest){
        if(accessRequest != null && accessRequest.getEmail() != null ) {
            DAOUser user = userRepository.findByUsername(accessRequest.getEmail());
            if (user == null ) {
                return ResponseEntity.notFound().build();
            }

            if( accessRequest.getPasscodeCoffre() == null ) {
                return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
            }
            else if(  bcryptEncoder.matches(accessRequest.getPasscodeCoffre(), user.getPasswordCoffre())) {
                String code = String.format("%06d", new Random().nextInt(999999));
                user.setCode(code);
                user= userRepository.save(user);
                asyncTreatment.asyncSendCodeByMailAndSms(user);
                return new ResponseEntity<>(true, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(false,HttpStatus.FORBIDDEN);
    }

    @PostMapping("/checkSecondVerif")
    public ResponseEntity<Boolean> checkSecondVerifAccess( @RequestBody AccessRequest accessRequest){
        if(accessRequest != null && accessRequest.getEmail() != null ) {
            DAOUser user = userRepository.findByUsername(accessRequest.getEmail());
            if (user == null ) {
                return ResponseEntity.notFound().build();
            }

            if( accessRequest.getCode() == null) {
                return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
            }
            else if(user.getCode() != null && accessRequest.getCode().equals(user.getCode())) {
                user.setCode(null);
                userRepository.save(user);
                return new ResponseEntity<>(true, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(false,HttpStatus.FORBIDDEN);
    }
    @GetMapping(value = "/getUserAuth/{username}")
    public DAOUser getUserByUsername(@PathVariable String username){
        return userRepository.findByUsername(username);
    }

    @GetMapping(value = "/getHaspassword/{username}")
    public Boolean getHasPassWOrd(@PathVariable String username){

        return userRepository.findByUsername(username).getHasPasswordCoffre();
    }
}
