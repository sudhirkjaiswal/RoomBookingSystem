package com.jasu.booking.service;

import java.util.List;

import com.jasu.booking.bean.User;
import com.jasu.booking.common.Response;

public interface UserService {

	User findById(String id);
	
	User findByUserId(String name);
	
	List<User> findAll();
	
	User add(User user);
	
	Response<User> update(User user);
	
	void deleteById(String id);

	void deleteAll();
	
	boolean isExist(User user);

}
