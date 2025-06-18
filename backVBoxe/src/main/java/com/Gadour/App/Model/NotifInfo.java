package com.Gadour.App.Model;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class NotifInfo implements Serializable {

    private String notif_title;
    private String notif_msg;
    private Date notifDate;
}
