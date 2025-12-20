package com.amfofana.school.repositories;

import com.amfofana.school.entities.Classe;
import com.amfofana.school.entities.LearningMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningMaterialRepository extends JpaRepository<LearningMaterial, Long> {
    List<LearningMaterial> findByClasse(Classe classe);
}
