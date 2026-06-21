package com.bmc.coverage_dashboard.config;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {

                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://10.33.7.18:5173",
                                "http://10.33.7.185:5173",
                                "http://10.33.7.185",
                                "http://localhost:5173"
                        )
                        .allowedMethods("*");
            }
        };
    }
}