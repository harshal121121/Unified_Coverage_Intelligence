pipeline {
    agent any
    tools {
        maven 'maven'
        jdk   'JDK25' 
    }

    parameters {
        choice(name: 'REPO_MODE', choices: ['SEPARATE_REPOS', 'SINGLE_REPO'], description: 'Choose your repository structure')
        string(name: 'COMBINED_REPO_URL', defaultValue: '', description: 'URL for single repo')
        string(name: 'JAVA_REPO_URL', defaultValue: '', description: 'Java repo URL')
        string(name: 'CPP_REPO_URL', defaultValue: '', description: 'C++ repo URL')
        string(name: 'SCRIPT_PATH', defaultValue: '', description: 'Path to Python script')
        string(name: 'SONAR_ORG_KEY', defaultValue: '', description: 'SonarCloud Org')
        string(name: 'SONAR_PROJECT_KEY', defaultValue: '', description: 'SonarCloud Project')
    }

    environment {
        SONAR_TOKEN = credentials('SonarCloud-token')
        SONAR_PROJECT_KEY = "${params.SONAR_PROJECT_KEY}"
        SONAR_ORG_KEY = "${params.SONAR_ORG_KEY}"
        AI_ENGINE_HOST = "${AI_ENGINE_HOST}"
        AI_ENGINE_PATH = "${AI_ENGINE_PATH}"
    }

    stages {
        stage('CheckoutRepo') {
            steps {
                script {
                    if (params.REPO_MODE == 'SINGLE_REPO') {
                        echo "[INFO] Fetching combined workspace project directory..."
                        checkout scm: [$class: 'GitSCM', branches: [[name: '*/main']], userRemoteConfigs: [[url: params.COMBINED_REPO_URL]]]
                        env.JAVA_BASE = 'Java'
                        env.CPP_BASE = 'Cpp'
                    } else {
                        echo "[INFO] Fetching independent language submodules..."
                        dir('java-app') { checkout scm: [$class: 'GitSCM', branches: [[name: '**']], userRemoteConfigs: [[url: params.JAVA_REPO_URL]]] }
                        dir('cpp-app') { checkout scm: [$class: 'GitSCM', branches: [[name: '**']], userRemoteConfigs: [[url: params.CPP_REPO_URL]]] }
                        
                        env.JAVA_BASE = 'java-app/Java'
                        env.CPP_BASE = 'cpp-app'
                    }
                    env.RUN_JAVA = 'true'
                    env.RUN_CPP = 'true'
                }
            }
        }

        stage('Build & Test') {
            parallel {
                stage('Java') {
                    steps {
                        script {
                            if (env.RUN_JAVA == 'true') {
                                dir(env.JAVA_BASE) {
                                    def javaToolHome = tool name: 'JDK25', type: 'jdk'
                                    def mavenToolHome = tool name: 'maven', type: 'maven'
                                    
                                    withEnv([
                                        "JAVA_HOME=${javaToolHome}",
                                        "M2_HOME=${mavenToolHome}",
                                        "PATH+MAVEN=${mavenToolHome}\\bin",
                                        "PATH+JAVA=${javaToolHome}\\bin"
                                    ]) {
                                        bat 'mvn clean verify -T 1C -Dmaven.test.failure.ignore=true'
                                    }
                                }
                            }
                        }
                    }
                }

                stage('C++') {
                    steps {
                        script {
                            if (env.RUN_CPP == 'true') {
                                dir(env.CPP_BASE) {
                                    withEnv([
                                        "PATH+MINGW=${env.GLOBAL_MINGW_PATH}", 
                                        "PATH+CMAKE_WIN=${env.GLOBAL_CMAKE_PATH}",
                                        "PATH+PYTHON=${env.GLOBAL_PYTHON_PATH}",
                                        "PYTHONUNBUFFERED=1"
                                    ]) {
                                        bat """
                                        @echo off
                                        if not exist build mkdir build
                                        
                                        echo [INFO] Step 1: Initializing CMake with Coverage Instrumentation...
                                        cmake -B build -G "MinGW Makefiles" -DCMAKE_SH="MUTED" -DCMAKE_CXX_COMPILER=${env.GLOBAL_MINGW_PATH.replace('\\', '/')}/g++.exe -DCMAKE_C_COMPILER=${env.GLOBAL_MINGW_PATH.replace('\\', '/')}/gcc.exe -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTS=ON -DENABLE_COVERAGE=ON -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
                                        if errorlevel 1 exit /b %errorlevel%
                                        
                                        echo [INFO] Step 2: Running Compilations...
                                        cmake --build build --parallel %NUMBER_OF_PROCESSORS%
                                        if errorlevel 1 exit /b %errorlevel%

                                        echo [INFO] Step 3: Executing Test Binary Modules...
                                        if exist build del /s /q build\\*.gcda
                                        
                                        ctest --test-dir build --verbose --output-on-failure -j %NUMBER_OF_PROCESSORS% > ctest_output.log 2>&1
                                        type ctest_output.log
                                        
                                        echo [INFO] Step 4: Generating Live Cobertura XML Coverage via gcovr...
                                        gcovr -r . --object-directory build --merge-mode-functions=separate --gcov-ignore-errors=source_not_found --xml -o build/coverage.xml
                                        if errorlevel 1 (
                                            echo [WARN] Base gcovr build extraction missing root files. Forcing directory fallback filters...
                                            gcovr -r . --object-directory build --filter "Server/Headers" --filter "Client/Headers" --merge-mode-functions=separate --gcov-ignore-errors=source_not_found --xml -o build/coverage.xml
                                        )
                                        
                                        echo [INFO] Step 5: Normalizing Workspace Validation Logs...
                                        if exist build\\coverage.xml (
                                            echo [SUCCESS] Real structural coverage.xml generated successfully.
                                        ) else (
                                            echo [ERROR] coverage.xml was not created. Verify system pathing configurations.
                                            exit /b 1
                                        )
                                        """
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Sonar Scan') {
            steps {
                script {
                    def scanner = tool name: "${env.GLOBAL_SONAR_SCANNER}", type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    
                    def srcList = []
                    if (env.RUN_JAVA == 'true') { srcList << "${env.WORKSPACE}/${env.JAVA_BASE}/src/main/java" }
                    if (env.RUN_CPP == 'true')  { srcList << "${env.WORKSPACE}/${env.CPP_BASE}" }
                    
                    def srcPaths = srcList.join(',')
                    def testPaths = (env.RUN_JAVA == 'true' && fileExists("${env.JAVA_BASE}/src/test/java")) ? "${env.WORKSPACE}/${env.JAVA_BASE}/src/test/java" : ""
                    def sonarTestsProperty = !testPaths.isEmpty() ? "-Dsonar.tests=\"${testPaths}\"" : ""

                    withSonarQubeEnv('SonarCloud-token') {
                        withEnv(["SONAR_USER_HOME=${WORKSPACE}\\.sonar"]) {
                            bat """
                            "${scanner}\\bin\\sonar-scanner" ^
                            -Dsonar.token=%SONAR_TOKEN% ^
                            -Dsonar.projectKey="${SONAR_PROJECT_KEY}" ^
                            -Dsonar.organization="${SONAR_ORG_KEY}" ^
                            -Dsonar.sources="${srcPaths}" ^
                            ${sonarTestsProperty} ^
                            -Dsonar.java.binaries="**/target/classes" ^
                            -Dsonar.coverage.jacoco.xmlReportPaths="**/target/site/jacoco/jacoco.xml" ^
                            -Dsonar.cfamily.compile-commands="${env.WORKSPACE}\\${env.CPP_BASE}\\build\\compile_commands.json" ^
                            -Dsonar.cfamily.gcov.reportsPath="${env.WORKSPACE}\\${env.CPP_BASE}\\build" ^
                            -Dsonar.scanner.skipJreProvisioning=true ^
                            -Dsonar.scm.disabled=true ^
                            -Dsonar.cache.enabled=true ^
                            -Dsonar.exclusions="**/node_modules/**,**/venv/**,**/target/**,**/build/**" ^
                            -Dsonar.c.file.suffixes=".c" ^
                            -Dsonar.cpp.file.suffixes=".cpp,.h,.hpp"
                            """
                        }
                    }
                }
            }
        }

        stage('Final Reporting') {
            steps {
                script {
                    def jacocoReports = findFiles(glob: '**/target/site/jacoco/jacoco.xml')
                    def gcovrReports = findFiles(glob: '**/build/coverage.xml')
                    
                    env.JAVA_XML_PATH = jacocoReports.length > 0 ? jacocoReports[0].path : ""
                    env.CPP_XML_PATH  = gcovrReports.length > 0 ? gcovrReports[0].path : ""
                    
                    withEnv([
                        "JAVA_XML_PATH=${env.JAVA_XML_PATH}",
                        "CPP_XML_PATH=${env.CPP_XML_PATH}"
                    ]) {
                        bat "python \"${params.SCRIPT_PATH}\""
                    }
                    
                    if (fileExists('unified_master_report.json')) {
                        archiveArtifacts 'unified_master_report.json'
                        echo "[SUCCESS] Primary master dataset compiled and archived safely."
                    } 
                    if (fileExists('unified_master_report_final1.json')) {
                        archiveArtifacts 'unified_master_report_final1.json'
                    }
                }
            }
        }

        stage('Upload To Coverage Dashboard') {
            steps {
                script {
                    def targetReport = fileExists('unified_master_report.json') ? 'unified_master_report.json' : 'unified_master_report_final1.json'
                    
                    if (fileExists(targetReport)) {
                        bat """
                        echo Uploading unified report [${targetReport}] to dashboard...

                        curl -v ^
                          -X POST ^
                          -H "Content-Type: application/json" ^
                          --data-binary "@${targetReport}" ^
                          ${env.GLOBAL_DASHBOARD_URL}

                        echo Upload completed.
                        """
                    } else {
                        echo "[ERROR] Report dataset completely missing. Skipping dashboard deployment stage."
                    }
                }
            }
        }
        stage('Run AI Engine') {

            steps {

                script {

                    echo "Starting AI Engine Execution..."

                    if (env.AI_ENGINE_MODE == 'LOCAL') {

                        echo "Executing AI Engine on Local Machine"

                        bat """
                            if not exist "${env.AI_ENGINE_PATH}\\data" mkdir "${env.AI_ENGINE_PATH}\\data"

                            copy /Y unified_master_report.json "${env.AI_ENGINE_PATH}\\data\\coverage.json"

                            cd /d "${env.AI_ENGINE_PATH}"

                            call venv\\Scripts\\activate

                            python app.py
                        """

                    } else {

                        echo "Executing AI Engine on Remote VM"

                        withCredentials([
                            usernamePassword(
                                credentialsId: 'ai-engine-creds',
                                usernameVariable: 'AI_USER',
                                passwordVariable: 'AI_PASS'
                            )
                        ]) {

                            bat """
                                scp -o StrictHostKeyChecking=no ^
                                unified_master_report.json ^
                                %AI_USER%@${env.AI_ENGINE_HOST}:"${env.AI_ENGINE_PATH}/data/coverage.json"
                            """

                            def remote = [:]

                            remote.name = "AI_ENGINE"

                            remote.host = env.AI_ENGINE_HOST

                            remote.user = AI_USER

                            remote.password = AI_PASS

                            remote.allowAnyHosts = true

                            sshCommand(
                                remote: remote,
                                command: """
                                    cd /d "${env.AI_ENGINE_PATH}"
                                    call venv\\Scripts\\activate
                                    python app.py
                                """
                            )
                        }
                    }

                    echo "AI Engine Execution Completed."

                }

            }

        }

    }
}