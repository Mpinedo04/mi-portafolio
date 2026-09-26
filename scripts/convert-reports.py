#!/usr/bin/env python3
"""Convert the four legacy case-study HTML files into Sanity Portable Text JSON."""

from html.parser import HTMLParser
from html import unescape
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src" / "data" / "reports"
REPORTS = [
    ("GUIA_LAB_SOC_WAZUH.html", "guia-lab-soc-wazuh"),
    ("INFORME_INCIDENTE_SSH_SOC-2026-001.html", "incidente-ssh-soc-2026-001"),
    ("INFORME_INCIDENTE_POWERSHELL_SOC-2026-002.html", "incidente-powershell-soc-2026-002"),
    ("INFORME_INCIDENTE_FIM_SOC-2026-003.html", "incidente-fim-soc-2026-003"),
]


class ReportParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.body = []
        self.block = None
        self.inline_marks = []
        self.links = []
        self.skip_depth = 0
        self.skip_root = None
        self.skip_tags = {"script", "style", "svg", "dialog", "nav", "noscript"}
        self.pre_depth = 0
        self.pre_text = []
        self.table = None
        self.row = None
        self.cell = None
        self.cell_depth = 0
        self.list_stack = []
        self.image_caption = ""
        self.figcaption_depth = 0
        self.key_num = 0
        self.download = None
        self.download_depth = 0

    def key(self):
        self.key_num += 1
        return f"pt{self.key_num:05d}"

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if self.skip_depth:
            if tag in self.skip_tags:
                self.skip_depth += 1
            return
        classes = set(attrs.get("class", "").split())
        skip_element = tag in self.skip_tags or (tag == "aside" and "sidebar" in classes) or (tag == "header" and bool(classes & {"mobile-header", "topbar"}))
        if skip_element:
            self.skip_depth = 1
            self.skip_root = tag
            return
        if self.figcaption_depth:
            self.figcaption_depth += 1
        if tag == "figcaption":
            self.flush_block()
            self.figcaption_depth = 1
            self.image_caption = ""
        if tag in {"ul", "ol"}:
            self.list_stack.append("number" if tag == "ol" else "bullet")
            return
        if tag == "li":
            self.flush_block()
            self.block = self.new_block("normal")
            self.block["listItem"] = self.list_stack[-1] if self.list_stack else "bullet"
            self.block["level"] = max(1, len(self.list_stack))
            return
        if tag == "table" and self.table is None:
            self.flush_block()
            self.table = {"rows": []}
            return
        if self.table is not None:
            if tag == "tr":
                self.row = []
            elif tag in {"td", "th"}:
                self.cell = []
                self.cell_depth = 1
            elif self.cell is not None:
                self.cell_depth += 1
            return
        if self.pre_depth:
            self.pre_depth += tag == "pre"
            return
        if tag == "pre":
            self.flush_block()
            self.pre_depth = 1
            self.pre_text = []
            return
        if tag == "img":
            self.flush_block()
            src = attrs.get("src", "")
            if src.startswith("assets/"):
                src = "/" + src
            elif src and not src.startswith(("/", "http://", "https://", "data:")):
                src = "/assets/" + src
            self.body.append({
                "_type": "reportImage", "_key": self.key(), "url": src,
                "alt": attrs.get("alt", ""), "caption": "",
            })
            return
        if tag == "a":
            self.separate_inline_text()
            href = attrs.get("href", "")
            if "download" in attrs:
                self.download = {"url": self.local_url(href), "text": []}
                self.download_depth = 1
                return
            if href:
                mark_key = self.key()
                self.links.append({"_key": mark_key, "_type": "link", "href": self.local_url(href)})
                self.inline_marks.append(("link", mark_key))
            return
        if tag == "span":
            self.separate_inline_text()
        if tag in {"strong", "b"}:
            self.inline_marks.append(("strong", None))
        elif tag in {"em", "i"}:
            self.inline_marks.append(("em", None))
        elif tag == "code":
            self.inline_marks.append(("code", None))
        if self.figcaption_depth and tag != "figcaption":
            return
        if tag in {"div", "article", "section", "main", "figure", "dl", "dt", "dd", "details", "summary"}:
            self.flush_block()
        if self.block is None and tag in {"p", "h1", "h2", "h3", "h4", "blockquote"}:
            style = "blockquote" if tag == "blockquote" else ("normal" if tag == "p" else ("h3" if tag == "h4" else tag))
            self.block = self.new_block(style)
        if tag == "br":
            self.append_text("\n")

    def handle_endtag(self, tag):
        if self.skip_depth:
            if tag in self.skip_tags or tag == self.skip_root:
                self.skip_depth -= 1
                if self.skip_depth == 0:
                    self.skip_root = None
            return
        if self.figcaption_depth:
            self.figcaption_depth -= 1
            if tag == "figcaption":
                caption = self.image_caption.strip()
                for item in reversed(self.body):
                    if item.get("_type") == "reportImage" and not item.get("caption"):
                        item["caption"] = caption
                        break
                self.image_caption = ""
            return
        if tag in {"ul", "ol"}:
            self.flush_block()
            if self.list_stack:
                self.list_stack.pop()
            return
        if tag == "li":
            self.flush_block()
            return
        if self.table is not None:
            if tag in {"td", "th"} and self.cell is not None:
                self.table["rows"].append([]) if self.row is None else None
                self.row.append(self.normalized("".join(self.cell)))
                self.cell = None
                self.cell_depth = 0
            elif tag == "tr" and self.row is not None:
                self.table["rows"].append(self.row)
                self.row = None
            elif tag == "table":
                if self.row:
                    self.table["rows"].append(self.row)
                if self.table["rows"]:
                    rows = [
                        {"_type": "reportTableRow", "_key": self.key(), "cells": row}
                        for row in self.table["rows"]
                    ]
                    self.body.append({"_type": "reportTable", "_key": self.key(), "rows": rows})
                self.table = None
            elif self.cell is not None:
                self.cell_depth -= 1
            return
        if self.pre_depth:
            self.pre_depth -= tag == "pre"
            if self.pre_depth == 0:
                code = "".join(self.pre_text).strip("\n")
                if code:
                    self.body.append({"_type": "codeBlock", "_key": self.key(), "language": "text", "code": code, "caption": ""})
                self.pre_text = []
            return
        if tag == "a" and self.download is not None:
            text = self.normalized("".join(self.download["text"]))
            self.body.append({"_type": "downloadLink", "_key": self.key(), "label": text or "Descargar archivo", "url": self.download["url"]})
            self.download = None
            self.download_depth = 0
            return
        if tag == "a":
            self.pop_mark("link")
            return
        if tag in {"strong", "b"}:
            self.pop_mark("strong")
        elif tag in {"em", "i"}:
            self.pop_mark("em")
        elif tag == "code":
            self.pop_mark("code")
        if tag in {"p", "h1", "h2", "h3", "h4", "blockquote"}:
            self.flush_block()
        if tag in {"div", "article", "section", "main", "figure", "dl", "dt", "dd", "details", "summary"}:
            self.flush_block()

    def handle_data(self, data):
        if self.skip_depth:
            return
        if self.pre_depth:
            self.pre_text.append(data)
            return
        if self.table is not None and self.cell is not None:
            self.cell.append(data)
            return
        if self.download is not None:
            self.download["text"].append(data)
            return
        if self.figcaption_depth:
            self.image_caption += data
            return
        self.append_text(data)

    def new_block(self, style):
        return {"_type": "block", "_key": self.key(), "style": style, "children": [], "markDefs": []}

    def append_text(self, text):
        if not text:
            return
        if self.block is None:
            if text.strip():
                self.block = self.new_block("normal")
            else:
                return
        marks = []
        for mark, key in self.inline_marks:
            if mark == "link":
                marks.append(key)
            elif mark not in marks:
                marks.append(mark)
        if self.links:
            self.block["markDefs"] = list({item["_key"]: item for item in self.links}.values())
        children = self.block["children"]
        if children and children[-1]["marks"] == marks:
            children[-1]["text"] += text
        else:
            children.append({"_type": "span", "_key": self.key(), "text": text, "marks": marks})

    def separate_inline_text(self):
        if not self.block or self.block["style"] not in {"normal", "blockquote"}:
            return
        children = self.block["children"]
        if children and children[-1]["text"] and not children[-1]["text"][-1].isspace():
            self.append_text(" ")

    def pop_mark(self, mark):
        for index in range(len(self.inline_marks) - 1, -1, -1):
            if self.inline_marks[index][0] == mark:
                self.inline_marks.pop(index)
                break

    def flush_block(self):
        if not self.block:
            return
        for child in self.block["children"]:
            child["text"] = re.sub(r"[ \t\r\n]+", " ", child["text"])
        text = "".join(child["text"] for child in self.block["children"]).strip()
        if text:
            self.body.append(self.block)
        self.block = None
        self.links = []
        self.inline_marks = []

    @staticmethod
    def normalized(value):
        return re.sub(r"\s+", " ", unescape(value)).strip()

    @staticmethod
    def local_url(value):
        legacy_routes = {
            "GUIA_LAB_SOC_WAZUH.html": "/proyectos/laboratorio-soc-wazuh/informe/guia-lab-soc-wazuh",
            "INFORME_INCIDENTE_SSH_SOC-2026-001.html": "/proyectos/laboratorio-soc-wazuh/informe/incidente-ssh-soc-2026-001",
            "INFORME_INCIDENTE_POWERSHELL_SOC-2026-002.html": "/proyectos/laboratorio-soc-wazuh/informe/incidente-powershell-soc-2026-002",
            "INFORME_INCIDENTE_FIM_SOC-2026-003.html": "/proyectos/laboratorio-soc-wazuh/informe/incidente-fim-soc-2026-003",
        }
        if value in legacy_routes:
            return legacy_routes[value]
        if value.startswith("assets/") or value.startswith("config/"):
            return "/" + value
        return value


def metadata(source):
    html = source.read_text(encoding="utf-8")
    title = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    description = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.I | re.S)
    return unescape(title.group(1).strip()) if title else source.stem, unescape(description.group(1).strip()) if description else "", html


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for filename, slug in REPORTS:
        source = ROOT / filename
        title, description, html = metadata(source)
        parser = ReportParser()
        body_html = re.search(r"<body[^>]*>(.*?)</body>", html, re.I | re.S)
        parser.feed(body_html.group(1) if body_html else html)
        parser.flush_block()
        payload = {
            "title": title,
            "slug": slug,
            "seo": {"metaTitle": title, "metaDescription": description},
            "body": parser.body,
        }
        (OUTPUT / f"{slug}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"{source.name}: {len(parser.body)} Portable Text blocks -> {slug}.json")


if __name__ == "__main__":
    main()
