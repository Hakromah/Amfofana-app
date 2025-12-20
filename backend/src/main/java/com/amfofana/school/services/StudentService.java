package com.amfofana.school.services;

import com.amfofana.school.entities.*;
import com.amfofana.school.repositories.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final ClasseRepository classeRepository;
    private final AttendanceRepository attendanceRepository;
    private final ExamResultRepository examResultRepository;
    private final LearningMaterialRepository learningMaterialRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;

    public StudentService(ClasseRepository classeRepository,
                          AttendanceRepository attendanceRepository,
                          ExamResultRepository examResultRepository,
                          LearningMaterialRepository learningMaterialRepository,
                          ExamRepository examRepository,
                          UserRepository userRepository) {
        this.classeRepository = classeRepository;
        this.attendanceRepository = attendanceRepository;
        this.examResultRepository = examResultRepository;
        this.learningMaterialRepository = learningMaterialRepository;
        this.examRepository = examRepository;
        this.userRepository = userRepository;
    }

    public List<Classe> getClassesByStudent(Long studentId) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        return classeRepository.findByStudentsContains(student);
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        return attendanceRepository.findByStudent(student);
    }

    public List<ExamResult> getResultsByStudent(Long studentId) {
        User student = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        return examResultRepository.findByStudent(student).stream()
                .filter(result -> result.getStatus() == ExamResult.Status.SUBMITTED)
                .collect(Collectors.toList());
    }

    public List<Exam> getExamsByStudent(Long studentId) {
        return examRepository.findAll();
    }

    public List<LearningMaterial> getMaterialsByStudent(Long studentId) {
        List<Classe> classes = getClassesByStudent(studentId);
        return classes.stream()
                .flatMap(classe -> learningMaterialRepository.findByClasse(classe).stream())
                .collect(Collectors.toList());
    }
}
