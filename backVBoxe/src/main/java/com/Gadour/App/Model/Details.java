package com.Gadour.App.Model;

import lombok.Data;

@Data
public class Details {

    private Boolean confirmed;
    private String proposedDate;
    private String idUser;
    private String name;
    private String currentDate;
    private String titleEvent;


    public Boolean getConfirmed() {
        return confirmed != null ? confirmed : Boolean.FALSE;
    }

}
