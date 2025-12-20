package com.amfofana.school.dto;

import lombok.Data;
import java.util.List;

@Data
public class MarksDTO {
    private Long examId;
    private Long classId;
    private List<MarkRecordDTO> marks;

    @Data
    public static class MarkRecordDTO {
        private Long studentId;
        private double score;
    }
}
