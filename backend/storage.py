import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "radar.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                verdict TEXT NOT NULL,
                score INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                data_json TEXT NOT NULL
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS community_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                vote TEXT NOT NULL,
                category TEXT,
                comment TEXT,
                created_at TEXT NOT NULL
            )
        """)
        conn.commit()

def save_scan(url: str, verdict: str, score: int, data: Dict[str, Any]):
    init_db()
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO scans (url, verdict, score, created_at, data_json) VALUES (?, ?, ?, ?, ?)",
            (url, verdict, score, datetime.utcnow().isoformat(), json.dumps(data))
        )
        conn.commit()

def add_community_report(url: str, vote: str, category: Optional[str] = None, comment: Optional[str] = None):
    init_db()
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO community_reports (url, vote, category, comment, created_at) VALUES (?, ?, ?, ?, ?)",
            (url, vote, category, comment, datetime.utcnow().isoformat())
        )
        conn.commit()

def get_community_intel(url: str) -> Dict[str, int]:
    init_db()
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        # Query matches for domain or exact url
        cursor.execute("SELECT vote, COUNT(*) FROM community_reports WHERE url = ? GROUP BY vote", (url,))
        rows = cursor.fetchall()
        counts = {"safe": 0, "malicious": 0}
        for vote, count in rows:
            if vote in counts:
                counts[vote] = count
        return counts

