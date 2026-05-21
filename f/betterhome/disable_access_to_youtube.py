import os
import wmill
import requests

# You can import any PyPi package. 
# See here for more info: https://www.windmill.dev/docs/advanced/dependencies_in_python

# you can use typed resources by doing a type alias to dict
#postgresql = dict

API_KEY = wmill.get_variable("f/betterhome/nextdns_api_key")
PROFILE_ID = wmill.get_variable("f/betterhome/nextdns_profile_id")

BASE = f"https://api.nextdns.io/profiles/{PROFILE_ID}"
HEADERS = {
    "X-Api-Key": API_KEY,
    "Content-Type": "application/json",
}

SERVICE_ID = "youtube"

def main(

):
    blocked = True
    set_youtube_blocked(blocked)

    services = get_parental_control_services()
    service = next((s for s in services if s.get("id") == SERVICE_ID), None)

    result = {
        "app": SERVICE_ID,
        "action": "blocked" if blocked else "unblocked",
        "active": service.get("active") if service else None,
        "service_details": service,
    }

    print(f"Result: {result}")
    return result


def get_parental_control_services():
    return request("GET", f"{BASE}/parentalControl/services") or []

def set_youtube_blocked(blocked: bool):
    services = get_parental_control_services()
    exists = any(s.get("id") == SERVICE_ID for s in services)

    if exists:
        request(
            "PATCH",
            f"{BASE}/parentalControl/services/{SERVICE_ID}",
            json={"active": blocked},
        )
    else:
        request(
            "POST",
            f"{BASE}/parentalControl/services",
            json={"id": SERVICE_ID, "active": blocked},
        )

    print(f"YouTube blocked = {blocked}")


def request(method, url, **kwargs):
    r = requests.request(method, url, headers=HEADERS, timeout=20, **kwargs)
    if r.status_code == 204 or not r.content:
        r.raise_for_status()
        return None
    r.raise_for_status()
    data = r.json()
    if "errors" in data:
        raise RuntimeError(data["errors"])
    return data.get("data")
