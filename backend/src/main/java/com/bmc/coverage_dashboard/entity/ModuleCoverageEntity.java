package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "module_coverage", schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleCoverageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "module_name")
    private String moduleName;

    @Column(name = "module_path")
    private String modulePath;

    private String language;

    @Column(name = "line_coverage")
    private Double lineCoverage;

    @Column(name = "branch_coverage")
    private Double branchCoverage;

    @Column(name = "covered_lines")
    private Integer coveredLines;

    @Column(name = "missed_lines")
    private Integer missedLines;

    @Column(name = "covered_branches")
    private Integer coveredBranches;

    @Column(name = "missed_branches")
    private Integer missedBranches;

    private String status;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "heatmap_color")
    private String heatmapColor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "build_id")
    private BuildEntity build;
}