package com.bmc.coverage_dashboard.service.impl;

import com.bmc.coverage_dashboard.dto.Upload.ComplexityUploadRequest;
import com.bmc.coverage_dashboard.entity.ComplexityResultEntity;
import com.bmc.coverage_dashboard.repository.ComplexityResultRepository;
import com.bmc.coverage_dashboard.service.ComplexityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplexityServiceImpl
        implements ComplexityService {

    private final ComplexityResultRepository repository;

    @Override
    public void saveComplexityResults(
            ComplexityUploadRequest request) {

        List<ComplexityResultEntity> entities =
                request.getResults()
                        .stream()
                        .map(dto ->
                                ComplexityResultEntity.builder()
                                        .moduleName(dto.getModuleName())
                                        .filePath(dto.getFilePath())
                                        .timeComplexity(dto.getTimeComplexity())
                                        .reason(dto.getReason())
                                        .optimizationSuggestion(
                                                dto.getOptimizationSuggestion())
                                        .estimatedImprovedComplexity(
                                                dto.getEstimatedImprovedComplexity())
                                        .hash(dto.getHash())
                                        .createdAt(LocalDateTime.now())
                                        .build())
                        .toList();

        repository.saveAll(entities);
    }
    @Override
    public List<ComplexityResultEntity> getResults() {
        return repository.findAll();
    }
}