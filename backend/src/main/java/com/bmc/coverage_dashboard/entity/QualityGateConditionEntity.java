package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quality_gate_conditions",
        schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QualityGateConditionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metric;

    private String operator;

    private Double threshold;

    @Column(name = "actual_value")
    private Double actualValue;

    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "build_id")
    private BuildEntity build;
}