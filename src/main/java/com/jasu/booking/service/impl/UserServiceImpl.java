package com.jasu.booking.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jasu.booking.service.UserService;
import com.jasu.booking.common.Response;
import com.jasu.booking.bean.User;
import com.jasu.booking.repositories.UserRepository;

@Service("UserService")
public class UserServiceImpl implements UserService{
	@Autowired
	UserRepository repository;
	
	public static final Logger logger = LoggerFactory.getLogger(UserService.class);
	@Override
	public List<User> findAll() {
		List<User> Users=new ArrayList<User>();
		repository.findAll().forEach(l->Users.add(l));
		return Users;
	}

	@Override
	public User add(User user) {
		
		user.setUid(UUID.randomUUID().toString());
		user.setPassword("booking");
		user.setLastPaswdChanged(new Date());
		return repository.save(user);
	}

	@Override
	public boolean isExist(User user) {
		return repository.findByUserId(user.getUserId())!=null;
	}

	@Override
	@Transactional
	public Response<User> update(User user) {
		User dbuser = this.findById(user.getUid());
		 
        if (dbuser == null) {
            logger.error("Unable to update. User with id {} not found.", user.getUid());
            return new Response<>(false,"Unable to update. User with id " + user.getUid() + " not found.");
        }
		
		if(user.getDescription()!=null)
			dbuser.setDescription(user.getDescription());
		if(user.getEmail()!=null)
			dbuser.setEmail(user.getEmail());
		if(user.getLastLogin()!=null)
			dbuser.setLastLogin(user.getLastLogin());
		if(user.getLastPaswdChanged()!=null)
			dbuser.setLastPaswdChanged(user.getLastPaswdChanged());
		if(user.getMobile()!=null)
			dbuser.setMobile(user.getMobile());
		if(user.getUserId()!=null)
			dbuser.setUserId(user.getUserId());
		if(user.getUserName()!=null)
			dbuser.setUserName(user.getUserName());
		if(user.getPassword()!=null){
			dbuser.setPassword(user.getPassword());
			dbuser.setLastPaswdChanged(new Date());
		}
		if(user.getRole()!=null)
			dbuser.setRole(user.getRole());
		repository.save(dbuser);
		return new Response<User>(true, dbuser);
	}

	@Override
	public void deleteById(String id) {
		repository.deleteById(id);
		
	}

	@Override
	public void deleteAll() {
		repository.deleteAll();
	}

	@Override
	public User findById(String id) {
		Optional<User> optional=repository.findById(id);
		return optional.isPresent()?optional.get():null;
	}

	@Override
	public User findByUserId(String userId) {
		return repository.findByUserId(userId);
	}
}