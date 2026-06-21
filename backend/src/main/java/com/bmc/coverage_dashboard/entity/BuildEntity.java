package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "builds", schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer buildNumber;

    private String status;

    private String commitId;

    @Column(columnDefinition = "TEXT")
    private String commitMessage;

    private String author;

    private String triggeredBy;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer durationSeconds;

    private String qualityGate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "repository_id")
    private RepositoryEntity repository;
}