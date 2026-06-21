package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SourceLineResponse {

    private Integer line;

    private String code;
}