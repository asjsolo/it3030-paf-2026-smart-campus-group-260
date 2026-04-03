package com.smartcampus.service;

import com.smartcampus.dto.UserInfo;
import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserInfo getUserInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDto(user);
    }

    public List<UserInfo> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserInfo updateRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(Role.valueOf(roleName.toUpperCase()));
        userRepository.save(user);
        return toDto(user);
    }

    private UserInfo toDto(User user) {
        return new UserInfo(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPicture(),
                user.getRole().name()
        );
    }
}
