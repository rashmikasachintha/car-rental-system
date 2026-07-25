package com.carrental.service.impl;

import com.carrental.dto.BookedDateRangeDTO;
import com.carrental.dto.BookingDTO;
import com.carrental.dto.BookingRequest;
import com.carrental.dto.CarDTO;
import com.carrental.entity.Booking;
import com.carrental.entity.Car;
import com.carrental.entity.User;
import com.carrental.enums.BookingStatus;
import com.carrental.enums.CarStatus;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.BookingRepository;
import com.carrental.repository.CarRepository;
import com.carrental.repository.UserRepository;
import com.carrental.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // Bookings in these states actually hold the car for their date range.
    private static final List<BookingStatus> BLOCKING_STATUSES =
            List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ONGOING);

    @Override
    public BookingDTO createBooking(BookingRequest request) {
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + request.getUserId()));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id " + request.getCarId()));

        if (car.getStatus() == CarStatus.UNDER_MAINTENANCE) {
            throw new BadRequestException("This car is currently under maintenance and cannot be booked");
        }

        // Real date-range conflict check: a car is only unavailable for dates
        // that actually overlap an existing active booking, not for every date
        // just because it has a booking on some other date range.
        boolean hasConflict = bookingRepository.findByCarId(car.getId()).stream()
                .filter(existing -> BLOCKING_STATUSES.contains(existing.getStatus()))
                .anyMatch(existing ->
                        !request.getStartDate().isAfter(existing.getEndDate()) &&
                        !existing.getStartDate().isAfter(request.getEndDate())
                );

        if (hasConflict) {
            throw new BadRequestException(
                    "This car is already booked for part or all of the selected dates. Please choose different dates."
            );
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        BigDecimal totalPrice = car.getPricePerDay().multiply(BigDecimal.valueOf(days));

        Booking booking = Booking.builder()
                .user(user)
                .car(car)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING) // admin must approve before it's confirmed
                .build();

        Booking saved = bookingRepository.save(booking);
        return toDTO(saved);
    }

    @Override
    public BookingDTO approveBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking updated = bookingRepository.save(booking);
        return toDTO(updated);
    }

    @Override
    public BookingDTO rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        Booking updated = bookingRepository.save(booking);
        return toDTO(updated);
    }

    @Override
    public BookingDTO cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + bookingId));

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return toDTO(updated);
    }

    @Override
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + id));
        return toDTO(booking);
    }

    @Override
    public List<BookingDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookedDateRangeDTO> getBookedDateRanges(Long carId) {
        return bookingRepository.findByCarId(carId).stream()
                .filter(b -> BLOCKING_STATUSES.contains(b.getStatus()))
                .map(b -> new BookedDateRangeDTO(b.getStartDate(), b.getEndDate()))
                .collect(Collectors.toList());
    }

    private BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser().getId());
        dto.setUserFullName(booking.getUser().getFullName());
        dto.setUserPhoneNumber(booking.getUser().getPhoneNumber());
        dto.setUserEmail(booking.getUser().getEmail());
        dto.setCar(modelMapper.map(booking.getCar(), CarDTO.class));
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        return dto;
    }
}
