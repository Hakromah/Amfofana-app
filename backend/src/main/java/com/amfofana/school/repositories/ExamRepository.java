package com.amfofana.school.repositories;

import com.amfofana.school.entities.Classe;
import com.amfofana.school.entities.Exam;
import com.amfofana.school.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByClasse_Teacher(User teacher);
    List<Exam> findByClasse(Classe classe);
}
