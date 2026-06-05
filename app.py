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
    send_complexity_results
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

    # ====================================
    # COMPLEXITY ANALYSIS
    # ====================================

    print("\n================================")
    print("GENERATING COMPLEXITY ANALYSIS")
    print("================================")

    complexity_output = analyze_complexity(
        repo_paths
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
        complexity_output[
            "totalFiles"
        ]
    )

    # ====================================
    # SEND TO APIS
    # ====================================

    print("\n================================")
    print("SENDING DATA TO APIS")
    print("================================")

    send_executive_api(
        executive_output
    )

    upload_complexity_json(
        complexity_output
    )

    send_complexity_results()
        

    print("\n================================")
    print("AI ENGINE COMPLETED")
    print("================================")


if __name__ == "__main__":

    main()