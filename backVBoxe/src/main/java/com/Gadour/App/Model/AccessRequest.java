package com.Gadour.App.Model;

import lombok.Data;

import java.io.Serializable;

@Data
public class AccessRequest implements Serializable {


    private String email;
    private String passcodeCoffre;
    private String code;
}
