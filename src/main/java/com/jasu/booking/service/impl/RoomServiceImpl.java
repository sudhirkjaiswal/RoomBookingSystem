package com.jasu.booking.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jasu.booking.service.RoomService;
import com.jasu.booking.bean.Room;
import com.jasu.booking.common.Response;
import com.jasu.booking.repositories.RoomRepository;

@Service("roomService")
public class RoomServiceImpl implements RoomService {

	@Autowired
	RoomRepository repository;
	
	public static final Logger logger = LoggerFactory.getLogger(RoomService.class);
	
	@Override
	public Room findById(String id) {
		Optional<Room> optional=repository.findById(id);
		return optional.isPresent()?optional.get():null;
	}

	@Override
	@Transactional
	public Room add(Room room) {
		room.setUid(UUID.randomUUID().toString());
		return repository.save(room);
	}

	@Override
	@Transactional
	public Response<Room>  update(Room room) {
		
		Room dbroom=this.findById(room.getUid());
		if(dbroom==null){
			logger.error("Unable to update. room Module with id:"+room.getUid()+" not found.");
            return new Response<>(false,"Unable to update. room Module with id:"+room.getUid()+" not found.");
		}else{
			if(room.getAudioConference()!=null)
				dbroom.setAudioConference(room.getAudioConference());
			if(room.getVideoConference()!=null)
				dbroom.setVideoConference(room.getVideoConference());
			if(room.getDescription()!=null)
				dbroom.setDescription(room.getDescription());
			if(room.getCapacity()!=null)
				dbroom.setCapacity(room.getCapacity());
			if(room.getLocation()!=null)
				dbroom.setLocation(room.getLocation());
			if(room.getName()!=null)
				dbroom.setName(room.getName());
			repository.save(dbroom);
			return new Response<>(true,dbroom);
		}
	}

	@Override
	public void deleteById(String id) {
		repository.deleteById(id);
	}

	@Override
	public List<Room> findAll() {
		List<Room> sites=new ArrayList<>();
		repository.findAll().forEach(l->sites.add(l));
		return sites;
	}

	@Override
	public void deleteAll() {
		repository.deleteAll();
	}

	@Override
	public boolean isExist(Room room) {
		return repository.existsById(room.getUid());
	}

	/*@Override
	public List<Room> findByUser(String userId) {
		return repository.findByUser(new User(userId));
	}*/

}
