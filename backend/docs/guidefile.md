# Setup Guide

## Prerequisites

- Java 21
- Maven 3.9+
- PostgreSQL 16+

## Clone Repository

git clone <repo-url>

cd coverage-dashboard

## Create Database

CREATE DATABASE coverage_dashboard_db;

CREATE SCHEMA coverage;

## Configure application.yml

spring:
datasource:
url: jdbc:postgresql://localhost:5432/coverage_dashboard_db
username: postgres
password: postgres

server:
port: 8081

## Run

mvn spring-boot:run

OR

Run CoverageDashboardApplication.java from IntelliJ

## Verify

http://localhost:8081/api/dashboard/summary