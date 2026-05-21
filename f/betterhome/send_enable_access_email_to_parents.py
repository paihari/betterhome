import base64
from email.mime.text import MIMEText
from typing import TypedDict, List
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from datetime import datetime, timedelta, timezone
import pytz


class gmail(TypedDict):
    token: str


def main(
    gmail_resource: gmail,
    to: List[str],
    subject: str,
    body: str,

):
    cet = pytz.timezone("Europe/Paris")
    now_cet = datetime.now(timezone.utc).astimezone(cet)
    enable_time = now_cet
    disable_time = now_cet + timedelta(minutes=50)

    body = (
        f"{body}\n\n"
        f"Access is granted for 50 minutes.\n"
        f"Enable time (CET): {enable_time.strftime('%Y-%m-%d %H:%M:%S %Z')}\n"
        f"Disable time (CET): {disable_time.strftime('%Y-%m-%d %H:%M:%S %Z')}\n\n"
        f"Manage family settings: https://account.microsoft.com/family/home"
    )

    creds = Credentials(token=gmail_resource["token"])
    service = build("gmail", "v1", credentials=creds)

    message = MIMEText(body)
    message["to"] = ", ".join(to)
    message["subject"] = subject

    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    send_message = (
        service.users()
        .messages()
        .send(userId="me", body={"raw": encoded_message})
        .execute()
    )

    return {"message_id": send_message["id"], "status": "sent"}
