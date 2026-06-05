import requests

from config import (
    EXECUTIVE_API_URL,
    COMPLEXITY_UPLOAD_API,
    COMPLEXITY_RESULTS_API
)


def send_executive_api(data):

    try:

        response = requests.post(
            EXECUTIVE_API_URL,
            json=data,
            timeout=60
        )

        print(
            f"\nExecutive API Status: "
            f"{response.status_code}"
        )

        try:
            print(
                f"Executive API Response: "
                f"{response.text}"
            )
        except:
            pass

        response.raise_for_status()

        return response

    except requests.exceptions.RequestException as e:

        print(
            f"Executive API Error: {e}"
        )

        return None


def upload_complexity_json(data):

    try:

        response = requests.post(
            COMPLEXITY_UPLOAD_API,
            json=data,
            timeout=60
        )

        print(
            f"\nComplexity Upload API Status: "
            f"{response.status_code}"
        )

        try:
            print(
                f"Complexity Upload API Response: "
                f"{response.text}"
            )
        except:
            pass

        response.raise_for_status()

        return response

    except requests.exceptions.RequestException as e:

        print(
            f"Complexity Upload API Error: {e}"
        )

        return None


def send_complexity_results():

    try:

        response = requests.get(
            COMPLEXITY_RESULTS_API,
            timeout=60
        )

        print(
            f"\nComplexity Results API Status: "
            f"{response.status_code}"
        )

        try:
            print(
                f"Complexity Results API Response: "
                f"{response.text}"
            )
        except:
            pass

        response.raise_for_status()

        return response

    except requests.exceptions.RequestException as e:

        print(
            f"Complexity Results API Error: {e}"
        )

        return None