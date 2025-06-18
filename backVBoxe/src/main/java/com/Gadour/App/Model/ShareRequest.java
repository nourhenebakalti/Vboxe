package com.Gadour.App.Model;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ShareRequest implements Serializable {

    private List<Collaborator> collaboratorList;
}
