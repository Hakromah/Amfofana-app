package com.amfofana.school.repositories;

import com.amfofana.school.entities.Attendance;
import com.amfofana.school.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    void deleteByStudent(User student);
    List<Attendance> findByStudent(User student);
}
