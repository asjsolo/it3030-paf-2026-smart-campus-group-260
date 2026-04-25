package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.BookingStatus;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        if (booking.getStartTime().isAfter(booking.getEndTime()) || booking.getStartTime().equals(booking.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                booking.getResourceId(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                BookingStatus.APPROVED
        );

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Resource is already booked for the requested time slot.");
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByRequestedByOrderByCreatedAtDesc(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByStatus(String status) {
        try {
            return bookingRepository.findByStatusOrderByCreatedAtDesc(BookingStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
             return bookingRepository.findAll();
        }
    }
    
    public List<Booking> getBookingsByResourceId(String resourceId) {
        return bookingRepository.findByResourceIdOrderByCreatedAtDesc(resourceId);
    }
    
    public List<Booking> getBookingsByDate(LocalDate date) {
        return bookingRepository.findByDateOrderByCreatedAtDesc(date);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    public Booking approveBooking(Long id, String reason) {
        Booking booking = getBookingById(id);
        
        if (booking.getStatus() == BookingStatus.APPROVED) {
            throw new IllegalStateException("Booking is already approved");
        }
        
        // Re-check conflict just in case
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                booking.getResourceId(),
                booking.getDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                BookingStatus.APPROVED
        );

        // Filter out itself if somehow it's in the list
        conflicts.removeIf(b -> b.getId().equals(booking.getId()));

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Cannot approve. Resource is now booked for the requested time slot.");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setDecisionReason(reason);
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id, String reason) {
        Booking booking = getBookingById(id);
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Rejection reason is required.");
        }
        booking.setStatus(BookingStatus.REJECTED);
        booking.setDecisionReason(reason);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only APPROVED or PENDING bookings can be cancelled.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
