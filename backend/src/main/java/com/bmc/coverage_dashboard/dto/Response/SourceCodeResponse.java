package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SourceCodeResponse {

    private String file;

    private Integer highlightLine;

    private List<SourceLineResponse> source;
}