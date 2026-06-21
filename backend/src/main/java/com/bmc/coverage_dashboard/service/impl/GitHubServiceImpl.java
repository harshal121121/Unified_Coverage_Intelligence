package com.bmc.coverage_dashboard.service.impl;

import com.bmc.coverage_dashboard.service.GitHubService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class GitHubServiceImpl
        implements GitHubService {

    @Value("${github.token}")
    private String githubToken;

    private final ObjectMapper objectMapper;

    @Override
    public String getFileContent(
            String repositoryUrl,
            String branch,
            String filePath) {

        try {
            branch = branch.replace("origin/", "");

            System.out.println(
                    "Repository URL = "
                            + repositoryUrl);

            System.out.println(
                    "Branch = "
                            + branch);

            System.out.println(
                    "Original File Path = "
                            + filePath);

            String clean =
                    "Shraddha-Deshmukh2119/project-repos";

            String[] parts =
                    clean.split("/");

            if (parts.length < 2) {

                throw new RuntimeException(
                        "Invalid repository URL: "
                                + repositoryUrl);
            }

            String owner = parts[0];
            String repo = parts[1];

            String githubPath =
                    resolveGithubPath(
                            filePath);


            System.out.println(
                    "Resolved GitHub Path = "
                            + githubPath);

            String apiUrl =
                    "https://api.github.com/repos/"
                            + owner
                            + "/"
                            + repo
                            + "/contents/"
                            + githubPath
                            + "?ref="
                            + branch;

            System.out.println(
                    "GitHub API URL = "
                            + apiUrl);

            HttpHeaders headers =
                    new HttpHeaders();

            headers.setBearerAuth(
                    githubToken);

            headers.set(
                    "Accept",
                    "application/vnd.github+json");

            HttpEntity<Void> entity =
                    new HttpEntity<>(headers);

            RestTemplate restTemplate =
                    new RestTemplate();

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            apiUrl,
                            HttpMethod.GET,
                            entity,
                            String.class);

            JsonNode json =
                    objectMapper.readTree(
                            response.getBody());

            String encoded =
                    json.get("content")
                            .asText()
                            .replace("\n", "");

            return new String(
                    Base64.getDecoder()
                            .decode(encoded),
                    StandardCharsets.UTF_8);

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to fetch source code",
                    e);
        }
    }

    private String resolveGithubPath(
            String filePath) {

        /*
         * C++ Mapping
         *
         * JSON:
         * cpp-app/Client/Headers/Admin.cpp
         *
         * GitHub:
         * Cpp-repo/Client/Headers/Admin.cpp
         */
        if (filePath.startsWith("cpp-app/")) {

            return filePath.replaceFirst(
                    "cpp-app/",
                    "Cpp-repo/");
        }

        /*
         * Java Mapping
         *
         * JSON:
         * java-app/...
         * src/main/java/com/ecoomerce/...
         *
         * GitHub:
         * java-repo/Java/JavaFullstackEcommerce/src/main/java/com/ecoomerce/...
         */
        if (filePath.startsWith("java-app/")) {
            return filePath.replaceFirst(
                    "java-app/",
                    "java-repo/");
        }

        if (filePath.startsWith(
                "src/main/java/")) {

            return "java-repo/Java/JavaFullstackEcommerce/"
                    + filePath;
        }

        /*
         * Default fallback
         */
        return filePath;
    }
}