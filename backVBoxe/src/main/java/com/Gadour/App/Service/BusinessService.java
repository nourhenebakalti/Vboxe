package com.Gadour.App.Service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Gadour.App.Model.ProfileBusiness;
import com.Gadour.App.Repository.BusinessRepo;

@Service
public class BusinessService {
	
	@Autowired
	BusinessRepo businessRepo ;
	
	public void checkKbis (ProfileBusiness[] profileBusinesses) {
		for (ProfileBusiness profileBusiness : profileBusinesses) {
			Date currentDate = new Date() ;
			
			//long diff = currentDate.getTime() - profileBusiness.getKbisDate().getTime();
			
			if ( currentDate.getTime() - profileBusiness.getKbisDate().getTime() == 7889400000L ) {
				profileBusiness.setKbis(null);
				
			}else if (currentDate.getTime() - profileBusiness.getKbisDate().getTime() == 6048000000L) {
				System.out.println("Your Kbiss is about to expire in 2 weeks ! ");
				
			}
		}
		
		
	}
}
