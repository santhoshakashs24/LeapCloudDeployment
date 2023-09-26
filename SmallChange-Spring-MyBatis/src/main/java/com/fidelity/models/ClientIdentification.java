package com.fidelity.models;

public class ClientIdentification {
	private String type;
	private String value;
	
	public ClientIdentification() {
		
	}
	public ClientIdentification(String type, String value) {
		super();
		this.type = type;
		this.value = value;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	
	
}
