package com.smartcampus.controller;

import com.smartcampus.dto.UserInfo;
import com.smartcampus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * Returns the currently authenticated user's info.
     * Accessible by USER and ADMIN.
     */
    @GetMapping("/auth/me")
    public ResponseEntity<UserInfo> getCurrentUser(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(userService.getUserInfo(email));
    }

    /**
     * Admin: list all users.
     */
    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserInfo>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Admin: change a user's role.
     */
    @PutMapping("/admin/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserInfo> updateUserRole(@PathVariable Long id,
                                                   @RequestParam String role) {
        return ResponseEntity.ok(userService.updateRole(id, role));
    }
}
