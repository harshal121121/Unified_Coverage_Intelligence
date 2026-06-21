import os

from git import Repo

from config import (

    JAVA_REPO_URL,

    CPP_REPO_URL
)


REPOSITORIES = [

    JAVA_REPO_URL,

    CPP_REPO_URL
]


def clone_or_pull_repositories():

    repo_paths = []

    os.makedirs(

        "repositories",

        exist_ok=True
    )

    for repo_url in REPOSITORIES:

        repo_name = repo_url.split("/")[-1].replace(".git", "")

        local_path = os.path.join(

            "repositories",

            repo_name
        )

        repo_paths.append(local_path)

        if not os.path.exists(local_path):

            print(f"\nCloning Repository: {repo_name}")

            Repo.clone_from(

                repo_url,

                local_path
            )

        else:

            print(f"\nPulling Latest Changes: {repo_name}")

            repo = Repo(local_path)

            repo.remotes.origin.pull()

    return repo_paths