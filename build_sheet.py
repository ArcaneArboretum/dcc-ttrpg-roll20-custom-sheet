#!/usr/bin/env python3
"""
Builds sheet_compiled.html for the Roll20 character sheet.

Folder layout (everything is relative to the folder this script lives in):

    build_sheet.py
    build_sheet.bat
    sheet_compiled.html   final sheet output from this script.
    sheet.html            sheet markup
    sheet.css             not touched; paste it into Roll20's CSS tab separately
    roll_template.html    <rolltemplate> blocks
    scripts.html          GENERATED: overwritten on every run
    scripts/              one or more .js sheet-worker files
        *.js

What it does:
  1. Reads every .js file directly inside scripts/ (alphabetical order, so name
     them 01_xxx.js, 02_xxx.js ... if order matters) and overwrites scripts.html with
         <!-- SHEET WORKERS -->
         <script type="text/worker"> a script </script>
         <script type="text/worker"> next script </script>
         ...
  2. Joins sheet.html + roll_template.html + scripts.html into sheet_compiled.html.

All scripts go into separate <script type="text/worker"> tag so they do not share a scope,
and a variable or function declared in one file doesn't clash with another.
"""

import re
import sys
from pathlib import Path
 
BASE_DIR = Path(__file__).resolve().parent
SCRIPTS_DIR = BASE_DIR / "scripts"
 
SHEET_HTML = BASE_DIR / "sheet.html"
ROLL_TEMPLATE_HTML = BASE_DIR / "roll_template.html"
SCRIPTS_HTML = BASE_DIR / "scripts.html"
OUTPUT_HTML = BASE_DIR / "sheet_compiled.html"
 
HEADER_COMMENT = "<!-- SHEET WORKERS -->"
 
# True: each file is wrapped in (function () { ... })(); so its names stay private to it.
# False: files are pasted in as-is and share one scope (a duplicate const/let name then
# becomes a syntax error that stops ALL scripts from loading).
ISOLATE_SCRIPTS = False
 
 
def read_text(path: Path) -> str:
    # utf-8-sig strips a BOM if an editor added one; universal newlines turn CRLF into LF
    with open(path, "r", encoding="utf-8-sig") as f:
        return f.read()
 
 
def write_text(path: Path, text: str) -> None:
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
 
 
def escape_for_script_tag(js: str, name: str) -> str:
    """
    Makes JavaScript safe to place inside <script>...</script>.
 
    - "</script" would end the tag early, so it becomes "<\\/script". In a string, regex
      or comment that is the same text to JavaScript, so behaviour doesn't change.
    - "<!--" can confuse the HTML parser inside a script, so it becomes "<\\!--".
    """
    js, n_close = re.subn(r"</(?=script)", r"<\\/", js, flags=re.IGNORECASE)
    js, n_comment = re.subn(r"<!--", r"<\\!--", js)
    if n_close:
        print(f"  note: escaped {n_close} '</script' sequence(s) in {name}")
    if n_comment:
        print(f"  note: escaped {n_comment} '<!--' sequence(s) in {name}")
    return js
 
 
def build_scripts_html() -> str:
    js_files = sorted(
        (p for p in SCRIPTS_DIR.glob("*.js") if p.is_file()),
        key=lambda p: p.name.lower(),
    )
 
    if not js_files:
        print(f"  warning: no .js files found in {SCRIPTS_DIR.name}/; scripts.html will have no worker tag")
        return HEADER_COMMENT + "\n"
 
    chunks = []
    for path in js_files:
        print(f"  + {SCRIPTS_DIR.name}/{path.name}")
        body = escape_for_script_tag(read_text(path), path.name).strip("\n")
        if ISOLATE_SCRIPTS:
            # the closing line is on its own line so a trailing // comment in the file can't swallow it
            body = f"(function () {{\n{body}\n}})();"
        chunks.append(f"// ===== {path.name} =====\n{body}")
 
    return (
        HEADER_COMMENT + "\n"
        '<script type="text/worker">\n'
        + "\n\n".join(chunks)
        + "\n</script>\n"
    )
 
 
def main() -> int:
    missing = [p for p in (SHEET_HTML, ROLL_TEMPLATE_HTML) if not p.is_file()]
    if not SCRIPTS_DIR.is_dir():
        missing.append(SCRIPTS_DIR)
    if missing:
        print("ERROR: required file(s) or folder(s) not found:")
        for p in missing:
            print(f"  - {p}")
        return 1
 
    print("Reading worker scripts:")
    scripts_html = build_scripts_html()
    write_text(SCRIPTS_HTML, scripts_html)
    print(f"Wrote {SCRIPTS_HTML.name}")
 
    parts = [read_text(SHEET_HTML), read_text(ROLL_TEMPLATE_HTML), scripts_html]
    compiled = "\n".join(part.rstrip() + "\n" for part in parts)
    write_text(OUTPUT_HTML, compiled)
    print(f"Wrote {OUTPUT_HTML.name} ({len(compiled):,} characters)")
    return 0
 
 
if __name__ == "__main__":
    sys.exit(main())
 
