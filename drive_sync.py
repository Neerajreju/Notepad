"""Google Drive sync: uploads notes.json to a "Study Notepad" folder in the user's Drive.

Setup: create an OAuth client of type "Desktop app" in Google Cloud Console, enable the
Drive API, download the client file and save it as credentials.json in the data folder.
The first sync opens a browser window for consent; the token is cached in token.json.
"""
import io
import json
from datetime import datetime
from pathlib import Path

SCOPES = ["https://www.googleapis.com/auth/drive.file"]
FOLDER_NAME = "Study Notepad"
FILE_NAME = "notes.json"
FOLDER_MIME = "application/vnd.google-apps.folder"


class DriveSync:
    def __init__(self, data_dir: Path):
        self.credentials_path = data_dir / "credentials.json"
        self.token_path = data_dir / "token.json"
        self.meta_path = data_dir / "drive_meta.json"

    def configured(self) -> bool:
        return self.credentials_path.exists()

    def signed_in(self) -> bool:
        return self.token_path.exists()

    def save_client(self, client_id: str, client_secret: str):
        client_id, client_secret = client_id.strip(), client_secret.strip()
        if not client_id.endswith(".apps.googleusercontent.com"):
            raise ValueError("The Client ID should end with .apps.googleusercontent.com")
        if not client_secret:
            raise ValueError("Enter the Client secret.")
        self._write_client({"installed": {"client_id": client_id, "client_secret": client_secret}})

    def import_client(self, text: str):
        try:
            data = json.loads(text)
        except ValueError:
            raise ValueError("That file is not valid JSON.")
        cfg = data.get("installed") if isinstance(data, dict) else None
        if not cfg or not cfg.get("client_id") or not cfg.get("client_secret"):
            raise ValueError('Not a Desktop app client file. In Google Cloud choose application type "Desktop app".')
        self._write_client({"installed": cfg})

    def _write_client(self, data: dict):
        data["installed"].setdefault("auth_uri", "https://accounts.google.com/o/oauth2/auth")
        data["installed"].setdefault("token_uri", "https://oauth2.googleapis.com/token")
        data["installed"].setdefault("redirect_uris", ["http://localhost"])
        self.credentials_path.write_text(json.dumps(data), "utf-8")
        self.sign_out()

    def sign_out(self):
        self.token_path.unlink(missing_ok=True)
        self.meta_path.unlink(missing_ok=True)

    def remove_client(self):
        self.sign_out()
        self.credentials_path.unlink(missing_ok=True)

    def sign_in(self):
        self._service()

    def account_email(self):
        try:
            about = self._service().about().get(fields="user(emailAddress)").execute()
            return about.get("user", {}).get("emailAddress")
        except Exception:
            return None

    def meta(self) -> dict:
        try:
            return json.loads(self.meta_path.read_text("utf-8"))
        except (OSError, ValueError):
            return {}

    def _save_meta(self, **changes):
        meta = {**self.meta(), **changes}
        self.meta_path.write_text(json.dumps(meta), "utf-8")

    def mark_synced(self, digest: str):
        self._save_meta(last_hash=digest, last_time=datetime.now().astimezone().isoformat(timespec="seconds"))

    def _service(self):
        from google.auth.exceptions import RefreshError
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build

        if not self.configured():
            raise RuntimeError(f"credentials.json not found in {self.credentials_path.parent}")
        creds = None
        if self.token_path.exists():
            creds = Credentials.from_authorized_user_file(str(self.token_path), SCOPES)
        if not creds or not creds.valid:
            try:
                if creds and creds.expired and creds.refresh_token:
                    creds.refresh(Request())
                else:
                    creds = None
            except RefreshError:
                creds = None
            if creds is None:
                flow = InstalledAppFlow.from_client_secrets_file(str(self.credentials_path), SCOPES)
                creds = flow.run_local_server(
                    port=0, timeout_seconds=300,
                    success_message="Signed in. You can close this tab and return to Study Notepad.")
            self.token_path.write_text(creds.to_json(), "utf-8")
        return build("drive", "v3", credentials=creds, cache_discovery=False)

    def _folder_id(self, svc) -> str:
        cached = self.meta().get("folder_id")
        if cached:
            return cached
        q = f"mimeType='{FOLDER_MIME}' and name='{FOLDER_NAME}' and trashed=false"
        found = svc.files().list(q=q, fields="files(id)", pageSize=1).execute().get("files", [])
        if found:
            folder = found[0]["id"]
        else:
            folder = svc.files().create(body={"name": FOLDER_NAME, "mimeType": FOLDER_MIME}, fields="id").execute()["id"]
        self._save_meta(folder_id=folder)
        return folder

    def _file_id(self, svc, folder: str):
        cached = self.meta().get("file_id")
        if cached:
            return cached
        q = f"name='{FILE_NAME}' and '{folder}' in parents and trashed=false"
        found = svc.files().list(q=q, fields="files(id)", pageSize=1).execute().get("files", [])
        return found[0]["id"] if found else None

    def push(self, data: bytes, digest: str):
        from googleapiclient.errors import HttpError
        from googleapiclient.http import MediaIoBaseUpload

        svc = self._service()
        folder = self._folder_id(svc)
        file_id = self._file_id(svc, folder)
        media = MediaIoBaseUpload(io.BytesIO(data), mimetype="application/json")
        if file_id:
            try:
                svc.files().update(fileId=file_id, media_body=media).execute()
            except HttpError as e:
                if e.resp.status != 404:
                    raise
                file_id = None
                media = MediaIoBaseUpload(io.BytesIO(data), mimetype="application/json")
        if not file_id:
            file_id = svc.files().create(
                body={"name": FILE_NAME, "parents": [folder]}, media_body=media, fields="id").execute()["id"]
        self._save_meta(file_id=file_id)
        self.mark_synced(digest)

    def pull(self) -> bytes:
        from googleapiclient.http import MediaIoBaseDownload

        svc = self._service()
        file_id = self._file_id(svc, self._folder_id(svc))
        if not file_id:
            raise RuntimeError("No notes found on Google Drive yet. Sync to Drive first.")
        self._save_meta(file_id=file_id)
        buf = io.BytesIO()
        downloader = MediaIoBaseDownload(buf, svc.files().get_media(fileId=file_id))
        done = False
        while not done:
            _, done = downloader.next_chunk()
        return buf.getvalue()
