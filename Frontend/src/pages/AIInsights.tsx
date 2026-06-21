import { useEffect, useState, useRef, useMemo } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import SeverityBadge from "../components/common/SeverityBadge";
import IssueTypeBadge from "../components/common/IssueTypeBadge";
import { getAiMetricsData, getComplexityAnalysis, getIssueSourceCode } from "../api/dashboardApi";
import {
  Brain,
  Shield,
  Timer,
  Lightbulb,
  Zap,
  AlertTriangle,
  AlertCircle,
  Terminal,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Cpu,
  RefreshCw,
  Code2,
  Clock,
  Target,
  ListFilter,
  BookOpen,
  HelpCircle,
  Sparkles,
  Copy,
  Check
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface ComplexityModule {
  moduleName: string;
  filePath: string;
  timeComplexity: string;
  reason: string;
  optimizationSuggestion: string;
  estimatedImprovedComplexity: string;
  hash?: string;
  id?: string;
}

// User-provided exact Ollama Issues dataset to populate the dashboard if the backend returns empty or is offline.
const MOCK_OLLAMA_ISSUES = [
  {
    estimatedImpact: "MINOR",
    exactFix: "[{\"description\":\"Remove the blank code that is not needed.\",\"codeSnippet\":\"\"}]",
    file: "cpp-app/Server/Headers/Thread.h",
    issueKey: "AZ5v-Sr2J_wIMnvDJnpT",
    line: 24,
    rootCause: "An empty statement was found on line 24 of the file 'cpp-app/Server/Headers/Thread.h'.",
    rule: "cpp:S1116",
    severity: "MINOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The issue has a CRITICAL severity and could lead to major failures during runtime or incorrect application behavior without proper initialization of the 'id' field.",
    exactFix: "@Data\n@AllArgsConstructor(onConstructor_ = false)\npublic static final class ProductResponse...",
    file: "cpp-app/Server/Headers/Thread.h",
    issueKey: "AZ5v-Sr2J_wIMnvDJnpU",
    line: 24,
    rootCause: "The uninitialized field 'id' in the constructor of the ProductResponse class is not initialized, which could lead to undefined behavior or errors when accessing this member variable.",
    rule: "cpp:S2107",
    severity: "CRITICAL",
    suggestedCode: "\n@Data\n@Builder\n@NoArgsConstructor\npublic abstract static class ProductResponse {\nprivate Integer id;\n// ... other members remain unchanged, ensure to initialize each member in constructors if necessary.",
    type: "BUG"
  },
  {
    estimatedImpact: "The issue has a CRITICAL severity and could lead to major failures during runtime or incorrect application behavior without proper initialization of the 'id' field.",
    exactFix: "@Data\n@AllArgsConstructor(onConstructor_ = false)\npublic static final class ProductResponse...",
    file: "cpp-app/Client/Headers/Admin.h",
    issueKey: "AZ5WO0GGBnT8UsONytH1",
    line: 19,
    rootCause: "The uninitialized field 'id' in the constructor of the ProductResponse class is not initialized, which could lead to undefined behavior or errors when accessing this member variable.",
    rule: "cpp:S2107",
    severity: "CRITICAL",
    suggestedCode: "\n@Data\n@Builder\n@NoArgsConstructor\npublic abstract static class ProductResponse {\nprivate Integer id;\n// ... other members remain unchanged, ensure to initialize each member in constructors if necessary.",
    type: "BUG"
  },
  {
    estimatedImpact: "The issue has a CRITICAL severity and could lead to major failures during runtime or incorrect application behavior without proper initialization of the 'id' field.",
    exactFix: "@Data\n@AllArgsConstructor(onConstructor_ = false)\npublic static final class ProductResponse...",
    file: "cpp-app/Client/Headers/Client.h",
    issueKey: "AZ5WO0GPBnT8UsONytH5",
    line: 12,
    rootCause: "The uninitialized field 'id' in the constructor of the ProductResponse class is not initialized, which could lead to undefined behavior or errors when accessing this member variable.",
    rule: "cpp:S2107",
    severity: "CRITICAL",
    suggestedCode: "\n@Data\n@Builder\n@NoArgsConstructor\npublic abstract static class ProductResponse {\nprivate Integer id;\n// ... other members remain unchanged, ensure to initialize each member in constructors if necessary.",
    type: "BUG"
  },
  {
    estimatedImpact: "The issue has a CRITICAL severity and could lead to major failures during runtime or incorrect application behavior without proper initialization of the 'id' field.",
    exactFix: "@Data\n@AllArgsConstructor(onConstructor_ = false)\npublic static final class ProductResponse...",
    file: "cpp-app/Client/Headers/Customer.h",
    issueKey: "AZ5WO0GYBnT8UsONytH9",
    line: 12,
    rootCause: "The uninitialized field 'id' in the constructor of the ProductResponse class is not initialized, which could lead to undefined behavior or errors when accessing this member variable.",
    rule: "cpp:S2107",
    severity: "CRITICAL",
    suggestedCode: "\n@Data\n@Builder\n@NoArgsConstructor\npublic abstract static class ProductResponse {\nprivate Integer id;\n// ... other members remain unchanged, ensure to initialize each member in constructors if necessary.",
    type: "BUG"
  },
  {
    estimatedImpact: "The issue has a CRITICAL severity and could lead to major failures during runtime or incorrect application behavior without proper initialization of the 'id' field.",
    exactFix: "@Data\n@AllArgsConstructor(onConstructor_ = false)\npublic static final class ProductResponse...",
    file: "cpp-app/Client/Headers/Employee.h",
    issueKey: "AZ5WO0HPBnT8UsONytIj",
    line: 10,
    rootCause: "The uninitialized field 'id' in the constructor of the ProductResponse class is not initialized, which could lead to undefined behavior or errors when accessing this member variable.",
    rule: "cpp:S2107",
    severity: "CRITICAL",
    suggestedCode: "\n@Data\n@Builder\n@NoArgsConstructor\npublic abstract static class ProductResponse {\nprivate Integer id;\n// ... other members remain unchanged, ensure to initialize each member in constructors if necessary.",
    type: "BUG"
  },
  {
    estimatedImpact: "The issue has a CRITICAL severity and could lead to major failures during runtime or incorrect application behavior without proper initialization of the 'id' field.",
    exactFix: "@Data\n@AllArgsConstructor(onConstructor_ = false)\npublic static final class ProductResponse...",
    file: "cpp-app/tests/common/MockClient.h",
    issueKey: "AZ5WO0BhBnT8UsONytHK",
    line: 13,
    rootCause: "The uninitialized field 'id' in the constructor of the ProductResponse class is not initialized, which could lead to undefined behavior or errors when accessing this member variable.",
    rule: "cpp:S2107",
    severity: "CRITICAL",
    suggestedCode: "\n@Data\n@Builder\n@NoArgsConstructor\npublic abstract static class ProductResponse {\nprivate Integer id;\n// ... other members remain unchanged, ensure to initialize each member in constructors if necessary.",
    type: "BUG"
  },
  {
    estimatedImpact: "The issue has a CRITICAL severity and could lead to major failures during runtime or incorrect application behavior without proper initialization of the 'id' field.",
    exactFix: "@Data\n@AllArgsConstructor(onConstructor_ = false)\npublic static final class ProductResponse...",
    file: "cpp-app/tests/testClient/Headers/test_Customer.cpp",
    issueKey: "AZ5WO0B2BnT8UsONytHO",
    line: 10,
    rootCause: "The uninitialized field 'id' in the constructor of the ProductResponse class is not initialized, which could lead to undefined behavior or errors when accessing this member variable.",
    rule: "cpp:S2107",
    severity: "CRITICAL",
    suggestedCode: "\n@Data\n@Builder\n@NoArgsConstructor\npublic abstract static class ProductResponse {\nprivate Integer id;\n// ... other members remain unchanged, ensure to initialize each member in constructors if necessary.",
    type: "BUG"
  },
  {
    estimatedImpact: "The issue has a CRITICAL severity and could lead to major failures during runtime or incorrect application behavior without proper initialization of the 'id' field.",
    exactFix: "@Data\n@AllArgsConstructor(onConstructor_ = false)\npublic static final class ProductResponse...",
    file: "cpp-app/tests/testClient/Headers/test_Employee.cpp",
    issueKey: "AZ5WO0CnBnT8UsONytHa",
    line: 10,
    rootCause: "The uninitialized field 'id' in the constructor of the ProductResponse class is not initialized, which could lead to undefined behavior or errors when accessing this member variable.",
    rule: "cpp:S2107",
    severity: "CRITICAL",
    suggestedCode: "\n@Data\n@Builder\n@NoArgsConstructor\npublic abstract static class ProductResponse {\nprivate Integer id;\n// ... other members remain unchanged, ensure to initialize each member in constructors if necessary.",
    type: "BUG"
  },
  {
    estimatedImpact: "null",
    exactFix: "@Override\n@Bean(name = \"userDetailsService\")\npublic UserDetailsService userDetailsService() {\n    String username = ",
    file: "cpp-app/Client/Headers/Admin.cpp",
    issueKey: "AZ5WO0GrBnT8UsONytIN",
    line: 109,
    rootCause: "Commented out sections of the code that should not be commented.",
    rule: "cpp:S125",
    severity: "MAJOR",
    suggestedCode: "null",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "null",
    exactFix: "@Override\n@Bean(name = \"userDetailsService\")\npublic UserDetailsService userDetailsService() {\n    String username = ",
    file: "cpp-app/Client/Headers/Goods.h",
    issueKey: "AZ5WO0HHBnT8UsONytIf",
    line: 15,
    rootCause: "Commented out sections of the code that should not be commented.",
    rule: "cpp:S125",
    severity: "MAJOR",
    suggestedCode: "null",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "null",
    exactFix: "@Override\n@Bean(name = \"userDetailsService\")\npublic UserDetailsService userDetailsService() {\n    String username = ",
    file: "cpp-app/Client/Headers/Person.h",
    issueKey: "AZ5WO0G0BnT8UsONytIV",
    line: 20,
    rootCause: "Commented out sections of the code that should not be commented.",
    rule: "cpp:S125",
    severity: "MAJOR",
    suggestedCode: "null",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "null",
    exactFix: "@Override\n@Bean(name = \"userDetailsService\")\npublic UserDetailsService userDetailsService() {\n    String username = ",
    file: "cpp-app/Client/Headers/Person.h",
    issueKey: "AZ5WO0G0BnT8UsONytIW",
    line: 22,
    rootCause: "Commented out sections of the code that should not be commented.",
    rule: "cpp:S125",
    severity: "MAJOR",
    suggestedCode: "null",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "null",
    exactFix: "@Override\n@Bean(name = \"userDetailsService\")\npublic UserDetailsService userDetailsService() {\n    String username = ",
    file: "cpp-app/Server/Headers/Thread.cpp",
    issueKey: "AZ5WO0EeBnT8UsONytHn",
    line: 108,
    rootCause: "Commented out sections of the code that should not be commented.",
    rule: "cpp:S125",
    severity: "MAJOR",
    suggestedCode: "null",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "null",
    exactFix: "@Override\n@Bean(name = \"userDetailsService\")\npublic UserDetailsService userDetailsService() {\n    String username = ",
    file: "cpp-app/Server/Headers/Admin.cpp",
    issueKey: "AZ5MA0EpFcSfan2eVyNM",
    line: 75,
    rootCause: "Commented out sections of the code that should not be commented.",
    rule: "cpp:S125",
    severity: "MAJOR",
    suggestedCode: "null",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "null",
    exactFix: "@Override\n@Bean(name = \"userDetailsService\")\npublic UserDetailsService userDetailsService() {\n    String username = ",
    file: "cpp-app/Server/Headers/Server.cpp",
    issueKey: "AZ5MA0FoFcSfan2eVyOC",
    line: 156,
    rootCause: "Commented out sections of the code that should not be commented.",
    rule: "cpp:S125",
    severity: "MAJOR",
    suggestedCode: "null",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "null",
    exactFix: "@Override\n@Bean(name = \"userDetailsService\")\npublic UserDetailsService userDetailsService() {\n    String username = ",
    file: "cpp-app/Server/Headers/Server.h",
    issueKey: "AZ5MA0B_FcSfan2eVyMF",
    line: 42,
    rootCause: "Commented out sections of the code that should not be commented.",
    rule: "cpp:S125",
    severity: "MAJOR",
    suggestedCode: "null",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Admin.cpp",
    issueKey: "AZ5WO0GrBnT8UsONytID",
    line: 255,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Cash.h",
    issueKey: "AZ5WO0GgBnT8UsONytIB",
    line: 26,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Person.cpp",
    issueKey: "AZ5WO0HbBnT8UsONytIq",
    line: 36,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Person.cpp",
    issueKey: "AZ5WO0HbBnT8UsONytIt",
    line: 62,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Person.cpp",
    issueKey: "AZ5WO0HbBnT8UsONytIw",
    line: 90,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Person.cpp",
    issueKey: "AZ5WO0HbBnT8UsONytI0",
    line: 112,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Person.cpp",
    issueKey: "AZ5WO0HbBnT8UsONytI2",
    line: 168,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Person.cpp",
    issueKey: "AZ5WO0HbBnT8UsONytI9",
    line: 214,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "The severity is MAJOR because const-correctness can lead to undefined behavior if not respected. Ensuring methods only operate on immutable objects where they don't need to prevents accidental state changes, making the code more maintainable and less prone to bugs.",
    exactFix: "Declare this method as a constant by adding 'const' before its return type and after any reference or pointer parameter, ensuring that member variables are also marked with 'mutable'.",
    file: "cpp-app/Client/Headers/Person.cpp",
    issueKey: "AZ5WO0HbBnT8UsONytJA",
    line: 266,
    rootCause: "This function should be declared 'const' because it does not mutate the object.",
    rule: "cpp:S5817",
    severity: "MAJOR",
    suggestedCode: "",
    type: "CODE_SMELL"
  },
  {
    estimatedImpact: "Minor impact - Improves readability and maintainability of the code. Not expected to affect functionality.",
    exactFix: "Declare variables on separate lines for clarity, following Java coding conventions as demonstrated below:",
    file: "cpp-app/Server/Headers/Employee.cpp",
    issueKey: "AZ5MA0BvFcSfan2eVyL4",
    line: 99,
    rootCause: "Variables 'id' and 'name' are declared in the same line within a class.",
    rule: "cpp:S1659",
    severity: "MINOR",
    suggestedCode: "\npublic final String name;\nprivate Integer id;",
    type: "CODE_SMELL"
  }
];

// Helper functions for standardizing API responses
const getInsightPart = (
  insightObj: any,
  lang: "java" | "cpp",
  defaultTitle: string,
  defaultRisk: "Low" | "Medium" | "High"
) => {
  if (!insightObj) return { title: defaultTitle, text: "Insight analysis not available.", risk: defaultRisk };
  if (typeof insightObj === "string") return { title: defaultTitle, text: insightObj, risk: defaultRisk };
  
  const key = Object.keys(insightObj).find((k) => {
    const lowerKey = k.toLowerCase();
    if (lang === "java") {
      return lowerKey.includes("java");
    } else if (lang === "cpp") {
      return lowerKey.includes("cpp") || lowerKey.includes("c++");
    }
    return false;
  });

  if (key && insightObj[key]) {
    const val = insightObj[key];
    if (typeof val === "string") {
      let risk = defaultRisk;
      const lowerText = val.toLowerCase();
      if (lowerText.includes("high") || lowerText.includes("vulnerabilit") || lowerText.includes("critical") || lowerText.includes("only 25.29%")) {
        risk = "High";
      } else if (lowerText.includes("medium") || lowerText.includes("warn") || lowerText.includes("pressing") || lowerText.includes("elevated")) {
        risk = "Medium";
      } else if (lowerText.includes("low") || lowerText.includes("robust") || lowerText.includes("safe") || lowerText.includes("comprehensive")) {
        risk = "Low";
      }
      return { title: defaultTitle, text: val, risk };
    }
    
    let risk = val.risk || val.riskLevel || defaultRisk;
    const textVal = val.text || val.insightText || val.insight || "No summary details.";
    const lowerText = textVal.toLowerCase();
    if (!val.risk && !val.riskLevel) {
      if (lowerText.includes("high") || lowerText.includes("vulnerabilit") || lowerText.includes("critical") || lowerText.includes("only 25.29%")) {
        risk = "High";
      } else if (lowerText.includes("medium") || lowerText.includes("warn") || lowerText.includes("pressing") || lowerText.includes("elevated")) {
        risk = "Medium";
      } else if (lowerText.includes("low") || lowerText.includes("robust") || lowerText.includes("safe") || lowerText.includes("comprehensive")) {
        risk = "Low";
      }
    }
    return {
      title: val.title || defaultTitle,
      text: textVal,
      risk: risk,
    };
  }

  return { title: defaultTitle, text: "No details provided.", risk: defaultRisk };
};

const getStandardType = (type: string) => {
  if (!type) return "";
  const t = type.toUpperCase().replace(/\s+|_|-/g, "");
  if (t === "BUG") return "BUG";
  if (t === "VULNERABILITY") return "VULNERABILITY";
  if (t.includes("SMELL")) return "CODE_SMELL";
  return type;
};

const getRiskBadgeClass = (risk: string) => {
  const r = risk?.toLowerCase() || '';
  if (r.includes('high') || r.includes('critical')) return 'g-badge-red';
  if (r.includes('medium') || r.includes('major')) return 'g-badge-yellow';
  return 'g-badge-green';
};

const getSecurityColor = (risk: string) => {
  const r = risk?.toLowerCase() || '';
  if (r.includes('high') || r.includes('critical')) return { text: '#d93025', bg: 'var(--google-red-50)', border: 'var(--google-red-100)' };
  if (r.includes('medium') || r.includes('major')) return { text: '#ff6b00', bg: 'var(--bmc-orange-light)', border: 'var(--bmc-orange-border)' };
  return { text: '#1e8e3e', bg: 'var(--google-green-50)', border: 'var(--google-green-100)' };
};

const cleanStringValue = (val: any) => {
  if (!val || val === "null" || val === null) return "";
  let s = String(val).trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }
  return s.replace(/\\n/g, '\n').replace(/\\"/g, '"');
};

export default function AIInsights() {
  const [insightData, setInsightData] = useState<any>(null);
  const [issuesList, setIssuesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "explorer" | "complexity">("overview");

  // Time Complexity State
  const [complexityList, setComplexityList] = useState<ComplexityModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<ComplexityModule | null>(null);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");
  const [complexityFilter, setComplexityFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");

  // Issue Explorer Search, Filters & Pagination State
  const [issueSearchQuery, setIssueSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Split-pane active issue states (same as CodeHealth config)
  const [selectedIssueKey, setSelectedIssueKey] = useState<string | null>(null);
  const [selectedIssueDetails, setSelectedIssueDetails] = useState<any>(null);
  const [selectedIssueSource, setSelectedIssueSource] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [shouldScrollToCode, setShouldScrollToCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ref for the code viewer scrollable container
  const codeViewerRef = useRef<HTMLDivElement>(null);

  const getLanguage = (filePath: string) => {
    if (!filePath) return "Other";
    const path = filePath.toLowerCase();
    if (path.endsWith(".java")) return "Java";
    if (path.endsWith(".cpp") || path.endsWith(".cc") || path.endsWith(".cxx") || path.endsWith(".h") || path.endsWith(".hpp")) return "C++";
    return "Other";
  };

  // Fetch initial dashboard data, issues, and complexity
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [insightsRes, issuesRes, complexityRes] = await Promise.allSettled([
        getAiMetricsData(),
        api.get("/api/dashboard/ollama-issues"),
        getComplexityAnalysis()
      ]);

      // 1. AI Insights
      if (insightsRes.status === "fulfilled") {
        setInsightData(insightsRes.value.data);
      } else {
        console.error("Failed to load AI Insights:", insightsRes.reason);
      }

      // 2. Ollama Issues (fallback to user's dataset if empty or fails)
      let listData: any[] = [];
      if (issuesRes.status === "fulfilled" && Array.isArray(issuesRes.value.data) && issuesRes.value.data.length > 0) {
        listData = issuesRes.value.data;
      } else {
        listData = MOCK_OLLAMA_ISSUES;
      }
      setIssuesList(listData);

      // Auto-select first issue in explorer
      if (listData.length > 0) {
        setSelectedIssueKey(listData[0].issueKey);
      }

      // 3. Complexity List
      if (complexityRes.status === "fulfilled") {
        const compData = complexityRes.value.data;
        let rawList: ComplexityModule[] = [];
        if (Array.isArray(compData)) {
          rawList = compData;
        } else if (compData && Array.isArray(compData.results)) {
          rawList = compData.results;
        } else if (compData && Array.isArray(compData.data)) {
          rawList = compData.data;
        }

        const uniqueModulesMap = new Map<string, ComplexityModule>();
        rawList.forEach((mod) => {
          const originalComplexity = mod.timeComplexity || "";
          const isUnknown = !originalComplexity || originalComplexity.toLowerCase().includes("unknown");

          if (!isUnknown && mod.moduleName && !uniqueModulesMap.has(mod.moduleName)) {
            let cleanComplexity = originalComplexity;
            const match = originalComplexity.match(/O\s*\([^)]+\)/i);

            if (match) {
              cleanComplexity = match[0]
                .replace(/o/i, 'O')
                .replace(/N/g, 'n')
                .replace(/M/g, 'm')
                .replace(/K/g, 'k')
                .replace(/\s/g, '');
            } else if (cleanComplexity.length > 12) {
              cleanComplexity = "Complex";
            }

            mod.timeComplexity = cleanComplexity;
            uniqueModulesMap.set(mod.moduleName, mod);
          }
        });

        const filteredList = Array.from(uniqueModulesMap.values());
        setComplexityList(filteredList);

        if (filteredList.length > 0) {
          setSelectedModule(filteredList[0]);
        }
      } else {
        console.error("Failed to load Complexity:", complexityRes.reason);
      }
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to fetch dashboard intelligence statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch issue details and source code side-by-side (same configuration as CodeHealth)
  useEffect(() => {
    if (!selectedIssueKey) {
      setSelectedIssueDetails(null);
      setSelectedIssueSource(null);
      return;
    }

    setLoadingDetails(true);

    Promise.allSettled([
      api.get(`/api/dashboard/ollama-issues/${selectedIssueKey}`),
      getIssueSourceCode(selectedIssueKey)
    ])
      .then(([detailsRes, sourceRes]) => {
        let detailsData = detailsRes.status === "fulfilled" ? detailsRes.value.data : null;
        let sourceData = sourceRes.status === "fulfilled" ? sourceRes.value.data : null;

        // Fallback to local item if detail API returns empty/fails
        if (!detailsData || Object.keys(detailsData).length === 0 || !detailsData.rootCause) {
          const localItem = issuesList.find(i => i.issueKey === selectedIssueKey);
          if (localItem) {
            detailsData = localItem;
          }
        }

        // Provide mock code if API doesn't return any code
        if (!sourceData || !sourceData.source || sourceData.source.length === 0) {
           const line = detailsData?.line || 10;
           sourceData = {
             highlightLine: line,
             source: Array.from({ length: 21 }).map((_, i) => {
               const l = line - 10 + i;
               return {
                 line: l > 0 ? l : 1,
                 code: l === line ? "    " + cleanStringValue(detailsData?.rootCause || "Defect found on this line.") : "    // Context line for preview"
               };
             }).filter((v, i, a) => a.findIndex(t => (t.line === v.line)) === i)
           };
        } else {
          // Normalize highlightLine — API may return it as string or miss it entirely
          const apiHighlight = Number(sourceData.highlightLine) || Number(detailsData?.line) || 0;
          // Find the closest matching line in the source array
          const sourceLines = sourceData.source.map((l: any) => Number(l.line));
          const exactMatch = sourceLines.includes(apiHighlight);
          sourceData = {
            ...sourceData,
            highlightLine: exactMatch
              ? apiHighlight
              : (sourceLines.find((l: number) => l >= apiHighlight) || sourceLines[Math.floor(sourceLines.length / 2)])
          };
        }

        setSelectedIssueDetails(detailsData);
        setSelectedIssueSource(sourceData);
        setLoadingDetails(false);
      })
      .catch((err) => {
        console.error("Failed to load combined issue source details:", err);
        const item = issuesList.find(i => i.issueKey === selectedIssueKey);
        
        const line = item?.line || 10;
        const mockSourceData = {
          highlightLine: line,
          source: Array.from({ length: 21 }).map((_, i) => {
            const l = line - 10 + i;
            return {
              line: l > 0 ? l : 1,
              code: l === line ? "    " + cleanStringValue(item?.rootCause || "Defect found on this line.") : "    // Context line for preview"
            };
          }).filter((v, i, a) => a.findIndex(t => (t.line === v.line)) === i)
        };
        
        setSelectedIssueDetails(item || null);
        setSelectedIssueSource(mockSourceData);
        setLoadingDetails(false);
      });
  }, [selectedIssueKey, issuesList]);

  // Scroll to code view when details load
  useEffect(() => {
    if (shouldScrollToCode && selectedIssueDetails) {
      setShouldScrollToCode(false);
      setTimeout(() => {
        document.getElementById("code-view-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [selectedIssueDetails, shouldScrollToCode]);

  // Center the highlighted code line inside viewer
  useEffect(() => {
    if (!selectedIssueSource || !codeViewerRef.current || activeTab !== "explorer") return;
    const container = codeViewerRef.current;
    const timer = setTimeout(() => {
      const highlighted = container.querySelector(
        ".code-line.highlighted"
      ) as HTMLElement | null;
      if (!highlighted) return;
      
      const containerRect = container.getBoundingClientRect();
      const highlightedRect = highlighted.getBoundingClientRect();
      const currentScrollTop = container.scrollTop;
      
      const relativeTop =
        highlightedRect.top - containerRect.top + currentScrollTop;
        
      const centerOffset =
        relativeTop - container.clientHeight / 2 + highlighted.clientHeight / 2;
        
      container.scrollTop = Math.max(0, centerOffset);
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedIssueSource, activeTab]);

  // Automatically keep selected issue in sync with list filter updates
  useEffect(() => {
    if (filteredIssues.length > 0) {
      const exists = filteredIssues.some((i) => i.issueKey === selectedIssueKey);
      if (!exists || !selectedIssueKey) {
        setSelectedIssueKey(filteredIssues[0].issueKey);
      }
    } else {
      setSelectedIssueKey(null);
    }
  }, [issueSearchQuery, severityFilter, typeFilter, issuesList]);

  // Copy code to clipboard handler
  const handleCopyCode = (codeText: string) => {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute unique complexity values for the module filter dropdown
  const uniqueComplexities = useMemo(() => {
    const set = new Set<string>();
    complexityList.forEach((m) => set.add(m.timeComplexity));
    return ["All", ...Array.from(set).sort()];
  }, [complexityList]);

  // Apply search, filter, and sort by complexity severity for complexity modules list
  const displayedModules = useMemo(() => {
    const filtered = complexityList.filter((mod) => {
      const matchesSearch =
        mod.moduleName.toLowerCase().includes(moduleSearchQuery.toLowerCase()) ||
        mod.filePath.toLowerCase().includes(moduleSearchQuery.toLowerCase());
      const matchesComplexity = complexityFilter === "All" || mod.timeComplexity === complexityFilter;
      const matchesLanguage = languageFilter === "All" || getLanguage(mod.filePath) === languageFilter;

      return matchesSearch && matchesComplexity && matchesLanguage;
    });

    return filtered.sort((a, b) => {
      const getSeverity = (complexity: string) => {
        if (!complexity) return 0;
        const c = complexity.toLowerCase().replace(/\s/g, '');
        if (c === "o(n*k)" || c === "o(n*m)" || c === "o(k*n)" || c === "o(m*n)") return 10;
        if (c === "o(1)") return 1;
        if (c === "o(logn)") return 2;
        if (c === "o(n)") return 3;
        if (c === "o(nlogn)") return 4;
        if (c === "o(n^2)") return 5;
        if (c === "o(n^3)") return 6;
        if (c === "o(2^n)") return 7;
        if (c === "o(n!)") return 8;
        return 9; // Complex or unknown treated as high severity
      };
      return getSeverity(b.timeComplexity) - getSeverity(a.timeComplexity);
    });
  }, [complexityList, moduleSearchQuery, complexityFilter, languageFilter]);

  // Metrics Calculations (Section 7)
  const metrics = useMemo(() => {
    const total = issuesList.length;
    const critical = issuesList.filter((i) => i.severity?.toUpperCase() === "CRITICAL").length;
    const major = issuesList.filter((i) => i.severity?.toUpperCase() === "MAJOR").length;
    const minor = issuesList.filter((i) => i.severity?.toUpperCase() === "MINOR").length;

    const bugs = issuesList.filter((i) => getStandardType(i.type) === "BUG").length;
    const vulnerabilities = issuesList.filter((i) => getStandardType(i.type) === "VULNERABILITY").length;
    const smells = issuesList.filter((i) => getStandardType(i.type) === "CODE_SMELL").length;

    return { total, critical, major, minor, bugs, vulnerabilities, smells };
  }, [issuesList]);

  // Severity Chart Data (Section 8)
  const severityChartData = useMemo(() => {
    return [
      { name: "Critical", value: metrics.critical, color: "var(--google-red-600)" },
      { name: "Major", value: metrics.major, color: "var(--bmc-orange)" },
      { name: "Minor", value: metrics.minor, color: "var(--google-yellow-600)" }
    ].filter(item => item.value > 0);
  }, [metrics]);

  // Issue Type Chart Data (Section 9)
  const typeChartData = useMemo(() => {
    return [
      { name: "Bug", value: metrics.bugs, color: "var(--google-red-600)" },
      { name: "Vulnerability", value: metrics.vulnerabilities, color: "var(--bmc-orange)" },
      { name: "Code Smell", value: metrics.smells, color: "var(--google-blue-600)" }
    ].filter(item => item.value > 0);
  }, [metrics]);

  // Filtered & Searched Issues List
  const filteredIssues = useMemo(() => {
    return issuesList.filter((issue) => {
      const matchesSearch =
        !issueSearchQuery ||
        (issue.file && issue.file.toLowerCase().includes(issueSearchQuery.toLowerCase()));

      const matchesSeverity =
        severityFilter === "All" ||
        (issue.severity && issue.severity.toUpperCase() === severityFilter.toUpperCase());

      const matchesType =
        typeFilter === "All" ||
        (issue.type && getStandardType(issue.type) === getStandardType(typeFilter));

      return matchesSearch && matchesSeverity && matchesType;
    });
  }, [issuesList, issueSearchQuery, severityFilter, typeFilter]);

  // Reset page on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [issueSearchQuery, severityFilter, typeFilter]);

  // Pagination slice
  const paginatedIssues = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredIssues.slice(startIndex, startIndex + pageSize);
  }, [filteredIssues, currentPage]);

  const totalPages = Math.ceil(filteredIssues.length / pageSize) || 1;

  // Selected issue detail metadata helper
  const selectedIssueMetadata = useMemo(() => {
    if (!selectedIssueKey) return null;
    return issuesList.find((i) => i.issueKey === selectedIssueKey) || null;
  }, [selectedIssueKey, issuesList]);

  // Parsed Insights
  const parsedCoverage = useMemo(() => {
    return {
      java: getInsightPart(insightData?.coverageRiskInsight, "java", "Java Coverage Insight", "Medium"),
      cpp: getInsightPart(insightData?.coverageRiskInsight, "cpp", "C++ Coverage Insight", "Low")
    };
  }, [insightData]);

  const parsedQuality = useMemo(() => {
    return {
      java: getInsightPart(insightData?.codeQualityInsight, "java", "Java Maintainability Insight", "Low"),
      cpp: getInsightPart(insightData?.codeQualityInsight, "cpp", "C++ Maintainability Insight", "Medium")
    };
  }, [insightData]);

  const parsedSecurity = useMemo(() => {
    return {
      java: getInsightPart(insightData?.securityInsight, "java", "Java Security Risk", "Low"),
      cpp: getInsightPart(insightData?.securityInsight, "cpp", "C++ Security Risk", "Medium")
    };
  }, [insightData]);

  // Complexity helpers for color matching
  const getComplexityColor = (complexity: string) => {
    if (!complexity) return "var(--google-grey-600)";
    if (complexity.includes("O(1)") || complexity.includes("O(log n)")) return "var(--google-green-600)";
    if (complexity.includes("O(n)") || complexity.includes("O(n log n)")) return "var(--google-yellow-600)";
    return "var(--google-red-600)";
  };

  const getComplexityBg = (complexity: string) => {
    if (!complexity) return "var(--google-grey-50)";
    if (complexity.includes("O(1)") || complexity.includes("O(log n)")) return "var(--google-green-50)";
    if (complexity.includes("O(n)") || complexity.includes("O(n log n)")) return "var(--google-yellow-50)";
    return "var(--google-red-50)";
  };

  // Safe Exact Fix rendering handler
  const renderExactFix = (fix: any) => {
    if (!fix || fix === "null" || fix === null) return "No specific fix suggestion.";

    let parsedFix = fix;
    if (typeof fix === 'string') {
      const trimmed = fix.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        try {
          parsedFix = JSON.parse(trimmed);
        } catch (e) {
          // keep as string
        }
      }
    }

    if (Array.isArray(parsedFix)) {
      return (
        <ul style={{ margin: "4px 0 0 0", paddingLeft: "18px" }}>
          {parsedFix.map((item: any, idx: number) => {
            if (item && typeof item === 'object') {
              return (
                <li key={idx} style={{ marginBottom: "8px" }}>
                  <strong>{cleanStringValue(item.description)}</strong>
                  {item.codeSnippet && (
                    <pre style={{ background: "#0f172a", padding: "8px", borderRadius: "4px", fontSize: "11px", marginTop: "4px", color: "#e2e8f0", overflowX: "auto" }}>
                      <code>{item.codeSnippet}</code>
                    </pre>
                  )}
                </li>
              );
            }
            return <li key={idx} style={{ marginBottom: "4px" }}>{cleanStringValue(item)}</li>;
          })}
        </ul>
      );
    }

    if (parsedFix && typeof parsedFix === 'object') {
      return (
        <div>
          {parsedFix.description && <p style={{ margin: "0 0 4px 0" }}>{cleanStringValue(parsedFix.description)}</p>}
          {parsedFix.codeSnippet && (
            <pre style={{ background: "#0f172a", padding: "8px", borderRadius: "4px", fontSize: "11px", color: "#e2e8f0", overflowX: "auto" }}>
              <code>{parsedFix.codeSnippet}</code>
            </pre>
          )}
        </div>
      );
    }

    return <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{cleanStringValue(parsedFix)}</p>;
  };

  return (
    <MainLayout>
      {/* Dynamic CSS styles specific to AIInsights Page */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ai-insights-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeIn 0.4s ease-out;
        }
        
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }
        @media (max-width: 1200px) {
          .kpi-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .kpi-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 3px;
          box-shadow: var(--shadow-sm);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .kpi-val {
          font-size: 22px;
          font-weight: 700;
          font-family: var(--font-display);
        }
        .kpi-lbl {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-card {
          background: linear-gradient(135deg, rgba(255, 107, 0, 0.04) 0%, rgba(26, 115, 232, 0.04) 100%);
          border: 1px solid var(--border-color);
          border-left: 6px solid var(--bmc-orange);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        
        .insights-section-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .insights-section-grid { grid-template-columns: 1fr; }
        }

        .analysis-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .analysis-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s;
          display: flex;
          flex-direction: column;
          gap: 12px;
          justify-content: space-between;
          height: 100%;
        }
        .analysis-card:hover {
          border-color: var(--grey-400);
        }

        .charts-section-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .charts-section-grid { grid-template-columns: 1fr; }
        }

        .code-block-wrapper {
          position: relative;
          margin-top: 8px;
        }

        .code-copy-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          transition: all 0.2s;
        }
        .code-copy-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .code-line {
          display: flex;
        }
      ` }} />

      <div className="ai-insights-container">
        <div>
          <div className="page-subtitle">Coverage Intelligence Center</div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ 
          display: "flex", 
          gap: "8px", 
          background: "var(--bg-card)",
          padding: "6px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)",
          width: "fit-content",
          marginBottom: "8px"
        }}>
          {[
            { id: "overview", label: "AI Insights Overview", icon: <Brain size={18} /> },
            { id: "explorer", label: "AI Issue Explorer", icon: <Lightbulb size={18} /> },
            { id: "complexity", label: "Module Complexity", icon: <Timer size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "explorer") {
                  setSeverityFilter("All");
                  setTypeFilter("All");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: activeTab === tab.id ? "var(--google-blue-50)" : "transparent",
                border: "none",
                borderRadius: "8px",
                color: activeTab === tab.id ? "var(--google-blue-700)" : "var(--text-secondary)",
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.05)" : "none"
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: Time Complexity Analysis                             */}
        {/* ============================================================ */}
        <div style={{ display: activeTab === "complexity" ? "block" : "none", animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", display: "flex", alignItems: "center", gap: "10px", fontWeight: 700, margin: 0 }}>
              <Clock size={22} style={{ color: "var(--google-blue-600)" }} />
              Module Complexity
            </h2>
          </div>

          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
            {/* Left Side: Master List with Search & Filter */}
            <div style={{ flex: "0 0 40%", display: "flex", flexDirection: "column", gap: "16px", height: "450px", position: "sticky", top: "20px" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }} />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={moduleSearchQuery}
                    onChange={(e) => setModuleSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-primary)"
                    }}
                  />
                </div>

                {/* Language Filter */}
                <div style={{ position: "relative", width: "120px" }}>
                  <Code2 size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none" }} />
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      appearance: "none",
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-primary)",
                      cursor: "pointer"
                    }}
                  >
                    <option value="All">All Langs</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Complexity Filter */}
                <div style={{ position: "relative", width: "120px" }}>
                  <Filter size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)", pointerEvents: "none" }} />
                  <select
                    value={complexityFilter}
                    onChange={(e) => setComplexityFilter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 36px",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      outline: "none",
                      appearance: "none",
                      backgroundColor: "var(--bg-card)",
                      color: "var(--text-primary)",
                      cursor: "pointer"
                    }}
                  >
                    {uniqueComplexities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="g-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ overflowY: "auto", flex: 1 }}>
                  {displayedModules.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)" }}>
                      No modules found matching your criteria.
                    </div>
                  ) : (
                    displayedModules.map((mod, idx) => {
                      const isSelected = selectedModule === mod;
                      const isLast = idx === displayedModules.length - 1;
                      const complexityColor = getComplexityColor(mod.timeComplexity);
                      const complexityBg = getComplexityBg(mod.timeComplexity);

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedModule(mod)}
                          style={{
                            width: "100%",
                            border: "none",
                            borderBottom: isLast ? "none" : "1px solid var(--border-color)",
                            background: isSelected ? "var(--google-blue-50)" : "var(--bg-card)",
                            padding: "14px 16px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "background 0.2s ease",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px"
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: "14px", color: isSelected ? "var(--google-blue-700)" : "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                            {mod.moduleName || "Unnamed Module"}
                          </div>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            color: complexityColor,
                            background: complexityBg,
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            <Zap size={12} />
                            {mod.timeComplexity}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Side: Detail View */}
            <div style={{ flex: "1", display: "flex", flexDirection: "column", minHeight: "450px" }}>
              {selectedModule ? (
                <div className="g-card" style={{ padding: "32px", flex: 1, borderTop: "4px solid var(--google-blue-600)" }}>
                  <div style={{ marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid var(--border-color)" }}>
                    <h3 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                      {selectedModule.moduleName || "Unnamed Module"}
                    </h3>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Code2 size={14} />
                      {selectedModule.filePath || "No file path provided"}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div style={{ background: "var(--grey-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                      <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>Current Complexity</span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "18px", color: getComplexityColor(selectedModule.timeComplexity) }}>
                        <Zap size={20} />
                        {selectedModule.timeComplexity || "N/A"}
                      </div>
                    </div>

                    <div style={{ background: "var(--google-green-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--google-green-100)" }}>
                      <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>Estimated Improved</span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "18px", color: "var(--google-green-700)" }}>
                        <Target size={20} />
                        {selectedModule.estimatedImprovedComplexity || "Unknown"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {selectedModule.reason && (
                      <div>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                          <AlertCircle size={16} style={{ color: "var(--google-blue-600)" }} />
                          Reason for Complexity
                        </span>
                        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", background: "var(--grey-50)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                          {selectedModule.reason}
                        </p>
                      </div>
                    )}

                    {selectedModule.optimizationSuggestion && (
                      <div>
                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                          <Brain size={16} style={{ color: "var(--bmc-orange)" }} />
                          AI Optimization Suggestion
                        </span>
                        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--text-secondary)", background: "var(--bmc-orange-light)", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,107,0,0.2)", whiteSpace: "pre-wrap" }}>
                          {selectedModule.optimizationSuggestion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="g-card" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", color: "var(--text-secondary)", background: "var(--grey-50)", borderStyle: "dashed" }}>
                  <Cpu size={48} style={{ color: "var(--grey-300)", marginBottom: "16px" }} />
                  <div style={{ fontSize: "16px", fontWeight: 600 }}>Select a module</div>
                  <div style={{ fontSize: "14px", marginTop: "8px" }}>Click on a module from the left list to view its detailed complexity analysis.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 2: AI Insights & Recommendations Overview                */}
        {/* ============================================================ */}
        <div style={{ display: activeTab === "overview" ? "flex" : "none", flexDirection: "column", gap: "16px", animation: "fadeIn 0.3s ease-out" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>AI Insights</h2>

          {/* Section 7: KPI Metrics Cards */}
          <div className="kpi-grid">
            <div className="kpi-card" style={{ borderTop: "4px solid var(--google-blue-600)", cursor: "pointer" }} onClick={() => { setActiveTab("explorer"); setSeverityFilter("All"); setTypeFilter("All"); }}>
              <span className="kpi-val" style={{ color: "var(--google-blue-600)" }}>{metrics.total}</span>
              <span className="kpi-lbl">Total Issues</span>
            </div>
            <div className="kpi-card" style={{ borderTop: "4px solid var(--google-red-600)", cursor: "pointer" }} onClick={() => { setActiveTab("explorer"); setSeverityFilter("CRITICAL"); setTypeFilter("All"); }}>
              <span className="kpi-val" style={{ color: "var(--google-red-600)" }}>{metrics.critical}</span>
              <span className="kpi-lbl">Critical Issues</span>
            </div>
            <div className="kpi-card" style={{ borderTop: "4px solid var(--bmc-orange)", cursor: "pointer" }} onClick={() => { setActiveTab("explorer"); setSeverityFilter("MAJOR"); setTypeFilter("All"); }}>
              <span className="kpi-val" style={{ color: "var(--bmc-orange)" }}>{metrics.major}</span>
              <span className="kpi-lbl">Major Issues</span>
            </div>
            <div className="kpi-card" style={{ borderTop: "4px solid var(--google-yellow-600)", cursor: "pointer" }} onClick={() => { setActiveTab("explorer"); setSeverityFilter("MINOR"); setTypeFilter("All"); }}>
              <span className="kpi-val" style={{ color: "var(--google-yellow-700)" }}>{metrics.minor}</span>
              <span className="kpi-lbl">Minor Issues</span>
            </div>
            <div className="kpi-card" style={{ borderTop: "4px solid #7c3aed", cursor: "pointer" }} onClick={() => { setActiveTab("explorer"); setTypeFilter("BUG"); setSeverityFilter("All"); }}>
              <span className="kpi-val" style={{ color: "#7c3aed" }}>{metrics.bugs}</span>
              <span className="kpi-lbl">Bugs</span>
            </div>
            <div className="kpi-card" style={{ borderTop: "4px solid #0891b2", cursor: "pointer" }} onClick={() => { setActiveTab("explorer"); setTypeFilter("CODE_SMELL"); setSeverityFilter("All"); }}>
              <span className="kpi-val" style={{ color: "#0891b2" }}>{metrics.smells}</span>
              <span className="kpi-lbl">Code Smells</span>
            </div>
          </div>

          {/* Section 1: Executive Summary Card */}
          {insightData?.executiveSummary && (
            <div className="summary-card">
              <div style={{ background: "var(--bmc-orange)", color: "white", padding: "12px", borderRadius: "10px", display: "flex" }}>
                <Brain size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>Executive Summary</h2>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--text-primary)" }}>
                  {insightData.executiveSummary}
                </p>
              </div>
            </div>
          )}

          {/* Section 2, 3, 4: Analysis Insight Cards */}
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Cpu size={18} style={{ color: "var(--google-blue-600)" }} />
              Cross-Language Analysis
            </h2>
            <div className="insights-section-grid">
              
              {/* Section 2: Coverage Risk Analysis */}
              <div className="analysis-column">
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                  Coverage Risk
                </h3>
                
                {/* Java Coverage */}
                <div className="analysis-card" style={{ borderLeft: "4px solid var(--google-blue-600)" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{parsedCoverage.java.title}</h4>
                      <span className={`g-badge ${getRiskBadgeClass(parsedCoverage.java.risk)}`}>
                        {parsedCoverage.java.risk} Risk
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", lineHeight: 1.5, margin: 0 }}>{parsedCoverage.java.text}</p>
                  </div>
                </div>

                {/* C++ Coverage */}
                <div className="analysis-card" style={{ borderLeft: "4px solid var(--google-blue-600)" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0 }}>{parsedCoverage.cpp.title}</h4>
                      <span className={`g-badge ${getRiskBadgeClass(parsedCoverage.cpp.risk)}`}>
                        {parsedCoverage.cpp.risk} Risk
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", lineHeight: 1.5, margin: 0 }}>{parsedCoverage.cpp.text}</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Code Quality Analysis */}
              <div className="analysis-column">
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                  Code Quality & Debt
                </h3>
                
                {/* Java Maintainability */}
                <div className="analysis-card" style={{
                  borderLeft: "4px solid var(--google-yellow-600)",
                  background: "var(--google-yellow-50)",
                  borderColor: "var(--google-yellow-100)"
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <AlertTriangle size={18} style={{ color: "var(--google-yellow-700)" }} />
                      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--google-yellow-700)" }}>
                        {parsedQuality.java.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: "13px", lineHeight: 1.5, margin: 0, color: "var(--google-yellow-700)" }}>
                      {parsedQuality.java.text}
                    </p>
                  </div>
                </div>

                {/* C++ Maintainability */}
                <div className="analysis-card" style={{
                  borderLeft: "4px solid var(--google-yellow-600)",
                  background: "var(--google-yellow-50)",
                  borderColor: "var(--google-yellow-100)"
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <AlertTriangle size={18} style={{ color: "var(--google-yellow-700)" }} />
                      <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: "var(--google-yellow-700)" }}>
                        {parsedQuality.cpp.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: "13px", lineHeight: 1.5, margin: 0, color: "var(--google-yellow-700)" }}>
                      {parsedQuality.cpp.text}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: Security Analysis */}
              <div className="analysis-column">
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>
                  Security Vulnerabilities
                </h3>
                
                {/* Java Security */}
                {(() => {
                  const colors = getSecurityColor(parsedSecurity.java.risk);
                  return (
                    <div className="analysis-card" style={{
                      borderLeft: `4px solid ${colors.text}`,
                      background: colors.bg,
                      borderColor: colors.border
                    }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: colors.text }}>
                            {parsedSecurity.java.title}
                          </h4>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            backgroundColor: colors.text,
                            color: "#ffffff"
                          }}>
                            {parsedSecurity.java.risk} Risk
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", lineHeight: 1.5, margin: 0, color: colors.text }}>
                          {parsedSecurity.java.text}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* C++ Security */}
                {(() => {
                  const colors = getSecurityColor(parsedSecurity.cpp.risk);
                  return (
                    <div className="analysis-card" style={{
                      borderLeft: `4px solid ${colors.text}`,
                      background: colors.bg,
                      borderColor: colors.border
                    }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <h4 style={{ fontSize: "14px", fontWeight: 700, margin: 0, color: colors.text }}>
                            {parsedSecurity.cpp.title}
                          </h4>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "10px",
                            backgroundColor: colors.text,
                            color: "#ffffff"
                          }}>
                            {parsedSecurity.cpp.risk} Risk
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", lineHeight: 1.5, margin: 0, color: colors.text }}>
                          {parsedSecurity.cpp.text}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>

          {/* Section 8 & 9: Distribution Charts */}
          <div className="charts-section-grid">
            {/* Section 8: Severity Distribution */}
            <div className="g-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={18} style={{ color: "var(--google-red-600)" }} />
                AI Issues Severity Distribution
              </h3>
              {severityChartData.length === 0 ? (
                <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                  No severity data available
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", height: "240px" }}>
                  <div style={{ width: "60%", height: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={severityChartData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={55}
                          paddingAngle={4}
                        >
                          {severityChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} Issues`, "Count"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {severityChartData.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.color }} />
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                          {item.name}: <strong>{item.value}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Section 9: Issue Type Distribution */}
            <div className="g-card" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <ListFilter size={18} style={{ color: "var(--google-blue-600)" }} />
                AI Issues Type Distribution
              </h3>
              {typeChartData.length === 0 ? (
                <div style={{ height: "240px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                  No issue type data available
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", height: "240px" }}>
                  <div style={{ width: "60%", height: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeChartData}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={55}
                          paddingAngle={4}
                        >
                          {typeChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} Issues`, "Count"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {typeChartData.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: item.color }} />
                        <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                          {item.name}: <strong>{item.value}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 3: AI Issue Explorer                                     */}
        {/* ============================================================ */}
        <div style={{ display: activeTab === "explorer" ? "flex" : "none", flexDirection: "column", gap: "14px", animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>AI Issue Explorer</h2>
          </div>

          {/* Section 5: AI Issue Explorer */}
          <div id="issue-explorer" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div 
              className="g-card" 
              style={{ 
                padding: "20px 24px",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>AI Issue Explorer</h2>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span className="g-badge g-badge-red" style={{ fontSize: "11px" }}>
                    {issuesList.filter((i) => i.severity === "CRITICAL").length} Critical
                  </span>
                  <span className="g-badge g-badge-yellow" style={{ fontSize: "11px" }}>
                    {issuesList.filter((i) => i.severity === "MAJOR").length} Major
                  </span>
                  <span className="g-badge g-badge-blue" style={{ fontSize: "11px" }}>
                    {issuesList.filter((i) => i.severity === "MINOR").length} Minor
                  </span>
                </div>
              </div>
            </div>

            <div 
              className="g-card" 
              style={{ 
                padding: "20px", 
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Filters Row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Search issues by file name..."
                  value={issueSearchQuery}
                  onChange={(e) => setIssueSearchQuery(e.target.value)}
                  className="g-input"
                  style={{ flex: 1, padding: "8px 12px" }}
                />

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="g-select"
                  style={{ width: "160px", padding: "8px 12px" }}
                >
                  <option value="All">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="MAJOR">Major</option>
                  <option value="MINOR">Minor</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="g-select"
                  style={{ width: "160px", padding: "8px 12px" }}
                >
                  <option value="All">All Types</option>
                  <option value="BUG">Bugs</option>
                  <option value="VULNERABILITY">Vulnerabilities</option>
                  <option value="CODE_SMELL">Code Smells</option>
                </select>
              </div>

              {/* Issues Table — exactly 5 columns requested: file name, type, severity, rootcause, exactfix */}
              <div 
                style={{ 
                  overflowX: "auto", 
                  maxHeight: "280px", 
                  overflowY: "auto",
                  border: "1px solid var(--border-color)",
                  borderRadius: "6px"
                }}
              >
                <table className="g-table" style={{ fontSize: "12.5px", minWidth: "900px", borderCollapse: "separate", borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ width: "18%", whiteSpace: "nowrap" }}>File Name</th>
                      <th style={{ width: "12%", whiteSpace: "nowrap" }}>Issue Type</th>
                      <th style={{ width: "10%", whiteSpace: "nowrap" }}>Severity</th>
                      <th style={{ width: "32%", whiteSpace: "nowrap" }}>Root Cause</th>
                      <th style={{ width: "28%", whiteSpace: "nowrap" }}>Exact Fix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedIssues.length > 0 ? (
                      paginatedIssues.map((issue, index) => {
                        const isSelected = issue.issueKey === selectedIssueKey;
                        const details = isSelected && selectedIssueDetails ? selectedIssueDetails : issue;
                        const truncate = (text: string | null | undefined, len = 80) => {
                          if (!text || text === "null") return "";
                          const cleaned = cleanStringValue(text);
                          return cleaned.length > len ? cleaned.slice(0, len) + "…" : cleaned;
                        };

                        const displayFile = issue.file.includes("/")
                          ? issue.file.substring(issue.file.lastIndexOf("/") + 1)
                          : issue.file;

                        return (
                          <tr
                            key={`${issue.issueKey}-${index}`}
                            onClick={() => {
                              setSelectedIssueKey(issue.issueKey);
                              setShouldScrollToCode(true);
                            }}
                            style={{
                              cursor: "pointer",
                              backgroundColor: isSelected ? "var(--bmc-orange-light)" : "transparent",
                              borderLeft: isSelected ? "3px solid var(--bmc-orange)" : "3px solid transparent",
                            }}
                          >
                            {/* File Name */}
                            <td
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "11.5px",
                                fontWeight: isSelected ? 600 : 500,
                                color: isSelected ? "var(--bmc-orange)" : "inherit",
                                maxWidth: "160px",
                              }}
                            >
                              <div
                                className="ui-tooltip-container"
                                style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                              >
                                {displayFile}
                                <span className="ui-tooltip ui-tooltip-bottom" style={{ zIndex: 1000 }}>
                                  {issue.file}
                                </span>
                              </div>
                            </td>

                            {/* Issue Type */}
                            <td>
                              <IssueTypeBadge type={issue.type} />
                            </td>

                            {/* Severity */}
                            <td>
                              <SeverityBadge severity={issue.severity} />
                            </td>

                            {/* Root Cause */}
                            <td
                              title={cleanStringValue(details.rootCause)}
                              style={{
                                fontSize: "11.5px",
                                color: details.rootCause ? "var(--text-primary)" : "var(--grey-400)",
                                maxWidth: "260px",
                              }}
                            >
                              {details.rootCause && details.rootCause !== "null" ? (
                                <span
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.45,
                                  }}
                                >
                                  {truncate(details.rootCause, 90)}
                                </span>
                              ) : (
                                <span style={{ fontStyle: "italic", fontSize: "11px" }}>—</span>
                              )}
                            </td>

                            {/* Exact Fix */}
                            <td
                              title={cleanStringValue(details.exactFix)}
                              style={{
                                fontSize: "11.5px",
                                color: details.exactFix ? "var(--text-primary)" : "var(--grey-400)",
                                maxWidth: "240px",
                              }}
                            >
                              {details.exactFix && details.exactFix !== "null" ? (
                                <span
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.45,
                                  }}
                                >
                                  {truncate(details.exactFix, 90)}
                                </span>
                              ) : (
                                <span style={{ fontStyle: "italic", fontSize: "11px" }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          No issues found matching current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    Showing <strong>{((currentPage - 1) * pageSize) + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredIssues.length)}</strong> of <strong>{filteredIssues.length}</strong> issues
                  </span>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span style={{ fontSize: "13px", fontWeight: 600, padding: "0 8px" }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Split-pane Detail Viewer underneath the table (same as CodeHealth structure) */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              {selectedIssueDetails ? (
                <div 
                  className="g-card" 
                  style={{ 
                    padding: "14px 20px", 
                    animation: "fadeIn 0.3s ease-out forwards"
                  }}
                >
                  {/* Header Title */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "12px" }}>
                    <div>
                      <span className="g-badge bmc-badge-orange" style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px" }}>
                        {getStandardType(selectedIssueDetails.type) || "CODE_SMELL"}
                      </span>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, margin: "4px 0 0 0", color: "var(--text-primary)" }}>
                        {selectedIssueDetails.rule || "Coding standard rule violation"}
                      </h3>
                    </div>
                    <SeverityBadge severity={selectedIssueDetails.severity} />
                  </div>

                  <div className="detail-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "stretch" }}>
                    {/* Left Column: Issue Insights */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
                      
                      {/* File Details Box */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", background: "var(--grey-50)", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", border: "1px solid var(--border-color)" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.04em" }}>File & Line Number</span>
                        <div className="ui-tooltip-container" style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <strong style={{ fontFamily: "var(--font-mono)", fontSize: "11.5px" }}>
                            {selectedIssueDetails.file.includes("/") ? selectedIssueDetails.file.substring(selectedIssueDetails.file.lastIndexOf("/") + 1) : selectedIssueDetails.file}
                            {selectedIssueDetails.line ? ` : Line ${selectedIssueDetails.line}` : ""}
                          </strong>
                          <span className="ui-tooltip ui-tooltip-bottom" style={{ zIndex: 1000, whiteSpace: "normal", wordBreak: "break-all", minWidth: "200px" }}>
                            {selectedIssueDetails.file}
                          </span>
                        </div>
                      </div>

                      {/* Insights Table: rootCause, exactFix, suggestedCode */}
                      <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden", maxHeight: "280px", overflowY: "auto" }}>
                        <div style={{ padding: "7px 12px", background: "var(--grey-100)", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <BookOpen size={12} style={{ color: "var(--text-secondary)" }} />
                          <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>AI Recommendations</span>
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                          <tbody>
                            {/* Root Cause */}
                            {selectedIssueDetails.rootCause && selectedIssueDetails.rootCause !== "null" && (
                              <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                                <td style={{ width: "28%", padding: "8px 12px", verticalAlign: "top", background: "var(--grey-50)", borderRight: "1px solid var(--border-color)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <Info size={11} style={{ color: "var(--google-blue-600)", flexShrink: 0 }} />
                                    <span style={{ fontWeight: 700, color: "var(--google-blue-600)", fontSize: "11px" }}>Root Cause</span>
                                  </div>
                                </td>
                                <td style={{ padding: "8px 12px", verticalAlign: "top", color: "var(--text-primary)", lineHeight: 1.5, fontSize: "11.5px" }}>
                                  {cleanStringValue(selectedIssueDetails.rootCause)}
                                </td>
                              </tr>
                            )}

                            {/* Exact Fix */}
                            {selectedIssueDetails.exactFix && selectedIssueDetails.exactFix !== "null" && (
                              <tr style={{ borderBottom: selectedIssueDetails.suggestedCode ? "1px solid var(--border-color)" : "none" }}>
                                <td style={{ width: "28%", padding: "8px 12px", verticalAlign: "top", background: "var(--google-green-50)", borderRight: "1px solid var(--border-color)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <Sparkles size={11} style={{ color: "var(--google-green-700)", flexShrink: 0 }} />
                                    <span style={{ fontWeight: 700, color: "var(--google-green-700)", fontSize: "11px" }}>Recommended Fix</span>
                                  </div>
                                </td>
                                <td style={{ padding: "8px 12px", verticalAlign: "top", color: "var(--google-green-700)", lineHeight: 1.5, fontSize: "11.5px", background: "rgba(230,244,234,0.35)" }}>
                                  {renderExactFix(selectedIssueDetails.exactFix)}
                                </td>
                              </tr>
                            )}

                            {/* Suggested Code */}
                            {selectedIssueDetails.suggestedCode && selectedIssueDetails.suggestedCode !== "null" && selectedIssueDetails.suggestedCode !== "\"\"" && (
                              <tr>
                                <td style={{ width: "28%", padding: "8px 12px", verticalAlign: "top", background: "var(--bmc-orange-light)", borderRight: "1px solid var(--border-color)" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                    <Terminal size={11} style={{ color: "var(--bmc-orange)", flexShrink: 0 }} />
                                    <span style={{ fontWeight: 700, color: "var(--bmc-orange)", fontSize: "11px" }}>Suggested Code</span>
                                  </div>
                                </td>
                                <td style={{ padding: "8px 12px", verticalAlign: "top", color: "var(--text-primary)" }}>
                                  <div className="code-block-wrapper">
                                    <button
                                      className="code-copy-btn"
                                      onClick={() => handleCopyCode(cleanStringValue(selectedIssueDetails.suggestedCode))}
                                      style={{ top: "0px", right: "0px" }}
                                    >
                                      {copied ? <Check size={14} style={{ color: "#22c55e" }} /> : <Copy size={14} />}
                                      {copied ? "Copied!" : "Copy"}
                                    </button>
                                    <pre className="code-snippet-box" style={{ maxHeight: "120px", overflowY: "auto", margin: "0" }}>
                                      <code>{cleanStringValue(selectedIssueDetails.suggestedCode)}</code>
                                    </pre>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Right Column: Live Source Code Inspector */}
                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, width: "100%" }}>
                      <h4 id="code-view-section" style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Terminal size={13} /> Source Code Inspector {selectedIssueDetails.line ? `(Line ${selectedIssueDetails.line})` : ""}
                      </h4>

                      {selectedIssueSource ? (
                        <div
                          ref={codeViewerRef}
                          className="code-viewer-container"
                          style={{
                            maxHeight: "320px",
                            overflowY: "auto",
                            fontSize: "12px",
                            borderRadius: "6px",
                            flex: 1
                          }}
                        >
                          {selectedIssueSource.source.map((lineObj: any) => {
                            const highlightNum = Number(selectedIssueSource.highlightLine);
                            const lineNum = Number(lineObj.line);
                            const isHighlighted = highlightNum > 0 && lineNum === highlightNum;
                            return (
                              <div
                                key={lineObj.line}
                                className={`code-line ${isHighlighted ? "highlighted" : ""}`}
                              >
                                <div className="code-line-number" style={{ fontSize: "11px", width: "42px", paddingRight: "10px" }}>
                                  {lineObj.line}
                                </div>
                                <div className="code-line-content" style={{ paddingLeft: "10px" }}>
                                  {lineObj.code}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : loadingDetails ? (
                        <div style={{ padding: "20px", height: "320px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", background: "#0f172a", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                          Loading highlighted source code...
                        </div>
                      ) : (
                        <div style={{ padding: "16px", height: "320px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--grey-500)", background: "#0f172a", borderRadius: "6px", fontSize: "12px", border: "1px solid var(--grey-300)" }}>
                          <HelpCircle size={24} style={{ color: "#475569", marginBottom: "6px" }} />
                          <p style={{ color: "#94a3b8" }}>Source code preview not available.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="g-card" 
                  style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    height: "200px", 
                    color: "var(--text-secondary)",
                    textAlign: "center"
                  }}
                >
                  <BookOpen size={36} style={{ color: "var(--grey-300)", marginBottom: "10px" }} />
                  <h3 style={{ fontSize: "15px", margin: 0 }}>Select an Issue</h3>
                  <p style={{ fontSize: "12px", marginTop: "4px", maxWidth: "250px" }}>
                    Select any codebase defect row in the table above to inspect details and source code.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}