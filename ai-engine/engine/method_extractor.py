import os

from services.parser_service import (
    get_parser
)


def extract_methods(

    filepath,

    code

):

    extension = os.path.splitext(
        filepath
    )[1]

    parser = get_parser(
        extension
    )

    if parser is None:

        return []

    tree = parser.parse(

        bytes(
            code,
            "utf8"
        )

    )

    root = tree.root_node

    methods = []

    traverse(

        root,

        code,

        methods,

        extension

    )

    return methods