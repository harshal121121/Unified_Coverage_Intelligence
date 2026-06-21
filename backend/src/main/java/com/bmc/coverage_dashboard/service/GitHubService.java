package com.bmc.coverage_dashboard.service;

public interface GitHubService {

    String getFileContent(
            String repositoryUrl,
            String branch,
            String filePath);
}