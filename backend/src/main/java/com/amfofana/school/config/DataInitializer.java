package com.amfofana.school.config;

import com.amfofana.school.entities.Role;
import com.amfofana.school.entities.User;
import com.amfofana.school.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if the admin user already exists
            if (userRepository.findByEmail("admin@school.com").isEmpty()) {
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@school.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println("Admin user created: admin@school.com / admin123");
            }
        };
    }
}
