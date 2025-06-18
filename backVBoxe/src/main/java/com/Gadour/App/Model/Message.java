package com.Gadour.App.Model;

import com.mongodb.lang.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.userdetails.User;

import java.util.Date;

@Document(collection = "Message")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Message {
    private static final long serialVersionUID = 1L;


    @Id
    private String id_message;
    @DBRef  // Reference to DAOUser collection
    @NonNull
    private DAOUser sender;

    @DBRef  // Reference to DAOUser collection
    @NonNull
    private DAOUser reciever;
    @NonNull
    private String subject;
    @NonNull
    private String content;
    private Date mail_date;
    private String id_signature;

}
