package com.Gadour.App.Controller;

import com.Gadour.App.Model.Signature;
import com.Gadour.App.Service.SignatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/signatures")
public class SignatureController {

    @Autowired
    private SignatureService signatureService;

    @GetMapping
    public ResponseEntity<List<Signature>> getAllSignatures() {
        List<Signature> signatures = signatureService.getAllSignatures();
        return new ResponseEntity<>(signatures, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Signature> getSignatureById(@PathVariable String id) {
        Optional<Signature> signature = signatureService.getSignatureById(id);
        return signature.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Signature> saveSignature(@RequestBody Signature signature) {
        Signature savedSignature = signatureService.saveSignature(signature);
        return new ResponseEntity<>(savedSignature, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Signature> updateSignature(@PathVariable String id, @RequestBody Signature updatedSignature) {
        Signature updated = signatureService.updateSignature(id, updatedSignature);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSignature(@PathVariable String id) {
        signatureService.deleteSignature(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Signature>> getSignatureByUserId(@PathVariable String userId) {
        List<Signature> signatures = signatureService.getSignatureByUser(userId);
        return new ResponseEntity<>(signatures, HttpStatus.OK);
    }


}
