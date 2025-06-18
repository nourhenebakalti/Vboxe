package com.Gadour.App.Async;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.Event;
import com.Gadour.App.Model.File;
import org.springframework.scheduling.annotation.Async;

import java.util.List;

public interface AsyncTreatment {

    void asyncSendNotifAndMailDeleteEvent(Event event, List<String> attends);
     void asyncSendNotifAndMailAndSms(Event event, List<String> attends, Event savedEvent, String user, String id);
     void asyncSendCodeByMailAndSms( DAOUser user);

    @Async
    void asyncSendCodeByMailAndSmsForProfile(DAOUser user);

    void asyncSendCodeByMailAndSmsForMoveFile(String idUser , String code);
}
