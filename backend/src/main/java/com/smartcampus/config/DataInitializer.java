package com.smartcampus.config;

import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@smartcampus.com").isEmpty()) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@smartcampus.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .provider("local")
                    .build();
            userRepository.save(admin);
            log.info("Default admin created — email: admin@smartcampus.com  password: admin123");
        }
    }
}
