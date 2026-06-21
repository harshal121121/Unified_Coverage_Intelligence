package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sonar_issues", schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SonarIssueEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String issueKey;

    private String type;

    private String severity;

    private String ruleName;

    private Integer lineNumber;

    @Column(name = "file_path")
    private String filePath;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status;

    private Integer effortMinutes;

    private String softwareQuality;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(columnDefinition = "TEXT")
    private String impact;

    @Column(columnDefinition = "TEXT")
    private String ruleDescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "build_id")
    private BuildEntity build;
}