package com.amfofana.school.controllers;

import com.amfofana.school.dto.AttendanceDTO;
import com.amfofana.school.dto.MarksDTO;
import com.amfofana.school.entities.*;
import com.amfofana.school.repositories.UserRepository;
import com.amfofana.school.services.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teacher")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    private final TeacherService teacherService;
    private final UserRepository userRepository;

    public TeacherController(TeacherService teacherService, UserRepository userRepository) {
        this.teacherService = teacherService;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/classes")
    public ResponseEntity<List<Classe>> getTeacherClasses(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(teacherService.getClassesByTeacher(user.getId()));
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getTeacherStudents(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(teacherService.getStudentsByTeacher(user.getId()));
    }

    @GetMapping("/classes/{classId}/students")
    @Operation(summary = "Get students by class")
    public ResponseEntity<List<User>> getStudentsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(teacherService.getStudentsByClass(classId));
    }

    @PostMapping("/attendance")
    public ResponseEntity<?> submitAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        teacherService.submitAttendance(attendanceDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/marks")
    public ResponseEntity<?> submitMarks(@RequestBody MarksDTO marksDTO) {
        teacherService.submitMarks(marksDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/exams")
    public ResponseEntity<Exam> createExam(@RequestBody Exam exam) {
        return ResponseEntity.ok(teacherService.createExam(exam));
    }

    @GetMapping("/exams")
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(teacherService.getAllExams());
    }

    @PutMapping("/exams/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @RequestBody Exam exam) {
        return ResponseEntity.ok(teacherService.updateExam(id, exam));
    }

    @DeleteMapping("/exams/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Long id) {
        teacherService.deleteExam(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/results")
    public ResponseEntity<List<ExamResult>> getResults(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(teacherService.getResultsByTeacher(user.getId()));
    }

    @PostMapping("/materials")
    public ResponseEntity<LearningMaterial> uploadMaterial(@RequestBody LearningMaterial material) {
        return ResponseEntity.ok(teacherService.uploadLearningMaterial(material));
    }

    @GetMapping("/materials")
    public ResponseEntity<List<LearningMaterial>> getMaterials(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(teacherService.getMaterialsByTeacher(user.getId()));
    }

    @DeleteMapping("/materials/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        teacherService.deleteLearningMaterial(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(teacherService.getAllSubjects());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, String> payload) {
        User user = getAuthenticatedUser(userDetails);
        return ResponseEntity.ok(teacherService.updateProfile(user.getId(), payload));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, String> payload) {
        User user = getAuthenticatedUser(userDetails);
        teacherService.changePassword(user.getId(), payload.get("currentPassword"), payload.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/results")
    public ResponseEntity<ExamResult> saveResult(@RequestBody ExamResult result) {
        return ResponseEntity.ok(teacherService.saveResult(result));
    }

    @PutMapping("/results/{id}")
    public ResponseEntity<ExamResult> updateResult(@PathVariable Long id, @RequestBody ExamResult result) {
        return ResponseEntity.ok(teacherService.updateResult(id, result));
    }

    @PostMapping("/results/submit")
    public ResponseEntity<?> submitResults(@RequestBody List<Long> resultIds) {
        teacherService.submitResults(resultIds);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/results/filter")
    public ResponseEntity<List<ExamResult>> filterResults(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(teacherService.filterResults(classId, studentId));
    }
}
