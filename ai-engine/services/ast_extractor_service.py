"""
ast_extractor_service.py

Phase 1 of the hybrid complexity engine.
Uses tree-sitter to extract structural features from method source code.

Extracted features are passed to:
  - complexity_rule_engine.py  (Phase 2)
  - complexity_prompt.py       (Phase 3, selective)

Enhanced to detect:
  Loops, nested loops, recursion, sorting, binary search,
  stream pipelines, graph traversals, heap operations,
  HashMap/TreeMap usage, List.contains() inside loops,
  dynamic programming patterns, memoization patterns,
  condition count (cyclomatic proxy), and method LOC.
"""

from tree_sitter import Parser, Language
import tree_sitter_java
import tree_sitter_cpp


# ── Parser Factory ─────────────────────────────────────────────────────────────

def _get_parser(file_extension: str):
    parser = Parser()
    ext = file_extension.lstrip(".").lower()
    if ext == "java":
        parser.language = Language(tree_sitter_java.language())
        return parser, "java"
    elif ext in ("cpp", "cc", "cxx", "hpp", "h"):
        parser.language = Language(tree_sitter_cpp.language())
        return parser, "cpp"
    return None, None


# ── Node Type Sets ─────────────────────────────────────────────────────────────

LOOP_NODES = {
    "for_statement",
    "while_statement",
    "do_statement",
    "enhanced_for_statement",   # Java for-each
    "for_range_loop",           # C++ range-for
}

RECURSION_CALL_TYPES = {"method_invocation", "call_expression"}

SORT_METHODS = {
    "sort", "sorted", "mergeSort", "quickSort", "heapSort",
    "Collections.sort", "Arrays.sort", "std::sort", "qsort",
}

BINARY_SEARCH_METHODS = {
    "binarySearch", "Arrays.binarySearch", "Collections.binarySearch",
    "lower_bound", "upper_bound", "std::binary_search",
}

GRAPH_DFS_BFS_METHODS = {
    "dfs", "bfs", "depthFirstSearch", "breadthFirstSearch",
    "traverseGraph", "visitNode",
}

HEAP_METHODS = {
    "offer", "poll", "peek", "push", "pop",
    "PriorityQueue", "priority_queue",
}

HASHMAP_METHODS = {"get", "put", "containsKey", "getOrDefault", "putIfAbsent"}

TREEMAP_METHODS = {"floorKey", "ceilingKey", "headMap", "tailMap", "subMap"}

LIST_CONTAINS_METHODS = {"contains", "indexOf", "lastIndexOf"}

STREAM_METHODS = {
    "stream", "parallelStream", "filter", "map", "flatMap",
    "collect", "reduce", "forEach", "distinct", "sorted",
}

MEMOIZATION_HINTS = {"memo", "cache", "dp", "memoize", "lru"}

DP_HINTS = {"dp[", "dp.get", "memo[", "cache["}


# ── Feature Extraction ─────────────────────────────────────────────────────────

def extract_ast_features(
    file_path: str,
    method_code: str,
    method_name: str = None,
) -> dict:
    """
    Parse method_code using tree-sitter and return a structured feature dict.
    Falls back to empty features if parsing fails.
    """
    extension = file_path.rsplit(".", 1)[-1] if "." in file_path else ""
    features  = _empty_features()

    # Record LOC for large-method detection downstream
    features["loc"] = len(method_code.splitlines())

    try:
        parser, lang = _get_parser(extension)
        if parser is None:
            features["parse_error"] = f"Unsupported extension: {extension}"
            return features

        tree = parser.parse(bytes(method_code, "utf-8"))
        root = tree.root_node

        _walk(
            root,
            method_code,
            features,
            depth=0,
            parent_is_loop=False,
            method_name=method_name,
        )

    except Exception as e:
        features["parse_error"] = str(e)

    return features


