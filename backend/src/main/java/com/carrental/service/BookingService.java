package com.carrental.service;

import com.carrental.dto.BookedDateRangeDTO;
import com.carrental.dto.BookingDTO;
import com.carrental.dto.BookingRequest;

import java.util.List;

public interface BookingService {
    BookingDTO createBooking(BookingRequest request);
    BookingDTO approveBooking(Long bookingId);
    BookingDTO rejectBooking(Long bookingId);
    BookingDTO cancelBooking(Long bookingId);
    BookingDTO getBookingById(Long id);
    List<BookingDTO> getBookingsByUser(Long userId);
    List<BookingDTO> getAllBookings();
    List<BookedDateRangeDTO> getBookedDateRanges(Long carId);
}
