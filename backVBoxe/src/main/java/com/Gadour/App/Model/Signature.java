package com.Gadour.App.Model;

import com.mongodb.lang.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Signature")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Signature {
    @Id
    private String id;
    @NonNull
    private String nom;
    @NonNull
    private String userId;



    @NonNull
    private byte[] signature;

}
