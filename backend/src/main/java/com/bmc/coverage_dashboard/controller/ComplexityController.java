package com.bmc.coverage_dashboard.controller;

import com.bmc.coverage_dashboard.dto.Upload.ComplexityUploadRequest;
import com.bmc.coverage_dashboard.entity.ComplexityResultEntity;
import com.bmc.coverage_dashboard.service.ComplexityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complexity")
@RequiredArgsConstructor
public class ComplexityController {

    private final ComplexityService complexityService;


    @PostMapping("/upload")
    public ResponseEntity<String> uploadComplexityResults(
            @RequestBody ComplexityUploadRequest request) {

        complexityService.saveComplexityResults(request);

        return ResponseEntity.ok(
                "Complexity results uploaded successfully");
    }
    @GetMapping("/results")
    public ResponseEntity<List<ComplexityResultEntity>> getResults() {
        return ResponseEntity.ok(complexityService.getResults());
    }

}