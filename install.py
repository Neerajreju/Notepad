"""Installs Study Notepad from source on Windows, macOS or Linux (needs Python 3.9+ and internet for pip).

    python install.py              install or update
    python install.py --uninstall  remove the app (your notes stay in ~/StudyNotepad)
"""
import argparse
import os
import shutil
import subprocess
import sys
import venv
from pathlib import Path

APP_NAME = "Study Notepad"
FILES = ["main.py", "storage.py", "drive_sync.py", "index.html", "app.js", "styles.css", "highlighter.js", "requirements.txt"]
ASSETS = ["app.ico", "app.png"]
SRC = Path(__file__).resolve().parent
WIN, MAC = sys.platform.startswith("win"), sys.platform == "darwin"


def install_dir() -> Path:
    if WIN:
        return Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData/Local")) / "Programs" / "StudyNotepad"
    if MAC:
        return Path.home() / "Library" / "Application Support" / "StudyNotepad-App"
    return Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local/share")) / "study-notepad"


def python_exe(target: Path, windowed: bool = False) -> Path:
    if WIN:
        return target / ".venv" / "Scripts" / ("pythonw.exe" if windowed else "python.exe")
    return target / ".venv" / "bin" / "python"


def run(cmd, **kw):
    subprocess.run([str(c) for c in cmd], check=True, **kw)


def make_launchers(target: Path):
    main = target / "main.py"
    if WIN:
        desktop = Path(os.environ.get("USERPROFILE", Path.home())) / "Desktop"
        start = Path(os.environ["APPDATA"]) / "Microsoft/Windows/Start Menu/Programs"
        for folder in (start, desktop):
            ps = (
                "$s=(New-Object -ComObject WScript.Shell).CreateShortcut('%s');"
                "$s.TargetPath='%s';$s.Arguments='\"%s\"';$s.WorkingDirectory='%s';$s.IconLocation='%s';$s.Save()"
                % (folder / f"{APP_NAME}.lnk", python_exe(target, True), main, target, target / "assets/app.ico")
            )
            run(["powershell", "-NoProfile", "-Command", ps])
    elif MAC:
        launcher = Path.home() / "Applications" / f"{APP_NAME}.command"
        launcher.parent.mkdir(exist_ok=True)
        launcher.write_text(f'#!/bin/bash\ncd "{target}"\nnohup "{python_exe(target)}" main.py >/dev/null 2>&1 &\n')
        launcher.chmod(0o755)
    else:
        script = Path.home() / ".local/bin/study-notepad"
        script.parent.mkdir(parents=True, exist_ok=True)
        script.write_text(f'#!/bin/sh\ncd "{target}"\nexec "{python_exe(target)}" main.py "$@"\n')
        script.chmod(0o755)
        entry = Path.home() / ".local/share/applications/study-notepad.desktop"
        entry.parent.mkdir(parents=True, exist_ok=True)
        entry.write_text(
            f"[Desktop Entry]\nType=Application\nName={APP_NAME}\nExec={script}\n"
            f"Icon={target / 'assets/app.png'}\nCategories=Office;Education;\nTerminal=false\n"
        )


def remove_launchers():
    paths = [Path.home() / "Applications" / f"{APP_NAME}.command",
             Path.home() / ".local/bin/study-notepad",
             Path.home() / ".local/share/applications/study-notepad.desktop"]
    if WIN:
        paths += [Path(os.environ["APPDATA"]) / "Microsoft/Windows/Start Menu/Programs" / f"{APP_NAME}.lnk",
                  Path(os.environ.get("USERPROFILE", Path.home())) / "Desktop" / f"{APP_NAME}.lnk"]
    for p in paths:
        p.unlink(missing_ok=True)


def install():
    if sys.version_info < (3, 9):
        sys.exit("Python 3.9 or newer is required.")
    target = install_dir()
    target.mkdir(parents=True, exist_ok=True)
    (target / "assets").mkdir(exist_ok=True)
    for name in FILES:
        shutil.copy2(SRC / name, target / name)
    for name in ASSETS:
        if (SRC / "assets" / name).exists():
            shutil.copy2(SRC / "assets" / name, target / "assets" / name)

    print("Setting up a private Python environment...")
    if not python_exe(target).exists():
        venv.create(target / ".venv", with_pip=True)
    reqs = (target / "requirements.txt").read_text().split()
    if not (WIN or MAC):
        reqs = ["pywebview[qt]" if r.startswith("pywebview") else r for r in reqs]
    run([python_exe(target), "-m", "pip", "install", "--quiet", "--upgrade", "pip"])
    run([python_exe(target), "-m", "pip", "install", "--quiet", *reqs])

    make_launchers(target)
    print(f"\n{APP_NAME} is installed in {target}")
    print("Your notes are kept in", Path.home() / "StudyNotepad")
    if WIN:
        print("It needs the Microsoft Edge WebView2 Runtime (already present on current Windows 10/11).")


def uninstall():
    remove_launchers()
    shutil.rmtree(install_dir(), ignore_errors=True)
    print(f"{APP_NAME} was removed. Your notes in {Path.home() / 'StudyNotepad'} were left untouched.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=f"Install {APP_NAME}")
    parser.add_argument("--uninstall", action="store_true", help="remove the app")
    uninstall() if parser.parse_args().uninstall else install()
