package com.Gadour.App.Model;

public class EmailMessage {

    private String to;
    private String subject;


    public EmailMessage() {
    }

    public EmailMessage(String to, String subject) {
        this.to = to;
        this.subject = subject;

    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

}
