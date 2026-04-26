package com.smartcampus.notification.service;

import com.smartcampus.notification.entity.Notification;
import com.smartcampus.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    // --- Generic creator (used by all notify-* helpers below) ---
    public Notification create(String userEmail, String type, String message, String link) {
        if (userEmail == null || userEmail.isBlank()) {
            // No recipient — silently drop. Avoids breaking the calling flow
            // for old tickets that have no createdByEmail.
            return null;
        }
        Notification n = Notification.builder()
                .userEmail(userEmail)
                .type(type)
                .message(message)
                .link(link)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        return repository.save(n);
    }

    // --- Domain helpers (called by ticket / booking services) ---

    public void notifyBookingApproved(String userEmail, String resourceName, Long bookingId) {
        create(userEmail, "BOOKING_APPROVED",
                "Your booking for " + resourceName + " has been approved",
                bookingId != null ? "/bookings/" + bookingId : "/bookings");
    }

    public void notifyBookingRejected(String userEmail, String resourceName, Long bookingId, String reason) {
        String msg = "Your booking for " + resourceName + " has been rejected"
                + (reason != null && !reason.isBlank() ? " — " + reason : "");
        create(userEmail, "BOOKING_REJECTED", msg,
                bookingId != null ? "/bookings/" + bookingId : "/bookings");
    }

    public void notifyTicketStatusChanged(String userEmail, Long ticketId, String ticketTitle, String newStatus) {
        create(userEmail, "TICKET_STATUS_CHANGED",
                "Your ticket \"" + ticketTitle + "\" is now " + newStatus,
                "/ticket/" + ticketId);
    }

    public void notifyTicketComment(String userEmail, Long ticketId, String ticketTitle, String authorName) {
        create(userEmail, "TICKET_COMMENT",
                authorName + " commented on your ticket \"" + ticketTitle + "\"",
                "/ticket/" + ticketId);
    }

    // --- Queries used by the controller ---

    public List<Notification> getForUser(String email) {
        return repository.findByUserEmailOrderByCreatedAtDesc(email);
    }

    public long countUnread(String email) {
        return repository.countByUserEmailAndIsReadFalse(email);
    }

    public Notification markRead(Long id, String email) {
        Notification n = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        if (!n.getUserEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your notification");
        }
        n.setRead(true);
        return repository.save(n);
    }

    public int markAllRead(String email) {
        return repository.markAllReadForUser(email);
    }
}
