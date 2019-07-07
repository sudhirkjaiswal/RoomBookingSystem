package com.jasu.booking.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.jasu.booking.bean.Room;
import com.jasu.booking.bean.RoomBooking;
import com.jasu.booking.bean.User;

public interface RoomBookingRepository extends CrudRepository<RoomBooking, String>{

	List<RoomBooking> findByUser(User userId);

	List<RoomBooking> findByRoom(Room room);
	
	List<RoomBooking> findByBookedAtBetweenOrExpireAtBetween(long bookedAt,long expireAt,long bookedAt1,long expireAt1);
	
	@Query(value = "SELECT * FROM ROOM_BOOKING where room=?1 and ((BOOKED_AT between ?2 and ?3) or  (EXPIRE_AT between ?2 and ?3 ))", nativeQuery = true)
	RoomBooking isValidBooking(String roomId,long bookedAt,long expireAt);

	//List<RoomBooking> findByBookedAtGreaterThanEqualAndExpireAtLessThanEqual(long bookedAt,long expireAt);
	
	//List<RoomBooking> findByExpireAtGreaterThanAndExpireAtLessThanAndRoom(Date startDate,Date endDate,Room room);
}
