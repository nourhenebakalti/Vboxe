package com.Gadour.App.Model;
import lombok.Data;
import java.util.Date;

@Data
public class MessageDto {
    private String senderEmail;  // Email of the sender (from frontend)
    private String receiverEmail;  // Email of the receiver (from frontend)
    private String subject;
    private String content;
    private Date mailDate;
    private String idSignature;
}