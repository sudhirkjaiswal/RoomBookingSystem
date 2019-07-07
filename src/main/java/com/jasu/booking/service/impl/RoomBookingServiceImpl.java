package com.jasu.booking.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jasu.booking.bean.Room;
import com.jasu.booking.bean.RoomBooking;
import com.jasu.booking.bean.User;
import com.jasu.booking.common.Response;
import com.jasu.booking.repositories.RoomBookingRepository;
import com.jasu.booking.service.RoomBookingService;

@Service("RoomBookingService")
public class RoomBookingServiceImpl implements RoomBookingService {

	@Autowired
	RoomBookingRepository repository;
	
	public static final Logger logger = LoggerFactory.getLogger(RoomBookingService.class);
	
	@Override
	public RoomBooking findById(String id) {
		Optional<RoomBooking> optional=repository.findById(id);
		return optional.isPresent()?optional.get():null;
	}

	@Override
	@Transactional
	public RoomBooking add(RoomBooking roomBooking) {
		return repository.save(roomBooking);
	}

	@Override
	@Transactional
	public Response<RoomBooking>  update(RoomBooking roomBooking) {
		
		/*RoomBooking dbroom=this.findById(roomBooking.getUid());
		if(dbroom==null){
			logger.error("Unable to update. room Module with id:"+roomBooking.getUid()+" not found.");
            return new Response<>(false,"Unable to update. room Module with id:"+roomBooking.getUid()+" not found.");
		}else{
			
			repository.save(dbroom);
			return new Response<>(true,dbroom);
		}*/
		
		repository.save(roomBooking);
		return new Response<>(true,roomBooking);
	}

	@Override
	public void deleteById(String id) {
		repository.deleteById(id);
	}

	@Override
	public List<RoomBooking> findAll() {
		List<RoomBooking> roomBookings=new ArrayList<>();
		repository.findAll().forEach(l->roomBookings.add(l));
		return roomBookings;
	}

	@Override
	public void deleteAll() {
		repository.deleteAll();
	}

	@Override
	public boolean isExist(RoomBooking roomBooking) {
		return repository.existsById(roomBooking.getUid());
	}

	@Override
	public List<RoomBooking> findByUser(String userId) {
		return repository.findByUser(new User(userId));
	}

	@Override
	public List<RoomBooking> findByRoom(String roomId) {
		return repository.findByRoom(new Room(roomId));
	}

	@Override
	public Response<?> isValidBooking(RoomBooking roomBooking) {
		
		RoomBooking booking=repository.isValidBooking(roomBooking.getRoom().getUid(), roomBooking.getBookedAt(), roomBooking.getExpireAt());
		System.out.println(booking);
		if(booking!=null){
			return new Response<>(false,"Room already booked by someone.");
		}
		/*List<RoomBooking> result=repository.findByBookedAtBetweenOrExpireAtBetween(roomBooking.getBookedAt(), roomBooking.getExpireAt(),roomBooking.getBookedAt(), roomBooking.getExpireAt());
		if(result!=null && !result.isEmpty()){
			for(RoomBooking roomBooking2:result){
				if(roomBooking2.getRoom().equals(roomBooking.getRoom())){
					return new Response<>(false,"Room already booked by someone.");
				}
			}
		}*/
		return new Response<>(true);
	}

	

}
