package com.jasu.booking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.jasu.booking.util.BookingScheduler;



@SpringBootApplication(scanBasePackages={"com.jasu.booking"})
public class ReservationApplication implements CommandLineRunner{

	@Autowired
	BookingScheduler bookingScheduler;
	
    public static void main(String[] args) throws Exception {
        SpringApplication.run(ReservationApplication.class, args);
    }

	@Override
	public void run(String... arg0) throws Exception {
		bookingScheduler.schedule();
	}
}
