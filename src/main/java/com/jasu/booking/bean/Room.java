package com.jasu.booking.bean;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name="room")
public class Room implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	//@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private String uid;
		
	@Column(nullable=false, length=50)
	private String name;
	
	@Column(length=250)
	private String description;
	
	@Column(length=50)
	private String location;
	
	@Column()
	private Integer capacity;
	
	@Column()
	private Boolean audioConference;
	
	@Column()
	private Boolean videoConference;
	
	public Room() {
	}
	
	public Room(String uid) {
		this.uid=uid;
	}


	public String getUid() {
		return uid;
	}


	public void setUid(String uid) {
		this.uid = uid;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getDescription() {
		return description;
	}


	public void setDescription(String description) {
		this.description = description;
	}


	public String getLocation() {
		return location;
	}


	public void setLocation(String location) {
		this.location = location;
	}


	public Integer getCapacity() {
		return capacity;
	}


	public void setCapacity(Integer capacity) {
		this.capacity = capacity;
	}


	public Boolean getAudioConference() {
		return audioConference;
	}


	public void setAudioConference(Boolean audioConference) {
		this.audioConference = audioConference;
	}


	public Boolean getVideoConference() {
		return videoConference;
	}


	public void setVideoConference(Boolean videoConference) {
		this.videoConference = videoConference;
	}

	@Override
	public String toString() {
		return "Room [uid=" + uid + ", name=" + name + ", description=" + description + ", location=" + location
				+ ", capacity=" + capacity + ", audioConferance=" + audioConference + ", videoConferance="
				+ videoConference+ "]";
	}
	
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof Room)
			return this.uid.equals(obj);
		else
			return false;
	}
	
}
