package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "ai_risk_analysis",
        schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiInsightsEntity {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "build_id")
    private BuildEntity build;

    @Column(
            name = "analysis_json",
            columnDefinition = "TEXT")
    private String analysisJson;

    @Column(
            name = "created_at")
    private LocalDateTime createdAt;
}