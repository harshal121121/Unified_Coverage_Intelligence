def generate_summary(report):

    return {

        "overallCoverage":

            report.get(
                "overallCoverage",
                0
            ),

        "highRiskFiles":

            report.get(
                "highRiskFiles",
                []
            )
    }