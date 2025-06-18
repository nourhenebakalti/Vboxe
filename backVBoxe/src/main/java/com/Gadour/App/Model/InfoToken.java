package com.Gadour.App.Model;

import lombok.Data;

import java.io.Serializable;
import java.util.Map;

@Data
public class InfoToken implements Serializable {

    private Map<String, String> token;
    private boolean temporary;
}
