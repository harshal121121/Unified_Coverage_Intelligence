package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "ollama_issue_analysis",
        schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OllamaIssueEntity {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY)
    @JoinColumn(
            name = "build_id")
    private BuildEntity build;

    private String issueKey;

    private String ruleKey;

    private String issueType;

    private String severity;

    private String filePath;

    private Integer lineNumber;

    @Column(columnDefinition = "TEXT")
    private String rootCause;

    @Column(columnDefinition = "TEXT")
    private String exactFix;

    @Column(columnDefinition = "TEXT")
    private String suggestedCode;

    @Column(columnDefinition = "TEXT")
    private String estimatedImpact;
}