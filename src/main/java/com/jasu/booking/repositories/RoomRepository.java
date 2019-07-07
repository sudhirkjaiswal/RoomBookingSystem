package com.jasu.booking.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.jasu.booking.bean.Room;
import com.jasu.booking.bean.User;

public interface RoomRepository extends CrudRepository<Room, String>{

	//List<Room> findByUser(User userId);

}
