package com.amfofana.school.dto;

import lombok.Data;

@Data
public class ReportDTO {
    private long totalStudents;
    private long totalTeachers;
    private long totalAdmins;
    private long totalClasses;
    private long totalExams;
    private long totalSubjects;
}
