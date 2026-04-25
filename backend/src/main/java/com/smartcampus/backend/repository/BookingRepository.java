package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByRequestedByOrderByCreatedAtDesc(String requestedBy);

    List<Booking> findByStatusOrderByCreatedAtDesc(BookingStatus status);
    List<Booking> findByResourceIdOrderByCreatedAtDesc(String resourceId);
    List<Booking> findByDateOrderByCreatedAtDesc(LocalDate date);

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.date = :date " +
           "AND b.status = :status " +
           "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(@Param("resourceId") String resourceId,
                                          @Param("date") LocalDate date,
                                          @Param("startTime") LocalTime startTime,
                                          @Param("endTime") LocalTime endTime,
                                          @Param("status") BookingStatus status);
}
