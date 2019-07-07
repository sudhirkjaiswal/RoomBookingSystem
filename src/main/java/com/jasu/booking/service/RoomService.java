package com.jasu.booking.service;

import java.util.List;

import com.jasu.booking.bean.Room;
import com.jasu.booking.common.Response;

public interface RoomService {

	Room findById(String uid);
	
	Room add(Room Room);
	
	Response<Room> update(Room Room);
	
	void deleteById(String uid);

	List<Room> findAll();
	
	void deleteAll();
	
	boolean isExist(Room Room);

	//List<Room> findByUser(String userId);
}
