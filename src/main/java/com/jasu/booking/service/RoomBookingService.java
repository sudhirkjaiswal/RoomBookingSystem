package com.jasu.booking.service;

import java.util.List;

import com.jasu.booking.bean.RoomBooking;
import com.jasu.booking.common.Response;

public interface RoomBookingService {

	RoomBooking findById(String uid);
	
	RoomBooking add(RoomBooking roomBooking);
	
	Response<RoomBooking> update(RoomBooking roomBooking);
	
	void deleteById(String uid);

	List<RoomBooking> findAll();
	
	void deleteAll();
	
	boolean isExist(RoomBooking roomBooking);
	
	Response<?> isValidBooking(RoomBooking roomBooking);

	List<RoomBooking> findByUser(String userId);

	List<RoomBooking> findByRoom(String RoomId);
}
