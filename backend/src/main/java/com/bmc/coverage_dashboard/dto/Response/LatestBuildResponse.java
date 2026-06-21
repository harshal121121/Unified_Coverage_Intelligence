package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LatestBuildResponse {

    private Long buildId;

    private Integer buildNumber;

    private String status;

    private Double coverage;

    private String repositoryName;

    private String branch;

    private String author;

    private String commitId;

    private String commitMessage;

    private Integer durationSeconds;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}