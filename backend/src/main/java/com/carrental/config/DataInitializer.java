package com.carrental.config;

import com.carrental.entity.User;
import com.carrental.enums.CarStatus;
import com.carrental.enums.Role;
import com.carrental.repository.CarRepository;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CarRepository carRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.full-name}")
    private String adminFullName;

    @Override
    public void run(String... args) {
        seedAdmin();
        migrateStaleBookedCars();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail(adminEmail)) {
            return;
        }

        User admin = User.builder()
                .fullName(adminFullName)
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        log.info("Seeded default admin account -> email: {}", adminEmail);
    }

    /**
     * Legacy data fix: older versions of this app permanently flipped a car's
     * status to BOOKED the moment any booking was made, and never reset it.
     * Availability is now determined per-date-range at booking time instead,
     * so BOOKED is no longer a meaningful car-level status. Any car still
     * stuck on it from before gets reset to AVAILABLE automatically.
     */
    private void migrateStaleBookedCars() {
        List<com.carrental.entity.Car> staleCars = carRepository.findByStatus(CarStatus.BOOKED);
        if (staleCars.isEmpty()) {
            return;
        }

        staleCars.forEach(car -> car.setStatus(CarStatus.AVAILABLE));
        carRepository.saveAll(staleCars);
        log.info("Migrated {} car(s) stuck on legacy BOOKED status back to AVAILABLE", staleCars.size());
    }
}
