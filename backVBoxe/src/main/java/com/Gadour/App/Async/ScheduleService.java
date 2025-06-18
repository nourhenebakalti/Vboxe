package com.Gadour.App.Async;

import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Model.File;
import com.Gadour.App.Model.FriendList;
import com.Gadour.App.Repository.FileRepositroy;
import com.Gadour.App.Repository.FriendRepository;
import com.Gadour.App.Repository.UserRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private UserRepository userDao;
    @Autowired
    private FriendRepository friendRepo;
    @Autowired
    private FileRepositroy fileRepo;

    @Scheduled(fixedRate = 3600000) // en millisecondes
    //@Scheduled(fixedRate = 3600000) // 3600000 ms = 1 heure
    public void checkLinks() {
        System.out.println("******* le service de suppression de lien tourne maintenant: ");
        List<DAOUser> userList = userDao.findByIsTemporaryTrue();
        if (userList != null && !userList.isEmpty()){
            for (DAOUser user:userList){

                // Création d'une instance Calendar à partir de la date
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(user.getCreatedAt());

                calendar.add(Calendar.HOUR_OF_DAY, user.getDeletionHours());
                // Nouvelle date après ajout
                Date dateModifiee = calendar.getTime();

                if (dateModifiee.before(new Date())) {
                    List<FriendList> friends = friendRepo.findAllByUser2(user.getId());
                    if (friends != null && !friends.isEmpty()){
                        for (FriendList friend:friends){
                            friendRepo.delete(friend);
                        }
                    }
                    List<File> files= fileRepo.findAllByUser(new ObjectId(user.getId()));
                    if (files != null && !files.isEmpty()){
                        for (File file:files){
                            fileRepo.delete(file);
                        }
                    }
                    userDao.delete(user);
                }
            }
        }
    }
}
