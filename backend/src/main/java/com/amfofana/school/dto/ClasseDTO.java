package com.amfofana.school.dto;

import lombok.Data;

import java.util.Set;

@Data
public class ClasseDTO {
    private Long id;
    private String name;
    private String grade;
    private UserDTO teacher;
    private Set<UserDTO> students;
}
