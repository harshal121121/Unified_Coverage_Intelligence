# services/method_extractor_service.py

import os
from typing import List, Dict, Any
import tree_sitter_language_pack as tslp
from tree_sitter import Parser

class MethodExtractorService:
    def __init__(self):
        # Fetch underlying language profiles from language pack
        self.java_lang = tslp.get_language("java")
        self.cpp_lang = tslp.get_language("cpp")

        # Initialize parsers directly with target language profiles
        self.java_parser = Parser(self.java_lang)
        self.cpp_parser = Parser(self.cpp_lang)

    def is_test_file(self, filepath: str) -> bool:
        """Evaluates path segments and filenames to completely ignore test code and fixtures."""
        normalized = filepath.replace("\\", "/").lower()
        filename = os.path.basename(normalized)
        if any(token in normalized for token in ["/src/test/", "/tests/", "/test/", "/generated/"]):
            return True
        return (filename.endswith("test.java") or filename.endswith("tests.java") or 
                filename.endswith("_test.cpp") or filename.endswith("_tests.cpp"))

    def should_ignore_method(
        self,
        name: str,
        code: str
    ) -> bool:

        return False
    def extract_methods(self, filepath: str) -> List[Dict[str, Any]]:
        """Orchestrates source reads and routes files to correct AST traversal parsers."""
        if self.is_test_file(filepath): 
            return []
        
        ext = os.path.splitext(filepath)[1].lower()
        if ext not in [".java", ".cpp", ".cc", ".cxx", ".hpp", ".h"]: 
            return []

        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                source_code = f.read()
        except Exception as e:
            print(f"[-] Failed reading file for extraction: {filepath}. Error: {e}")
            return []

        if ext == ".java":
            return self._parse_java(source_code, filepath)
        else:
            return self._parse_cpp(source_code, filepath)
        
    def _parse_java(self, source_code: str, filepath: str) -> List[Dict[str, Any]]:
        """Parses Java files recursively utilizing direct AST tree walks."""
        tree = self.java_parser.parse(source_code.encode("utf-8"))
        methods = []

        def traverse(node):
            if node.type in ["method_declaration", "constructor_declaration"]:
                name_node = node.child_by_field_name("name")
                method_name = (
                    source_code[name_node.start_byte:name_node.end_byte]
                    if name_node
                    else "anonymous_method"
                )

                code_fragment = source_code[node.start_byte:node.end_byte]

                if self.should_ignore_method(method_name, code_fragment):
                    return

                methods.append({

                    "fileName":
                        os.path.basename(filepath),

                    "filePath":
                        filepath,

                    "methodName":
                        method_name,

                    "methodCode":
                        code_fragment
                })
                # Terminate branch traversal inside the method signature to avoid scanning nested method definitions twice
                return

            for child in node.children:
                traverse(child)

        traverse(tree.root_node)
        return methods

    def _parse_cpp(self, source_code: str, filepath: str) -> List[Dict[str, Any]]:
        """Parses C++ files recursively utilizing direct AST tree walks."""
        tree = self.cpp_parser.parse(source_code.encode("utf-8"))
        methods = []

        def traverse(node):
            if node.type == "function_definition":
                method_name = "unknown_function"
                declarator = node.child_by_field_name("declarator")

                if declarator:
                    curr = declarator
                    while curr.child_by_field_name("declarator"):
                        curr = curr.child_by_field_name("declarator")

                    identifier = None
                    if curr.type == "identifier":
                        identifier = curr
                    else:
                        for child in curr.children:
                            if child.type == "identifier":
                                identifier = child
                                break

                    if identifier:
                        method_name = source_code[identifier.start_byte:identifier.end_byte]

                code_fragment = source_code[node.start_byte:node.end_byte]

                if self.should_ignore_method(method_name, code_fragment):
                    return

                methods.append({

                    "fileName":
                        os.path.basename(filepath),

                    "filePath":
                        filepath,

                    "methodName":
                        method_name,

                    "methodCode":
                        code_fragment
                })
                return

            for child in node.children:
                traverse(child)

        traverse(tree.root_node)
        return methods