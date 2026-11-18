import hashlib
import json
import os
import shutil
import time
from datetime import date
from pathlib import Path

KEEP_BACKUPS = 14


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


class LocalStore:
    """Notes live in one JSON file on disk; every save is atomic."""

    def __init__(self, data_dir: Path):
        self.dir = data_dir
        self.path = data_dir / "notes.json"
        self.backups = data_dir / "backups"
        self.dir.mkdir(parents=True, exist_ok=True)

    def read_bytes(self):
        return self.path.read_bytes() if self.path.exists() else None

    def read_text(self):
        data = self.read_bytes()
        if data is None:
            return None
        try:
            json.loads(data)
            return data.decode("utf-8")
        except (ValueError, UnicodeDecodeError):
            self.path.replace(self.dir / f"notes.corrupt-{int(time.time())}.json")
            return None

    def hash(self):
        data = self.read_bytes()
        return sha256(data) if data is not None else None

    def write(self, data: bytes) -> bool:
        """Returns False when the content is unchanged and nothing was written."""
        if self.path.exists():
            if sha256(self.path.read_bytes()) == sha256(data):
                return False
            self._daily_backup()
        tmp = self.path.with_suffix(".tmp")
        tmp.write_bytes(data)
        os.replace(tmp, self.path)
        return True

    def purge_plain_copies(self) -> int:
        """Deletes backup and quarantine copies that are not encrypted; returns how many were removed."""
        removed = 0
        files = list(self.backups.glob("notes-*.json")) + list(self.dir.glob("notes.corrupt-*.json"))
        for path in files:
            try:
                encrypted = json.loads(path.read_text("utf-8")).get("enc") == 1
            except (ValueError, OSError, AttributeError):
                encrypted = False
            if not encrypted:
                path.unlink(missing_ok=True)
                removed += 1
        return removed

    def _daily_backup(self):
        self.backups.mkdir(exist_ok=True)
        target = self.backups / f"notes-{date.today().isoformat()}.json"
        if not target.exists():
            shutil.copy2(self.path, target)
        for old in sorted(self.backups.glob("notes-*.json"))[:-KEEP_BACKUPS]:
            old.unlink()
