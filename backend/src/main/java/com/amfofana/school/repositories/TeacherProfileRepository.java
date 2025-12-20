package com.amfofana.school.repositories;

import com.amfofana.school.entities.TeacherProfile;
import com.amfofana.school.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, Long> {
    Optional<TeacherProfile> findByUser(User user);
}
