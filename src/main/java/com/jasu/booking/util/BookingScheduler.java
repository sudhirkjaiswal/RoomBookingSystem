package com.jasu.booking.util;

import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jasu.booking.bean.RoomBooking;
import com.jasu.booking.bean.RoomBooking.Status;
import com.jasu.booking.repositories.RoomRepository;
import com.jasu.booking.service.RoomBookingService;
import com.jasu.booking.service.RoomService;

@Service("BookingScheduler")
public class BookingScheduler {

	private Timer _timer;
	
	private static long fixedInterval=1000*60;
	
	
	@Autowired
	RoomBookingService roomBookingService;
	
	@Autowired
	RoomRepository roomRepository;
	
	@Autowired
	RoomService roomService;
	
	public void scheduleAt(long period){
		if(_timer==null)
			_timer=new Timer("BookingScheduler",true);
		_timer.scheduleAtFixedRate(new Scheduler(), 1000*60, period);
	}
	
	/**
	 * Schedule.
	 */
	public void schedule(){
		this.scheduleAt(fixedInterval);
	}
	private class Scheduler extends TimerTask {

		private void bookingProcessor(RoomBooking booking) {
			System.out.println(booking);
			System.out.println(new JSONObject(booking));
			System.out.println("booking Processor started:"+booking.getUid());
			//Room  room=booking.getRoom();
			//room.setUser(booking.getUser());
			//room=roomRepository.save(room);
			
			booking.setStatus(Status.RUNNING);
			roomBookingService.update(booking);
		}

		public void expireProcessor(RoomBooking booking) {
			System.out.println("expire Processor started:"+booking.getUid());
			//Room  room=booking.getRoom();
			//room.setUser(null);
			//roomRepository.save(room);
			roomBookingService.deleteById(booking.getUid());
		}

		@Override
		public void run() {
			List<RoomBooking> bookings=roomBookingService.findAll();
			
			for(RoomBooking booking:bookings){
				try {
					//System.out.println("compare:"+new Date(booking.getBookedAt()).compareTo(new Date()));
					if(new Date(booking.getBookedAt()).compareTo(new Date())<=0 && Status.NOTRUNNING.equals(booking.getStatus())){
						System.out.println("Scheduling Now:"+booking);
						this.bookingProcessor(booking);
					}
					if(new Date(booking.getExpireAt()).compareTo(new Date())<=0 && Status.RUNNING.equals(booking.getStatus())){
						System.out.println("Expired Now:"+booking);
						this.expireProcessor(booking);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}
}
