package com.Gadour.App.Model;

import lombok.Data;

import java.io.Serializable;

@Data
public class MoveEntityRequest implements Serializable {


    private String id;
    private String code;
    private Boolean inSafety;
}