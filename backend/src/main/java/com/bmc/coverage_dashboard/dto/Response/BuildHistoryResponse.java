package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildHistoryResponse {

    private Long buildId;

    private Integer buildNumber;

    private String status;

    private Double coverage;

    private String repositoryName;

    private LocalDateTime buildTime;
}