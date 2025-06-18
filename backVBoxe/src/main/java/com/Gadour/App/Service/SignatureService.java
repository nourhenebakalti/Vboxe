package com.Gadour.App.Service;

import com.Gadour.App.Model.Signature;
import com.Gadour.App.Repository.SignatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SignatureService {
    @Autowired
    SignatureRepository signatureRepository;

    public Signature saveSignature(Signature signature) {
        return signatureRepository.save(signature);
    }


    public List<Signature> getAllSignatures() {
        return signatureRepository.findAll();
    }


    public Optional<Signature> getSignatureById(String id) {
        return signatureRepository.findById(id);
    }
    public List<Signature> getSignatureByUser(String id) {
        return signatureRepository.findByUserId(id);
    }


    public void deleteSignature(String id) {
        signatureRepository.deleteById(id);
    }


    public Signature updateSignature(String id, Signature updatedSignature) {
        Optional<Signature> optionalSignature = signatureRepository.findById(id);
        if (optionalSignature.isPresent()) {
            Signature existingSignature = optionalSignature.get();
            existingSignature.setUserId(updatedSignature.getUserId());
            existingSignature.setSignature(updatedSignature.getSignature());
            return signatureRepository.save(existingSignature);
        } else {

            return null;
        }
    }



}