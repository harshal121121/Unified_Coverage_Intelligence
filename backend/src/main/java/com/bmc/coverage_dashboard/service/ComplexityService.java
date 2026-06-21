package com.bmc.coverage_dashboard.service;

import com.bmc.coverage_dashboard.dto.Upload.ComplexityUploadRequest;
import com.bmc.coverage_dashboard.entity.ComplexityResultEntity;

import java.util.List;

public interface ComplexityService {

    void saveComplexityResults(
            ComplexityUploadRequest request);

    List<ComplexityResultEntity> getResults();
}
