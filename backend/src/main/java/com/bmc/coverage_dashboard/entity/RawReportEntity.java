package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "raw_reports", schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_json",
            columnDefinition = "TEXT")
    private String reportJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "build_id")
    private BuildEntity build;
}