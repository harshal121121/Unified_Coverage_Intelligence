from services.json_parser import (
    load_report
)

from engine.summary_engine import (
    generate_summary
)

from services.git_service import (
    clone_or_pull_repositories
)

from engine.repo_context_engine import (
    build_repo_context
)

from analysis.ai_analysis import (
    generate_ai_analysis
)

from analysis.complexity_analysis import (
    analyze_complexity
)

from services.output_writer import (
    save_executive_output,
    save_complexity_output
)

from services.api_service import (
    send_executive_api,
    upload_complexity_json,
    send_complexity_results,
    upload_bug_analysis
)

from analysis.bug_analysis import (
    analyze_issues
)

from services.output_writer import (
    save_bug_output
)




def main():

    # ====================================
    # LOAD COVERAGE REPORT
    # ====================================

    print("\n================================")
    print("LOADING COVERAGE REPORT")
    print("================================")

    report = load_report()

    summary = generate_summary(
        report
    )

    print("\nCoverage Report Loaded")

    # ====================================
    # CLONE / PULL REPOSITORIES
    # ====================================

    print("\n================================")
    print("SYNCING REPOSITORIES")
    print("================================")

    repo_paths = clone_or_pull_repositories()

    # ====================================
    # BUILD / UPDATE RAG CONTEXT
    # ====================================

    print("\n================================")
    print("UPDATING CHROMADB")
    print("================================")

    for repo_path in repo_paths:

        build_repo_context(
            repo_path
        )

    # ====================================
    # EXECUTIVE ANALYSIS
    # ====================================

    print("\n================================")
    print("GENERATING EXECUTIVE ANALYSIS")
    print("================================")

    executive_output = generate_ai_analysis(
        summary
    )

    print("\n================================")
    print("GENERATING ISSUE REMEDIATION")
    print("================================")

    bug_output = analyze_issues(
    report,
    repo_paths
)

    # ====================================
    # COMPLEXITY ANALYSIS
    # ====================================

    print("\n================================")
    print("GENERATING COMPLEXITY ANALYSIS")
    print("================================")

    complexity_output = analyze_complexity(
        repo_paths
    )
    print(
        f"\nTotal Methods Processed: "
        f"{complexity_output['totalMethods']}"
)

    # ====================================
    # SAVE OUTPUT FILES
    # ====================================

    print("\n================================")
    print("SAVING OUTPUT FILES")
    print("================================")

    save_executive_output(
        executive_output
    )

    save_complexity_output(
        complexity_output
    )

    print(

        "\nComplexity output saved successfully."
)

    final_bug_output = bug_output

    print(

        f"\nBug Issues Generated: "

        f"{final_bug_output['totalIssues']}"
)

    save_bug_output(
        final_bug_output
    )

    # ====================================
    # DISPLAY RESULTS
    # ====================================

    print("\n================================")
    print("EXECUTIVE ANALYSIS GENERATED")
    print("================================")

    print(
        executive_output
    )

    print("\n================================")
    print("COMPLEXITY MODULES GENERATED")
    print("================================")

    print(

        f"Total Methods: "

        f"{complexity_output['totalMethods']}"
)

    # ====================================
    # SEND TO APIS
    # ====================================

    print("\n================================")
    print("SENDING DATA TO APIS")
    print("================================")

    # Executive Dashboard API
    send_executive_api(
        executive_output
    )

    # Bug Analysis API
    upload_bug_analysis(
        final_bug_output
    )

    print("\n================================")
    print("BUG PAYLOAD SENT TO API")
    print("================================")


    print(
        json.dumps(
            final_bug_output,
            indent=4
        )
    )


    

    # Complexity Upload API
    upload_complexity_json(
        complexity_output
    )

    print(
        "\n================================"
    )
    print(
        "COMPLEXITY PAYLOAD SENT TO API"
    )
    print(
        "================================"
    )

    import json

    print(

        json.dumps(

            complexity_output,

            indent=4,

            ensure_ascii=False

        )
    )

    # Complexity Results API
    send_complexity_results()

    
        

    print("\n================================")
    print("AI ENGINE COMPLETED")
    print("================================")


if __name__ == "__main__":

    main()