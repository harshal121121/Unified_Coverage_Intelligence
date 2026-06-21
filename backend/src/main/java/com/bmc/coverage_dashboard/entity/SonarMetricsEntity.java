package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sonar_metrics", schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SonarMetricsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer bugs;

    private Integer vulnerabilities;

    private Integer codeSmells;

    private Integer securityHotspots;

    private String securityRating;

    private String reliabilityRating;

    private String maintainabilityRating;

    private Integer technicalDebtMinutes;

    private Integer duplicatedLines;

    private Integer duplicatedBlocks;

    private Double duplicatedLinesDensity;

    private Double criticalIssues;

    private Double majorIssues;

    private Double minorIssues;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "build_id")
    private BuildEntity build;
}