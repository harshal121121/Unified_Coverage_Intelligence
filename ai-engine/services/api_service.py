import requests

from config import (
    EXECUTIVE_API_URL,
    COMPLEXITY_UPLOAD_API,
    COMPLEXITY_RESULTS_API,
    BUG_ANALYSIS_API,

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

        payload = {

            "totalMethods":

                data.get(
                    "totalMethods",
                    0
                ),

            "methods":

                data.get(
                    "methods",
                    []
                )
        }

        import json

        print("\nUploading Complexity Payload...")

        print(

            json.dumps(

                payload,

                indent=4,

                ensure_ascii=False

            )
        )

        response = requests.post(

            COMPLEXITY_UPLOAD_API,

            json=payload,

            timeout=300
        )

        print(

            f"\nComplexity Upload API Status: "

            f"{response.status_code}"
        )

        print(

            f"\nUploaded {payload['totalMethods']} methods."
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

            f"Complexity Upload API Error: "

            f"{e}"
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

    
def upload_bug_analysis(data):

    try:

        response = requests.post(

            BUG_ANALYSIS_API,

            json=data,

            timeout=300
        )

        print(

            f"\nBug Analysis API Status: "

            f"{response.status_code}"
        )

        try:

            print(

                f"Bug Analysis API Response: "

                f"{response.text}"
            )

        except:

            pass

        response.raise_for_status()

        return response

    except requests.exceptions.RequestException as e:

        print(

            f"Bug Analysis API Error: "

            f"{e}"
        )

        return None