package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;

import java.util.List;

@Data
public class ComplexityUploadRequest {

    private Integer totalFiles;

    private List<ComplexityResultDto> results;
}