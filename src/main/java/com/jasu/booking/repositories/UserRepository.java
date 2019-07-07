package com.jasu.booking.repositories;

import org.springframework.data.repository.CrudRepository;

import com.jasu.booking.bean.User;

public interface UserRepository extends CrudRepository<User, String>{

	User findByUserId(String userId);


}
