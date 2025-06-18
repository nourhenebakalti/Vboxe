package com.Gadour.App.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Gadour.App.Model.Billing;
import com.Gadour.App.Repository.BillingRepositroy;
import com.Gadour.App.Service.AuthService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/bill")
public class BillingController {
	
	@Autowired
	BillingRepositroy billingRepositroy;
	
	@Autowired
	AuthService authService;
	
	@PostMapping("/add")
	
	public ResponseEntity<Billing> addBill(@RequestParam("adress") String adress){
		String id = authService.getUser().getId();
		String clientNumber = authService.getUser().getClient_number();
		String client_name = authService.getUser().getName();
		
		Billing billing = new Billing();
		billing.setClient_number(clientNumber);
		billing.setClient_name(client_name);
		billing.setCompany(authService.getUser().getCompany());
		billing.setAddress(adress);
		billing.setVille("Tunis");
		billing.setSubscription_pme(140.00);
		billing.setStrong_box(12.00);
		double totals = 140.00 + 12.00 + 12.00;
		billing.setTotal(totals);
		billing.setTva_rate(20);
		double tva = totals * 0.2;
		billing.setTva(tva);
		billing.setFinal_total(totals + tva);
		
		return new ResponseEntity<Billing>(billingRepositroy.save(billing) , HttpStatus.CREATED);
		
		
		
	}

}
