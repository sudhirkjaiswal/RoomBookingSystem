package com.jasu.booking.rest;

import java.util.List;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jasu.booking.bean.Room;
import com.jasu.booking.bean.RoomBooking;
import com.jasu.booking.bean.RoomBooking.Status;
import com.jasu.booking.bean.User;
import com.jasu.booking.common.Response;
import com.jasu.booking.service.RoomBookingService;
import com.jasu.booking.service.RoomService;
import com.jasu.booking.service.UserService;

@RestController
@RequestMapping(value="/api")
public class RestAPIController {

	@Autowired
    UserService userService;
	
	@Autowired
	RoomService roomService;
	
	@Autowired
	RoomBookingService roomBookingService;
	
	public static final Logger logger = LoggerFactory.getLogger(RestAPIController.class);
	 
    // -------------------Retrieve All---------------------------------------------
    @RequestMapping(value = "/{module}", method = RequestMethod.GET)
    public ResponseEntity<Response<?>> getAllData(@PathVariable("module") String module) {
    	List<?>  data=null;
    	if("user".equalsIgnoreCase(module)){
    		data=userService.findAll();
    	}else if("room".equalsIgnoreCase(module)){
    		data=roomService.findAll();
    	}else if("roomBooking".equalsIgnoreCase(module)){
    		data=roomBookingService.findAll();
    	}else{
    		return new ResponseEntity<Response<?>>(new Response<Object>(false,module+"Module not Supported."), HttpStatus.NOT_FOUND);
    	}
      
        return new ResponseEntity<Response<?>>(new Response<Object>(true,data), HttpStatus.OK);
    }
    
