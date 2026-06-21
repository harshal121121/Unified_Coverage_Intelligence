from tree_sitter import Parser, Language
import tree_sitter_java
import tree_sitter_cpp


JAVA_LANGUAGE = Language(tree_sitter_java.language())
CPP_LANGUAGE = Language(tree_sitter_cpp.language())


def get_parser(file_extension):
    parser = Parser()

    if file_extension == ".java":
        parser.language = JAVA_LANGUAGE
        return parser

    elif file_extension in [".cpp", ".cc", ".cxx", ".hpp"]:
        parser.language = CPP_LANGUAGE
        return parser

    return None