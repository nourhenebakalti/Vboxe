package com.Gadour.App.Model;

import lombok.Data;

import java.io.Serializable;

@Data
public class Collaborator implements Serializable  {
    private String id;
    private String idUser;
    private String name;
    private String email;
}
