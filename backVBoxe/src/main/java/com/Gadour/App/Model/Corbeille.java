package com.Gadour.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "Corbeille")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Corbeille {
    @Id
    private String id;

    private String userId;
    private List<Message> deletedMessages = new ArrayList<>();

    public void addDeletedMessage(Message message) {
        this.deletedMessages.add(message);
    }
}
