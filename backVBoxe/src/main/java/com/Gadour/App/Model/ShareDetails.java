package com.Gadour.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareDetails  {

    @Id
    ObjectId id;
    Date createdAt ;
    ObjectId iddoc;
    String name;
    String fileName;
    String username;





}