    //query
    @RequestMapping(value = "/{module}/query", method = RequestMethod.GET)
    public ResponseEntity<?> getByQuery(@PathVariable("module") String module,
    		@RequestParam(value="key", required=false) String key, 
    	    @RequestParam(value="value", required = false) String value) {
    	logger.info("Fetching Module:"+module);
        Object  data=null;
        if("roomBooking".equalsIgnoreCase(module)){
        	if("user".equalsIgnoreCase(key))
        		data=roomBookingService.findByUser(value);
        	else if("room".equalsIgnoreCase(key))
        		data=roomBookingService.findByRoom(value);
        	System.out.println(data);
    	}else if("room".equalsIgnoreCase(module)){
    		if("user".equalsIgnoreCase(key));
        		//data=roomService.findByUser(value);
    	}else {
    		return new ResponseEntity<Response<?>>(new Response<>(false,module+" Module not Supported."), HttpStatus.NOT_FOUND);
    	}
        if (data == null) {
            logger.error("Data with key:"+key+" value:"+value+" not found.");
            return new ResponseEntity<Response<?>>(new Response<>(false,"Data with key:"+key+" value:"+value+" not found."), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Response<?>>(new Response<>(true,data), HttpStatus.OK);
    }
 // -------------------Retrieve By ID---------------------------------------------
    @RequestMapping(value = "/{module}/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getById(@PathVariable("module") String module,@PathVariable("id") String id) {
        logger.info("Fetching Module:"+module+" data with id:", id);
        Object  data=null;
        if("user".equalsIgnoreCase(module)){
    		data=userService.findById(id);
    	}else if("room".equalsIgnoreCase(module)){
    		data=roomService.findById(id);
    	}else if("roomBooking".equalsIgnoreCase(module)){
    		data=roomBookingService.findById(id);
    	}else {
    		return new ResponseEntity<Response<?>>(new Response<>(false,module+" Module not Supported."), HttpStatus.NOT_FOUND);
    	}
        if (data == null) {
            logger.error("Data with id:"+id+" not found.");
            return new ResponseEntity<Response<?>>(new Response<>(false,"Data with id:" + id + " not found"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Response<?>>(new Response<>(true,data), HttpStatus.OK);
    } 
    // -------------------Create-------------------------------------------
    @RequestMapping(value = "/{module}", method = RequestMethod.POST,produces = {MediaType.APPLICATION_JSON_VALUE},consumes={MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> createModuleData(@PathVariable("module") String module,@RequestBody String rowData) {
        logger.info("Creating Module:"+module+" Data:"+rowData);
        try {
	        ObjectMapper mapper = new ObjectMapper();
	        if("room".equalsIgnoreCase(module)){
	        	Room room= mapper.readValue(rowData, Room.class);
	        	room=roomService.add(room);
	        	if(room==null){
	        		return new ResponseEntity<Response<?>>(new Response<Room>(false,"not created"), HttpStatus.BAD_REQUEST);
	        	}else{
	        		return new ResponseEntity<Response<?>>(new Response<Room>(true,room), HttpStatus.CREATED);
	        	}
	    	}else if("user".equalsIgnoreCase(module)){
	    		User user= mapper.readValue(rowData, User.class);
	    		user=userService.add(user);
	        	if(user==null){
	        		return new ResponseEntity<Response<?>>(new Response<User>(false,"not created"), HttpStatus.BAD_REQUEST);
	        	}else{
	        		return new ResponseEntity<Response<?>>(new Response<User>(true,user), HttpStatus.CREATED);
	        	}
	    	}else if("roomBooking".equalsIgnoreCase(module)){
	    		JSONObject booking=new JSONObject(rowData);
				boolean isNow=booking.getBoolean("isNow");
				JSONObject bookingDetails=booking.getJSONObject("bookingDetails");
				RoomBooking roomBooking=mapper.readValue(bookingDetails.toString(), RoomBooking.class);
				Response<?> res=roomBookingService.isValidBooking(roomBooking);
				if(!res.isStatus()){
					return new ResponseEntity<Response<?>>(res, HttpStatus.OK);
				}
				roomBooking=roomBookingService.add(roomBooking);
				if(isNow){
					//Room  room=roomBooking.getRoom();
					//room.setUser(roomBooking.getUser());
					//roomService.update(room);
					roomBooking.setStatus(Status.RUNNING);
					roomBookingService.update(roomBooking);
				}
				
	        	if(roomBooking==null){
	        		return new ResponseEntity<Response<?>>(new Response<RoomBooking>(false,"not created"), HttpStatus.BAD_REQUEST);
	        	}else{
	        		return new ResponseEntity<Response<?>>(new Response<RoomBooking>(true,roomBooking), HttpStatus.CREATED);
	        	}
	    	}else {
	    		return new ResponseEntity<Response<?>>(new Response<>(false,module+" Module not Supported."), HttpStatus.NOT_FOUND);
	    	}
        } catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<Response<?>>(new Response<>(false,e.getMessage()), HttpStatus.BAD_REQUEST);
		}
    }
 
    // ------------------- Update ------------------------------------------------//,@RequestParam("operation") String operation
    @RequestMapping(value = "/{module}/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateData(@PathVariable("module") String module,@PathVariable("id") String id, @RequestBody String rowData) {
        logger.info("Updating Module "+module+" with id:{}", id);
        try{
        	ObjectMapper mapper = new ObjectMapper();
	    	if("room".equalsIgnoreCase(module)){
	    		Room room=mapper.readValue(rowData, Room.class);
    			return new ResponseEntity<Response<?>>(roomService.update(room), HttpStatus.OK);
	    	}else if("user".equalsIgnoreCase(module)){
	    		User user=mapper.readValue(rowData, User.class);
    			return new ResponseEntity<Response<?>>(userService.update(user), HttpStatus.OK);
	    	}else if("roomBooking".equalsIgnoreCase(module)){
	    		RoomBooking roomBooking=mapper.readValue(rowData, RoomBooking.class);
	    		return new ResponseEntity<Response<?>>(roomBookingService.update(roomBooking), HttpStatus.OK);
	    	}else{
	    		return new ResponseEntity<Response<?>>(new Response<>(false,module+" Module not Supported."), HttpStatus.NOT_FOUND);
	    	}
        }catch(Exception e){
        	e.printStackTrace();
			return new ResponseEntity<Response<?>>(new Response<>(false,e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
 
    // ------------------- Delete-----------------------------------------
    @RequestMapping(value = "/{module}/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteData(@PathVariable("module") String module,@PathVariable("id") String id) {
        logger.info("Fetching & Deleting Module="+module+" with id:"+ id);
        try{
	        if("room".equalsIgnoreCase(module)){
	        	Room room=roomService.findById(id);
	        	if(room==null){
	    			return new ResponseEntity<Response<?>>(new Response<Object>(false,"Room not exist."), HttpStatus.NOT_FOUND);
	    		}
	        	roomService.deleteById(id);
	    	}else if("user".equalsIgnoreCase(module)){
	    		User user=userService.findById(id);
	        	if(user==null){
	    			return new ResponseEntity<Response<?>>(new Response<Object>(false,"User not exist."), HttpStatus.NOT_FOUND);
	    		}
	        	userService.deleteById(id);
	    	}else if("roomBooking".equalsIgnoreCase(module)){
	    		RoomBooking booking=roomBookingService.findById(id);
	    		if(booking==null){
	    			return new ResponseEntity<Response<?>>(new Response<Object>(false,"Booking not exist."), HttpStatus.NOT_FOUND);
	    		}
	        	roomBookingService.deleteById(id);
	    	}else{
	    		return new ResponseEntity<Response<?>>(new Response<Object>(false,module+" Module not Supported."), HttpStatus.NOT_FOUND);
	    	}
	        return new ResponseEntity<Response<?>>(new Response<Object>(true,"Successfully deleted Module "+module+" with id " + id),HttpStatus.OK);
        }catch(Exception e){
        	e.printStackTrace();
			return new ResponseEntity<Response<?>>(new Response<>(false,e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
    
    // ------------------- Delete-----------------------------------------
    @RequestMapping(value = "/{module}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteAllData(@PathVariable("module") String module) {
        logger.info("Fetching & Deleting Module="+module);
        try{
	        if("room".equalsIgnoreCase(module)){
	        	roomService.deleteAll();
	    	}else if("user".equalsIgnoreCase(module)){
	        	userService.deleteAll();
	    	}else if("roomBooking".equalsIgnoreCase(module)){
	        	roomBookingService.deleteAll();
	    	}else{
	    		return new ResponseEntity<Response<?>>(new Response<Object>(false,module+" Module not Supported."), HttpStatus.NOT_FOUND);
	    	}
	        return new ResponseEntity<Response<?>>(new Response<Object>(true,"Successfully deleted Module data "+module),HttpStatus.OK);
        }catch(Exception e){
        	e.printStackTrace();
			return new ResponseEntity<Response<?>>(new Response<>(false,e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
