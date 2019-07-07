package com.jasu.booking.common;

public class Response<T> {
	private boolean status;
	private String message;
	private T data;
	
	public Response(){
		
	}
	
	public Response(boolean status){
		this.status=status;
	}
	
	public Response(boolean status,String message){
		this.status=status;
		this.message=message;
	}
	public Response(boolean status,T data){
		this.status=status;
		this.data=data;
	}
	public Response(boolean status,String message,T data){
		this.status=status;
		this.message=message;
		this.data=data;
	}

	
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public T getData() {
		return data;
	}
	public void setData(T data) {
		this.data = data;
	}
	
}
