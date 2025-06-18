package com.Gadour.App.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserConnexionCount {

    @Id
    private String id;
    private List<String> username;
    private List<String> name;
    private int jours;
}
