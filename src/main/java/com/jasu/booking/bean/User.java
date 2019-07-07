package com.jasu.booking.bean;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name="user")
public class User implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	//@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private String uid;
	
	@Column(name="user_id", length=15 , nullable=false)
	private String userId;
	
	@Column(name="user_name", length=25, nullable=false)
	private String userName;
	
	@Column(length=15)
	private String mobile;
	
	@Column(length=50)
	private String email;
	
	@Column(name="last_paswd_changed")
	//@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date lastPaswdChanged;
	
	@Column(name="last_login")
	//@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private Date lastLogin;
	
	@Column(length=250)
	private String description;
	
	@Column(length=25, nullable=false)
	private String password;
	
	@Column(nullable=false)
	@Enumerated(EnumType.ORDINAL)
	private Role role=Role.USER;
	
	public User() {
		// TODO Auto-generated constructor stub
	}
	public User(String uid){
		this.uid=uid;
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getUid() {
		return uid;
	}
	public void setUid(String uid) {
		this.uid = uid;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	public Date getLastPaswdChanged() {
		return lastPaswdChanged;
	}
	public void setLastPaswdChanged(Date lastPaswdChanged) {
		this.lastPaswdChanged = lastPaswdChanged;
	}
	public Date getLastLogin() {
		return lastLogin;
	}
	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}

	public enum Role{
		ADMIN(1),USER(2);

		private int value;

		Role(int value) { this.value = value; }

		public int getValue() { return value; }
	}
	@Override
	public String toString() {
		return "User [userId=" + userId + ", userName=" + userName + ", uid=" + uid + ", mobile=" + mobile + ", email="
				+ email + ", lastPaswdChanged=" + lastPaswdChanged + ", lastLogin=" + lastLogin + ", description="
				+ description + "]";
	}
	
	
}
