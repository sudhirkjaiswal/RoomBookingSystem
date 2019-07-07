package com.jasu.booking.bean;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name="room_booking")
public class RoomBooking implements Serializable {
private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(unique=true, nullable=false)
	private String uid;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="user")
	private User user;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="room")
	private Room room;
	
	@Column(name="booked_at")
	//@Temporal(TemporalType.TIMESTAMP)
	private Long bookedAt;
	
	@Column(name="expire_at")
	//@Temporal(TemporalType.TIMESTAMP)
	private Long expireAt;
	
	@Column(length=250)
	private String comments;
	
	@Column(nullable=false)
	@Enumerated(EnumType.ORDINAL)
	private Status status=Status.NOTRUNNING;
	
	
	public enum Status{
		NOTRUNNING(1),RUNNING(2), FINISHED(3);

		private int value;

		Status(int value) { this.value = value; }

		public int getValue() { return value; }
	}
	public String getUid() {
		return uid;
	}


	public void setUid(String uid) {
		this.uid = uid;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Room getRoom() {
		return room;
	}

	public void setRoom(Room room) {
		this.room = room;
	}

	

	public Long getBookedAt() {
		return bookedAt;
	}

	public void setBookedAt(Long bookedAt) {
		this.bookedAt = bookedAt;
	}

	public Long getExpireAt() {
		return expireAt;
	}

	public void setExpireAt(Long expireAt) {
		this.expireAt = expireAt;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "RoomBooking [uid=" + uid + " bookedAt=" + bookedAt + ", expireAt="+ expireAt + ", comments=" + comments + ", status=" + status + "]";
	}
}
