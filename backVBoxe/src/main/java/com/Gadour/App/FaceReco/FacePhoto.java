package com.Gadour.App.FaceReco;

import org.springframework.util.Base64Utils;

import com.Gadour.App.Model.DAOUser;

import java.util.List;

public class FacePhoto {
    private List<RecognizedFace> faces;
    private List<DAOUser> users;
    private byte[] photo;

    public FacePhoto(List<RecognizedFace> faces, List<DAOUser> users, byte[] photo) {
        this.faces = faces;
        this.users = users;
        this.photo = photo;
    }

    public List<RecognizedFace> getFaces() {
        return faces;
    }

    public void setFaces(List<RecognizedFace> faces) {
        this.faces = faces;
    }

    

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

	public List<DAOUser> getUsers() {
		return users;
	}

	public void setUsers(List<DAOUser> users) {
		this.users = users;
	}

}