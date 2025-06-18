package com.Gadour.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Document(collection = "Connexions")

public class HistoryConnexion {

    @Id
    private String id_connexion ;

    private String id_client ;

    private Date Connexion_date ;
}
