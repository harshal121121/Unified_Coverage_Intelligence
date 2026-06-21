def generate_summary(report):

    sonar_summary = (
        report
        .get("sonar", {})
        .get("summary", {})
    )

    return {

        "project": (

            report
            .get("project", {})
            .get("name", "")

        ),

        "languages": (

            report
            .get("project", {})
            .get("languages", [])

        ),

        "qualityGate": (

            report
            .get("summary", {})
            .get("qualityGate", "")

        ),

        "overallCoverage": (

            report
            .get("summary", {})
            .get("overallCoverage", 0)

        ),

        "overallLineCoverage": (

            report
            .get("summary", {})
            .get("overallLineCoverage", 0)

        ),

        "overallBranchCoverage": (

            report
            .get("summary", {})
            .get("overallBranchCoverage", 0)

        ),

        "javaCoverage": (

            report
            .get("java", {})
            .get("lineCoverage", 0)

        ),

        "javaBranchCoverage": (

            report
            .get("java", {})
            .get("branchCoverage", 0)

        ),

        "cppCoverage": (

            report
            .get("cpp", {})
            .get("lineCoverage", 0)

        ),

        "cppBranchCoverage": (

            report
            .get("cpp", {})
            .get("branchCoverage", 0)

        ),

        "bugs": sonar_summary.get(
            "bugs",
            0
        ),

        "vulnerabilities": sonar_summary.get(
            "vulnerabilities",
            0
        ),

        "codeSmells": sonar_summary.get(
            "codeSmells",
            0
        ),

        "securityHotspots": sonar_summary.get(
            "securityHotspots",
            0
        ),

        "securityRating": sonar_summary.get(
            "securityRating",
            ""
        ),

        "reliabilityRating": sonar_summary.get(
            "reliabilityRating",
            ""
        ),

        "maintainabilityRating": sonar_summary.get(
            "maintainabilityRating",
            ""
        ),

        "technicalDebtMinutes": sonar_summary.get(
            "technicalDebtMinutes",
            0
        ),

        "criticalIssues": sonar_summary.get(
            "criticalIssues",
            0
        ),

        "majorIssues": sonar_summary.get(
            "majorIssues",
            0
        ),

        "minorIssues": sonar_summary.get(
            "minorIssues",
            0
        )

    }