package com.Gadour.App.Model;

import com.mongodb.lang.NonNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class FileDto implements Serializable {

    @Id
    @NonNull
    private String id ;
    private String user;
    @NonNull
    private String name ;
    @NonNull
    private Long size ;

    private Date uploadtime ;

    private byte[] content ;

    private String idFolder;

    private Boolean favorite = false;

    private Boolean protect = false;

    private String category;

    private Boolean access_write = false;

    private List<DAOUser> accessed_write = new ArrayList<>() ;

    private List<String> temporal_writer = new ArrayList<>() ;

    private Date write_timer;

    private Boolean accessed_read = false ;

    List<DAOUser> Readers = new ArrayList<>();

    private Boolean deleted = false;

    @Indexed(expireAfter = "3d")
    private Date deletedTime;

    public FileDto(@NonNull String id, String user, @NonNull String name, @NonNull Long size, Date uploadtime, byte[] content, String idFolder, Boolean favorite) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.size = size;
        this.uploadtime = uploadtime;
        this.content = content;
        this.idFolder = idFolder;
        this.favorite = favorite;
    }
    public FileDto() {
        // No-arg constructor
    }
}
