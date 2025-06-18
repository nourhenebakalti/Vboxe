package com.Gadour.App.Service;

import com.Gadour.App.Model.File;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;


@Service
public class FileEncryptionService {


    @Autowired
    private RestTemplate restTemplate;


    public ByteArrayResource cryptFile(MultipartFile file)  {
        String url = "http://20.224.21.234:8080/encrypt";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        try {
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename(); // Optionally set the original file name
                }
            };
            body.add("file", resource);
        } catch (Exception e) {
            System.out.println("Error converting MultipartFile to ByteArrayResource: " + e);
            return null;
        }
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<ByteArrayResource> firstControllerResponse = null;
        try {
            firstControllerResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    ByteArrayResource.class);

        } catch (RestClientException e) {
            System.out.println("@@ Error resendToExternal exchange @@ "+e);
        }
        if (firstControllerResponse != null && firstControllerResponse.getStatusCode().is2xxSuccessful()) {
            ByteArrayResource myEntity = firstControllerResponse.getBody();
            return myEntity;

        }
        return null;
    }


    public ByteArrayResource decryptFile(File file)  {

        String url = "http://20.224.21.234:8080/decrypt";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        // Create body map
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        try {
            ByteArrayResource resource = new ByteArrayResource(file.getContent()) {
                @Override
                public String getFilename() {  // carteCin-681ce251-2b24-8003-a7f6-9656ac6f3ceb  --- apres cryptage
                    return file.getName(); // Optionally set the original file name
                }
            };

            body.add("file", resource);
        } catch (Exception e) {
            System.out.println("Error converting MultipartFile to ByteArrayResource: " + e);
            return null;
        }

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<ByteArrayResource> firstControllerResponse = null;
        try {
            firstControllerResponse = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity,
                    ByteArrayResource.class);

        } catch (RestClientException e) {
            System.out.println("@@ Error resendToExternal exchange @@ "+e);
        }
        if (firstControllerResponse != null && firstControllerResponse.getStatusCode().is2xxSuccessful()) {
            ByteArrayResource myEntity = firstControllerResponse.getBody();
            return myEntity;
        }
        return null;
    }

}
