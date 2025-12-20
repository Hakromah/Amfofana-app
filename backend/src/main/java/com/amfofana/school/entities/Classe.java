package com.amfofana.school.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Table(name = "classes")
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String grade;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnoreProperties({"teachingClasses", "enrolledClasses"})
    private User teacher;

    @ManyToMany
    @JoinTable(
            name = "classe_students",
            joinColumns = @JoinColumn(name = "classe_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "student_id", referencedColumnName = "id")
    )
    @JsonIgnoreProperties({"teachingClasses", "enrolledClasses"})
    private Set<User> students = new HashSet<>();
}
