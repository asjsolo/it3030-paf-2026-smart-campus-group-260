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
        if (booking.getResourceType() == null || booking.getResourceType().trim().isEmpty()) {
            throw new IllegalArgumentException("Resource type is required");
        }

        if (booking.getDate() != null && booking.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Booking date cannot be in the past");
        }

        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required");
        }

        if (booking.getStartTime().isAfter(booking.getEndTime()) || booking.getStartTime().equals(booking.getEndTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        if (booking.getPurpose() == null || booking.getPurpose().trim().isEmpty()) {
            throw new IllegalArgumentException("Purpose is required");
        }

        if (booking.getExpectedAttendees() == null || booking.getExpectedAttendees() <= 0) {
            throw new IllegalArgumentException("Expected attendees must be greater than 0");
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
            throw new IllegalStateException("This time slot is already booked for this resource.");
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

    public java.util.Map<String, Object> getAnalytics() {
        List<Booking> all = bookingRepository.findAll();
        long total = all.size();
        long pending = all.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long approved = all.stream().filter(b -> b.getStatus() == BookingStatus.APPROVED).count();
        long rejected = all.stream().filter(b -> b.getStatus() == BookingStatus.REJECTED).count();
        long cancelled = all.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
        long todayBookings = all.stream().filter(b -> b.getDate() != null && b.getDate().equals(LocalDate.now())).count();

        String topResource = "N/A";
        if (!all.isEmpty()) {
            topResource = all.stream()
                .filter(b -> b.getResourceId() != null)
                .collect(java.util.stream.Collectors.groupingBy(Booking::getResourceId, java.util.stream.Collectors.counting()))
                .entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse("N/A");
        }

        String peakTime = "N/A";
        if (!all.isEmpty()) {
            peakTime = all.stream()
                .filter(b -> b.getStartTime() != null && b.getEndTime() != null)
                .collect(java.util.stream.Collectors.groupingBy(
                        b -> b.getStartTime().toString() + " - " + b.getEndTime().toString(),
                        java.util.stream.Collectors.counting()))
                .entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse("N/A");
        }

        return java.util.Map.of(
            "total", total,
            "pending", pending,
            "approved", approved,
            "rejected", rejected,
            "cancelled", cancelled,
            "topResource", topResource,
            "peakTime", peakTime,
            "todayBookings", todayBookings
        );
    }
}
