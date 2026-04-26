package com.smartcampus.notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notif_user", columnList = "userEmail"),
        @Index(name = "idx_notif_user_read", columnList = "userEmail,isRead")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Recipient's email (matches User.email)
    @Column(nullable = false)
    private String userEmail;

    // E.g. "BOOKING_APPROVED", "TICKET_STATUS_CHANGED" — kept as String so new
    // modules can add their own types without changing this enum.
    @Column(nullable = false)
    private String type;

    @Column(nullable = false, length = 500)
    private String message;

    // Optional deep-link path the UI navigates to when clicked (e.g. "/ticket/42")
    private String link;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
