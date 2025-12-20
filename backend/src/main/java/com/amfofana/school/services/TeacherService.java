package com.amfofana.school.services;

import com.amfofana.school.dto.AttendanceDTO;
import com.amfofana.school.dto.MarksDTO;
import com.amfofana.school.entities.*;
import com.amfofana.school.repositories.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    private final ClasseRepository classeRepository;
    private final AttendanceRepository attendanceRepository;
    private final ExamResultRepository examResultRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final LearningMaterialRepository learningMaterialRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherService(ClasseRepository classeRepository,
                          AttendanceRepository attendanceRepository,
                          ExamResultRepository examResultRepository,
                          UserRepository userRepository,
                          ExamRepository examRepository,
                          LearningMaterialRepository learningMaterialRepository,
                          SubjectRepository subjectRepository,
                          PasswordEncoder passwordEncoder) {
        this.classeRepository = classeRepository;
        this.attendanceRepository = attendanceRepository;
        this.examResultRepository = examResultRepository;
        this.userRepository = userRepository;
        this.examRepository = examRepository;
        this.learningMaterialRepository = learningMaterialRepository;
        this.subjectRepository = subjectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Classe> getClassesByTeacher(Long teacherId) {
        User teacher = new User();
        teacher.setId(teacherId);
        return classeRepository.findByTeacher(teacher);
    }

    public List<User> getStudentsByTeacher(Long teacherId) {
        User teacher = new User();
        teacher.setId(teacherId);
        List<Classe> classes = classeRepository.findByTeacher(teacher);
        return classes.stream()
                .flatMap(classe -> classe.getStudents().stream())
                .distinct()
                .collect(Collectors.toList());
    }

    public List<User> getStudentsByClass(Long classId) {
        Classe classe = classeRepository.findById(classId).orElseThrow(() -> new RuntimeException("Class not found"));
        return new ArrayList<>(classe.getStudents());
    }

    public void submitAttendance(AttendanceDTO attendanceDTO) {
        Classe classe = classeRepository.findById(attendanceDTO.getClassId()).orElseThrow(() -> new RuntimeException("Class not found"));
        for (AttendanceDTO.AttendanceRecordDTO record : attendanceDTO.getRecords()) {
            User student = userRepository.findById(record.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found"));
            Attendance attendance = new Attendance();
            attendance.setClasse(classe);
            attendance.setStudent(student);
            attendance.setDate(attendanceDTO.getDate());
            attendance.setStatus(record.isPresent());
            attendanceRepository.save(attendance);
        }
    }

    public void submitMarks(MarksDTO marksDTO) {
        Exam exam = examRepository.findById(marksDTO.getExamId()).orElseThrow(() -> new RuntimeException("Exam not found"));
        for (MarksDTO.MarkRecordDTO record : marksDTO.getMarks()) {
            User student = userRepository.findById(record.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found"));
            ExamResult examResult = new ExamResult();
            examResult.setExam(exam);
            examResult.setStudent(student);
            examResult.setMarks(record.getScore());
            examResultRepository.save(examResult);
        }
    }

    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam updateExam(Long id, Exam examDetails) {
        Exam exam = examRepository.findById(id).orElseThrow(() -> new RuntimeException("Exam not found"));
        exam.setName(examDetails.getName());
        exam.setClasse(examDetails.getClasse());
        exam.setSubject(examDetails.getSubject());
        exam.setDate(examDetails.getDate());
        exam.setStartTime(examDetails.getStartTime());
        exam.setEndTime(examDetails.getEndTime());
        return examRepository.save(exam);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    public List<ExamResult> getResultsByTeacher(Long teacherId) {
        List<User> students = getStudentsByTeacher(teacherId);
        return students.stream()
                .flatMap(student -> examResultRepository.findByStudent(student).stream())
                .collect(Collectors.toList());
    }

    public LearningMaterial uploadLearningMaterial(LearningMaterial material) {
        return learningMaterialRepository.save(material);
    }

    public List<LearningMaterial> getMaterialsByTeacher(Long teacherId) {
        User teacher = new User();
        teacher.setId(teacherId);
        List<Classe> classes = getClassesByTeacher(teacherId);
        return classes.stream()
                .flatMap(classe -> learningMaterialRepository.findByClasse(classe).stream())
                .collect(Collectors.toList());
    }

    public void deleteLearningMaterial(Long id) {
        learningMaterialRepository.deleteById(id);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public User updateProfile(Long userId, Map<String, String> payload) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(payload.get("name"));
        user.setEmail(payload.get("email"));
        return userRepository.save(user);
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Incorrect current password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public ExamResult saveResult(ExamResult result) {
        result.setStatus(ExamResult.Status.DRAFT);
        return examResultRepository.save(result);
    }

    public ExamResult updateResult(Long id, ExamResult resultDetails) {
        ExamResult result = examResultRepository.findById(id).orElseThrow(() -> new RuntimeException("Result not found"));
        if (result.getStatus() == ExamResult.Status.SUBMITTED) {
            throw new RuntimeException("Cannot update a submitted result");
        }
        result.setMarks(resultDetails.getMarks());
        result.setGrade(resultDetails.getGrade());
        return examResultRepository.save(result);
    }

    public void submitResults(List<Long> resultIds) {
        List<ExamResult> results = examResultRepository.findAllById(resultIds);
        for (ExamResult result : results) {
            result.setStatus(ExamResult.Status.SUBMITTED);
        }
        examResultRepository.saveAll(results);
    }

    public List<ExamResult> filterResults(Long classId, Long studentId) {
        if (classId != null) {
            return examResultRepository.findByExam_Classe_Id(classId);
        }
        if (studentId != null) {
            return examResultRepository.findByStudent_Id(studentId);
        }
        return examResultRepository.findAll();
    }
}