def _empty_features() -> dict:
    return {
        "loc":                    0,
        "loop_count":             0,
        "max_loop_nesting":       0,
        "has_recursion":          False,
        "recursive_calls":        [],
        "sort_calls":             [],
        "binary_search_calls":    [],
        "graph_traversal_calls":  [],
        "heap_operations":        [],
        "hashmap_operations":     [],
        "treemap_operations":     [],
        "list_contains_in_loop":  False,
        "stream_operations":      [],
        "has_memoization":        False,
        "has_dp":                 False,
        "method_calls":           [],
        "condition_count":        0,
        "parse_error":            None,
    }


def _walk(
    node,
    code: str,
    features: dict,
    depth: int,
    parent_is_loop: bool,
    method_name,
):
    node_type = node.type

    # ── Loops ──────────────────────────────────────────────────────────────
    if node_type in LOOP_NODES:
        features["loop_count"] += 1
        nesting = depth + 1
        if nesting > features["max_loop_nesting"]:
            features["max_loop_nesting"] = nesting
        for child in node.children:
            _walk(
                child, code, features,
                depth=nesting,
                parent_is_loop=True,
                method_name=method_name,
            )
        return  # children already walked

    # ── Conditions (cyclomatic proxy) ──────────────────────────────────────
    if node_type in (
        "if_statement",
        "switch_statement",
        "conditional_expression",
    ):
        features["condition_count"] += 1

    # ── Method / Function Calls ────────────────────────────────────────────
    if node_type in ("method_invocation", "call_expression"):
        name = _extract_call_name(node, code)
        if name:
            features["method_calls"].append(name)

            # Recursion detection: call name matches the enclosing method
            if method_name:
                bare_name = name.split(".")[-1]
                if bare_name == method_name:
                    features["has_recursion"] = True
                    features["recursive_calls"].append(name)

            # DP / memoization hints in the raw code slice
            snippet = code[node.start_byte:node.end_byte].lower()
            for hint in MEMOIZATION_HINTS:
                if hint in snippet:
                    features["has_memoization"] = True
            for dp_hint in DP_HINTS:
                if dp_hint in snippet:
                    features["has_dp"] = True

            _classify_call(name, features, parent_is_loop)

    # ── Recurse into children ──────────────────────────────────────────────
    for child in node.children:
        _walk(
            child, code, features,
            depth=depth,
            parent_is_loop=parent_is_loop,
            method_name=method_name,
        )


def _extract_call_name(node, code: str) -> str:
    """Best-effort extraction of a method call name from a tree-sitter node."""
    try:
        for child in node.children:
            if child.type in (
                "identifier",
                "field_access",
                "member_expression",
            ):
                return code[child.start_byte:child.end_byte]
        # Fallback: full call text (truncated to 80 chars)
        return code[node.start_byte:node.end_byte][:80]
    except Exception:
        return ""


def _classify_call(name: str, features: dict, inside_loop: bool):
    """Classify a call name into the relevant feature buckets."""
    name_lower = name.lower()

    if any(s.lower() in name_lower for s in SORT_METHODS):
        features["sort_calls"].append(name)

    if any(s.lower() in name_lower for s in BINARY_SEARCH_METHODS):
        features["binary_search_calls"].append(name)

    if any(s.lower() in name_lower for s in GRAPH_DFS_BFS_METHODS):
        features["graph_traversal_calls"].append(name)

    if any(s.lower() in name_lower for s in HEAP_METHODS):
        features["heap_operations"].append(name)

    if any(s.lower() in name_lower for s in HASHMAP_METHODS):
        features["hashmap_operations"].append(name)

    if any(s.lower() in name_lower for s in TREEMAP_METHODS):
        features["treemap_operations"].append(name)

    if inside_loop and any(
        s.lower() in name_lower for s in LIST_CONTAINS_METHODS
    ):
        features["list_contains_in_loop"] = True

    if any(s.lower() in name_lower for s in STREAM_METHODS):
        features["stream_operations"].append(name)

    if any(h in name_lower for h in MEMOIZATION_HINTS):
        features["has_memoization"] = True

    for dp_hint in DP_HINTS:
        if dp_hint in name:
            features["has_dp"] = True
            break