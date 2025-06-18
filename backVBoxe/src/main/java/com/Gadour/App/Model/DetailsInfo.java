package com.Gadour.App.Model;

import lombok.Data;

import java.io.Serializable;

@Data
public class DetailsInfo implements Serializable {

    private String proposedDate;
    private String idUser;
    private String name;
}
