from pathlib import Path


def get_surrounding_code(
    repository_root,
    relative_file_path,
    line_number,
    context_lines=15
):

    try:

        relative_parts = Path(
            relative_file_path
        ).parts

        if len(relative_parts) > 1:

            relative_file_path = str(

                Path(
                    *relative_parts[1:]
                )

            )

        file_path = (

            Path(repository_root)

            /

            relative_file_path

        )

        print(
            f"\nSearching File: "
            f"{file_path}"
        )

        if not file_path.exists():

            return (

                f"Unable to locate source file: "
                f"{relative_file_path}"

            )

        with open(

            file_path,

            "r",

            encoding="utf-8",

            errors="ignore"

        ) as file:

            lines = file.readlines()

        start = max(

            0,

            line_number - context_lines - 1

        )

        end = min(

            len(lines),

            line_number + context_lines

        )

        snippet = []

        for index in range(

            start,

            end

        ):

            snippet.append(

                f"{index + 1}: "

                f"{lines[index].rstrip()}"

            )

        return "\n".join(
            snippet
        )

    except Exception as error:

        return (

            f"Unable to extract source context: "

            f"{str(error)}"

        )