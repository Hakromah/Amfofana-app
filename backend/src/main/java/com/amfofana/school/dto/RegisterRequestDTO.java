package com.amfofana.school.dto;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    private String name; // Corrected from username
    private String email;
    private String password;
}
