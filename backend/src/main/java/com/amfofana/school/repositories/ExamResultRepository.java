package com.amfofana.school.repositories;

import com.amfofana.school.entities.ExamResult;
import com.amfofana.school.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Long> {
    List<ExamResult> findByStudent(User student);
    List<ExamResult> findByExam_Classe_Id(Long classId);
    List<ExamResult> findByStudent_Id(Long studentId);
}
