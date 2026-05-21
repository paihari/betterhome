import os
import httpx
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

def main():
    now = datetime.now(ZoneInfo("Europe/Paris"))
    scheduled_time = now + timedelta(minutes=50)
    cron_expr = f"{scheduled_time.second} {scheduled_time.minute} {scheduled_time.hour} {scheduled_time.day} {scheduled_time.month} *"

    base_url = os.environ.get("WM_BASE_URL", "http://localhost:8000")
    token = os.environ.get("WM_TOKEN", "")
    workspace = os.environ.get("WM_WORKSPACE", "")
    headers = {"Authorization": f"Bearer {token}"}
    schedule_path = "f/betterhome/disable_youtube_access"

    try:
        get_url = f"{base_url}/api/w/{workspace}/schedules/get/{schedule_path}"
        response = httpx.get(get_url, headers=headers)
        response.raise_for_status()
        scheduler = response.json()
    except Exception as e:
        return {"error": f"Could not retrieve schedule: {str(e)}"}

    try:
        update_url = f"{base_url}/api/w/{workspace}/schedules/update/{schedule_path}"
        update_payload = {
            "schedule": cron_expr,
            "timezone": scheduler.get("timezone", "UTC"),
            "script_path": scheduler.get("script_path"),
            "is_flow": scheduler.get("is_flow", False),
            "args": scheduler.get("args", {}),
            "enabled": True,
            "cron_version": scheduler.get("cron_version", "v2"),
        }
        update_response = httpx.post(update_url, json=update_payload, headers=headers)
        update_response.raise_for_status()
        update_result = update_response.text
    except Exception as e:
        return {"error": f"Could not update schedule: {str(e)}"}

    return {
        "cron_expr": cron_expr,
        "scheduled_time": scheduled_time.isoformat(),
        "update_result": update_result,
        "updated_schedule": {**scheduler, "schedule": cron_expr},
    }
