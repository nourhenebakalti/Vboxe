package com.Gadour.App.Model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;

public class Billing implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String bill_id;
	
	private String client_number;
	
	private String client_name;
	
	private String company;
	
	private String address;
	
	private String ville;
	
	private double subscription_pme;
	
	private double Strong_box;
	
	private double total;
	
	private int tva_rate;
	
	private double tva;
	
	private double final_total;

	
	public String getBill_id() {
		return bill_id;
	}

	public void setBill_id(String bill_id) {
		this.bill_id = bill_id;
	}

	public String getClient_number() {
		return client_number;
	}

	public void setClient_number(String client_number) {
		this.client_number = client_number;
	}

	public String getClient_name() {
		return client_name;
	}

	public void setClient_name(String client_name) {
		this.client_name = client_name;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getVille() {
		return ville;
	}

	public void setVille(String ville) {
		this.ville = ville;
	}



	public double getTotal() {
		return total;
	}

	public void setTotal(double total) {
		this.total = total;
	}

	

	public double getTva() {
		return tva;
	}

	public void setTva(double tva) {
		this.tva = tva;
	}

	public double getFinal_total() {
		return final_total;
	}

	public void setFinal_total(double final_total) {
		this.final_total = final_total;
	}

	public double getSubscription_pme() {
		return subscription_pme;
	}

	public void setSubscription_pme(double subscription_pme) {
		this.subscription_pme = subscription_pme;
	}

	public double getStrong_box() {
		return Strong_box;
	}

	public void setStrong_box(double strong_box) {
		Strong_box = strong_box;
	}

	public int getTva_rate() {
		return tva_rate;
	}

	public void setTva_rate(int tva_rate) {
		this.tva_rate = tva_rate;
	}

}
