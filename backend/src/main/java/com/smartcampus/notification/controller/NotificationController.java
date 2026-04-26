package com.smartcampus.notification.controller;

import com.smartcampus.notification.dto.NotificationDto;
import com.smartcampus.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getMine(@AuthenticationPrincipal String email) {
        List<NotificationDto> list = service.getForUser(email).stream()
                .map(NotificationDto::from)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(Map.of("count", service.countUnread(email)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markRead(@PathVariable Long id,
                                                    @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(NotificationDto.from(service.markRead(id, email)));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Integer>> markAllRead(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(Map.of("updated", service.markAllRead(email)));
    }
}
