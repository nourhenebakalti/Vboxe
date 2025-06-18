package com.Gadour.App.Service;
import com.Gadour.App.Model.DAOUser;
import com.Gadour.App.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    MongoOperations mongoOperations;

    @Autowired
    PasswordEncoder bcryptEncoder;

    public List<DAOUser> findAll() {
        return userRepository.findAll();
    }

    public int nbrUser(){
        return userRepository.findAll().size();
    }

    public boolean deleteUser(String id){
        DAOUser user =  userRepository.findById(id).orElse(null);
        if (user == null){
            return false;
        }
        userRepository.deleteById(id);
        return true;
    }

    public Optional<DAOUser> findById(String id)
    {
        return userRepository.findById(id);
    }

    public DAOUser updateRoleUser(String id,String role)
    {
        DAOUser user =userRepository.findById(id).orElse(null);
        if (user != null){
            user.setRole(role);
            userRepository.save(user);
        }
        return user;
    }

    public DAOUser updatePasswordUser(String id,String password)
    {
        DAOUser user =userRepository.findById(id).orElse(null);
        if (user != null){
            // Crypter le mot de passe du coffre-fort avant de le stocker
            String encryptedPasswordCoffre = bcryptEncoder.encode(password);
            user.setPassword(encryptedPasswordCoffre);
            userRepository.save(user);
        }
        return user;
    }
    public float nbrUserDepuisMoisDernier() {
        Date date =new Date();
        Integer moisActuel = date.getMonth() + 1;
        Integer moisDernier = moisActuel - 1;
        List<DAOUser> users =userRepository.findAll();
        float count = 0;
        float nombreUsers =nbrUser();
        if(users.size()>0)
        {
            System.out.println(users );
            for (int i=0;i<users.size();i++){
                int  mois = users.get(i).getCreatedAt().getMonth() + 1;
                if (mois == moisActuel || mois ==moisDernier){
                    count ++;
                }
            }
            System.out.println(count );
            System.out.println(nombreUsers);
            return  (count/nombreUsers) * 100 ;
        }
    else {
        return 0;
        }
    }

    public DAOUser connectUserToLink(String linkCode, String linkPath){
        Optional<DAOUser> userOptional = userRepository.findByLinkCodeAndLinkPath(linkCode, linkPath);
        return userOptional.orElse(null);
    }

}



