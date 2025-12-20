package com.amfofana.school.dto;

import com.amfofana.school.entities.Role;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String userId; // Added userId
    private String name;
    private String email;
    private Role role;
    private LocalDate birthDate; // Added birthDate
    private String birthCountry; // Added birthCountry
    private String birthCity; // Added birthCity
    private String address; // Added address
    private String gender; // Added gender
    private String phoneNumber; // Added phoneNumber
    private LocalDateTime createdAt;
}
