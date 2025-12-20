package com.amfofana.school.repositories;

import com.amfofana.school.entities.SchoolClass;
import com.amfofana.school.entities.TeacherProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    List<SchoolClass> findByTeacher(TeacherProfile teacher);
}
