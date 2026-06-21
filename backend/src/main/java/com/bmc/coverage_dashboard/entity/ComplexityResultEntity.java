package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "complexity_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplexityResultEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String moduleName;

    @Column(columnDefinition = "TEXT")
    private String filePath;

    private String timeComplexity;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String optimizationSuggestion;

    private String estimatedImprovedComplexity;

    private String hash;

    private LocalDateTime createdAt;
}