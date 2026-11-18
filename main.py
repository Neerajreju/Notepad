"""Study Notepad desktop app: a native window around the web UI, with notes saved on disk."""
import json
import os
import sys
import threading
import webbrowser
from datetime import date
from pathlib import Path

import webview

from drive_sync import DriveSync
from storage import LocalStore, sha256

ROOT = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
DATA_DIR = Path(os.environ.get("STUDY_NOTEPAD_DIR") or Path.home() / "StudyNotepad")


def _first(result):
    if not result:
        return None
    return result[0] if isinstance(result, (list, tuple)) else result


def _fail(e: Exception) -> dict:
    if isinstance(e, ImportError):
        return {"ok": False, "message": "Google libraries are missing. Run: pip install -r requirements.txt"}
    return {"ok": False, "message": str(e) or e.__class__.__name__}


class Api:
    """Methods here are callable from JavaScript as window.pywebview.api.<name>()."""

    def __init__(self):
        self._store = LocalStore(DATA_DIR)
        self._drive = DriveSync(DATA_DIR)
        self._lock = threading.Lock()
        self._window = None

    def load(self):
        with self._lock:
            return self._store.read_text()

    def save(self, text):
        try:
            json.loads(text)
            with self._lock:
                self._store.write(text.encode("utf-8"))
            return self.status()
        except Exception as e:
            return _fail(e)

    def status(self):
        meta = self._drive.meta()
        local = self._store.hash()
        return {
            "ok": True,
            "configured": self._drive.configured(),
            "signed_in": self._drive.signed_in(),
            "last_sync": meta.get("last_time"),
            "pending": local is not None and local != meta.get("last_hash"),
            "data_dir": str(DATA_DIR),
        }

    def sync(self):
        try:
            with self._lock:
                data = self._store.read_bytes()
            if data is None:
                return {"ok": False, "message": "There is nothing to sync yet."}
            self._drive.push(data, sha256(data))
            return self.status()
        except Exception as e:
            return _fail(e)

    def pull(self):
        try:
            data = self._drive.pull()
            json.loads(data)
            with self._lock:
                self._store.write(data)
            self._drive.mark_synced(sha256(data))
            return self.status()
        except Exception as e:
            return _fail(e)

    def drive_save_client(self, client_id, client_secret):
        return self._drive_action(lambda: self._drive.save_client(client_id, client_secret))

    def drive_import_client(self):
        src = _first(self._dialog("open"))
        if not src:
            return {"ok": False, "message": ""}
        return self._drive_action(lambda: self._drive.import_client(Path(src).read_text("utf-8")))

    def drive_sign_in(self):
        return self._drive_action(self._drive.sign_in)

    def drive_sign_out(self):
        return self._drive_action(self._drive.sign_out)

    def drive_remove_client(self):
        return self._drive_action(self._drive.remove_client)

    def drive_account(self):
        return {"ok": True, "email": self._drive.account_email() if self._drive.signed_in() else None}

    def drive_open_console(self):
        webbrowser.open("https://console.cloud.google.com/apis/credentials")
        return {"ok": True}

    def _drive_action(self, fn):
        try:
            fn()
            return self.status()
        except Exception as e:
            return _fail(e)

    def export_backup(self):
        try:
            dest = _first(self._dialog("save", f"study-notepad-backup-{date.today().isoformat()}.json"))
            if not dest:
                return {"ok": True, "message": ""}
            with self._lock:
                data = self._store.read_bytes() or b"{}"
            Path(dest).write_bytes(data)
            return {"ok": True, "message": "Backup saved"}
        except Exception as e:
            return _fail(e)

    def pick_backup(self):
        try:
            src = _first(self._dialog("open"))
            if not src:
                return {"ok": False, "message": ""}
            return {"ok": True, "data": Path(src).read_text("utf-8")}
        except Exception as e:
            return _fail(e)

    def purge_plain_backups(self):
        try:
            with self._lock:
                return {"ok": True, "removed": self._store.purge_plain_copies()}
        except Exception as e:
            return _fail(e)

    def save_export(self, filename, content):
        try:
            ext = Path(filename).suffix.lower()
            label = {".doc": "Word documents (*.doc)", ".txt": "Text files (*.txt)", ".md": "Markdown files (*.md)"}.get(ext, "All files (*.*)")
            dest = _first(self._dialog("save", filename, (label,)))
            if not dest:
                return {"ok": True, "message": ""}
            dest = Path(dest)
            if not dest.suffix:
                dest = dest.with_suffix(ext)
            dest.write_bytes(content.encode("utf-8"))
            return {"ok": True, "message": f"Saved {dest.name}"}
        except Exception as e:
            return _fail(e)

    def _dialog(self, kind, filename="", types=("JSON files (*.json)",)):
        file_dialog = getattr(webview, "FileDialog", None)
        if kind == "save":
            mode = file_dialog.SAVE if file_dialog else webview.SAVE_DIALOG
            return self._window.create_file_dialog(mode, save_filename=filename, file_types=types)
        mode = file_dialog.OPEN if file_dialog else webview.OPEN_DIALOG
        return self._window.create_file_dialog(mode, file_types=types)


def main():
    api = Api()
    window = webview.create_window(
        "Study Notepad", str(ROOT / "index.html"), js_api=api,
        width=1320, height=860, min_size=(900, 600), background_color="#12141a",
    )
    api._window = window
    webview.start()


if __name__ == "__main__":
    main()
