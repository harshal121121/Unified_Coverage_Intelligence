package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;

@Data
public class BuildDto {

    private Integer buildNumber;

    private String status;

    private String triggeredBy;

    private String commitId;

    private String commitMessage;

    private String author;

    private String startTime;

    private String endTime;

    private Integer durationSeconds;
}