package com.jasu.booking.web;


import java.util.Date;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jasu.booking.bean.User;
import com.jasu.booking.common.Response;
import com.jasu.booking.service.RoomBookingService;
import com.jasu.booking.service.RoomService;
import com.jasu.booking.service.UserService;

@Controller
public class WebController {
	
	@Autowired
	RoomService roomService;
	
	@Autowired
	RoomBookingService roomBookingService;
	
	@Autowired
    UserService userService;
	
	@RequestMapping("/")
	public String index(HttpServletRequest request, HttpServletResponse response){
		return "index";
	}
	
	@RequestMapping(value = "/reservation/login", method = RequestMethod.GET)
	public ResponseEntity<Response<?>> authenticate(HttpServletRequest request,HttpServletResponse response) {
		if(request.getHeader("Authorization")!=null){
			JSONObject authorization=new JSONObject(request.getHeader("Authorization"));
			String userId=authorization.getString("userId");
			String passwd=authorization.getString("passwd");
			User user=userService.findByUserId(userId);
			if(user!=null && user.getPassword().equals(passwd)){
				String token=UUID.randomUUID().toString();
				request.getSession().setAttribute("token", token);
				request.getSession().setAttribute(token, user);
				response.addHeader("Set-Cookie", "token=" +token );
				user.setLastLogin(new Date());
				userService.update(user);
				return new ResponseEntity<Response<?>>(new Response<Object>(true,user), HttpStatus.OK);
			}else{
				return new ResponseEntity<Response<?>>(new Response<Object>(false,"UserID & Password are incorrect."), HttpStatus.OK);
			}
		}else{
			return new ResponseEntity<Response<?>>(new Response<Object>(false), HttpStatus.BAD_REQUEST);
		}
	}
	@RequestMapping(value = "/reservation/userDetail", method = RequestMethod.GET)
	public ResponseEntity<Response<?>> getUser(HttpServletRequest request,HttpServletResponse response) {
		String token=null;
		Cookie []cookies=request.getCookies();
		for(int i=0;i<cookies.length;i++){
			Cookie cookie=cookies[i];
			if(cookie!=null && cookie.getName().equals("token"))
				token=cookie.getValue();
		}
		if(token!=null && request.getSession().getAttribute(token)!=null){
			User user=(User)request.getSession().getAttribute(token);
			return new ResponseEntity<Response<?>>(new Response<Object>(true,user), HttpStatus.OK);
		}else{
			return new ResponseEntity<Response<?>>(new Response<Object>(false,"User not available."), HttpStatus.OK);
		}
	}
	@RequestMapping("/reservation/logout")
	public ResponseEntity<Response<?>> logout(HttpServletRequest request, HttpServletResponse response){
		request.getSession().invalidate();
		Cookie []cookies=request.getCookies();
		for(int i=0;i<cookies.length;i++){
			Cookie cookie=cookies[i];
			if(cookie!=null && cookie.getName().equals("token"))
				cookie.setMaxAge(0);
		}
		return new ResponseEntity<Response<?>>(new Response<Object>(true), HttpStatus.OK);
	}
	
	@RequestMapping(value = "/reservation/changePassword", method = RequestMethod.PUT)
	public ResponseEntity<Response<?>> changePassword(HttpServletRequest request, HttpServletResponse response,@RequestBody String rowData){
		try{
			JSONObject json=new JSONObject(rowData);
			User dbUser=userService.findById(json.getString("uid"));
			if(dbUser==null){
				return new ResponseEntity<Response<?>>(new Response<>(false, "User not found."), HttpStatus.OK);
			}else if(dbUser!=null & !dbUser.getPassword().equals(json.getString("oldPassword"))){
				return new ResponseEntity<Response<?>>(new Response<>(false, "Old Password did not match."), HttpStatus.OK);
			}else{
				User user=new User();
				user.setUid(json.getString("uid"));
				user.setPassword(json.getString("nwPassword"));
				return new ResponseEntity<Response<?>>(userService.update(user), HttpStatus.OK);
			}
		}catch(Exception e){
        	e.printStackTrace();
			return new ResponseEntity<Response<?>>(new Response<>(false,e.getMessage()), HttpStatus.OK);
        }
	}
	@RequestMapping(value = "/reservation/updateProfile", method = RequestMethod.PUT)
	public ResponseEntity<Response<?>> updateProfile(HttpServletRequest request, HttpServletResponse response,@RequestBody String rowData){
		try{
			ObjectMapper mapper = new ObjectMapper();
			User user=mapper.readValue(rowData, User.class);
			
			Cookie []cookies=request.getCookies();
			for(int i=0;i<cookies.length;i++){
				Cookie cookie=cookies[i];
				if(cookie!=null && cookie.getName().equals("token")){
					request.getSession().setAttribute(cookie.getValue(), user);
					break;
				}
			}
			return new ResponseEntity<Response<?>>(userService.update(user), HttpStatus.OK);
		}catch(Exception e){
        	e.printStackTrace();
			return new ResponseEntity<Response<?>>(new Response<>(false,e.getMessage()), HttpStatus.OK);
        }
	}
	
	/*@RequestMapping(value = "/reservation/bookroom", method = RequestMethod.PUT)
	public ResponseEntity<Response<?>> booking(HttpServletRequest request, HttpServletResponse response,@RequestBody String rowData){
		try{
			System.out.println("rowData:"+rowData);
			JSONObject booking=new JSONObject(rowData);
			boolean isNew=booking.getBoolean("isNow");
			JSONObject bookingDetails=booking.getJSONObject("bookingDetails");
			ObjectMapper mapper = new ObjectMapper();
			RoomBooking roomBooking=mapper.readValue(bookingDetails.toString(), RoomBooking.class);
			
			Response<?> res=roomBookingService.isValidBooking(roomBooking);
			if(!res.isStatus()){
				return new ResponseEntity<Response<?>>(res, HttpStatus.OK);
			}
			roomBookingService.add(roomBooking);
			/*if(isNew){
				Room  room=roomBooking.getRoom();
				room.setUser(roomBooking.getUser());
				roomService.update(room);
				roomBooking.setStatus(Status.RUNNING);
				roomBookingService.update(roomBooking);
			}*/
			/*return new ResponseEntity<Response<?>>(new Response<>(true), HttpStatus.OK);
		}catch(Exception e){
        	e.printStackTrace();
			return new ResponseEntity<Response<?>>(new Response<>(false,e.getMessage()), HttpStatus.OK);
        }
	}*/
	
	@RequestMapping("/reservation")
	public String home(HttpServletRequest request, HttpServletResponse response){
		if(request.getSession().isNew()){
			return "login";
		}else{
			String token=null;
			Cookie []cookies=request.getCookies();
			for(int i=0;i<cookies.length;i++){
				Cookie cookie=cookies[i];
				if(cookie!=null && cookie.getName().equals("token"))
					token=cookie.getValue();
			}
			if(request.getSession().getAttribute("token")==null || !request.getSession().getAttribute("token").equals(token))
				return "login";
			else if(request.getSession().getAttribute(token)==null)
				return "login";
		}
		return "main";
	}
}
