from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import urllib.parse
from datetime import datetime
import asyncio

from .analyzers.threat import analyze_threat
from .analyzers.security_headers import analyze_security_headers
from .analyzers.certificate import analyze_certificate
from .analyzers.intel import analyze_intel
from .scoring import compute_overall_score
from .storage import save_scan, add_community_report, init_db

app = FastAPI(
    title="PhishRadar API",
    description="Backend API for Phishing & Malicious Website Detection Platform",
    version="1.0.0"
)

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

class ScanRequest(BaseModel):
    url: str = Field(..., description="Target URL to inspect")

class ReportRequest(BaseModel):
    url: str
    vote: str = Field(..., pattern="^(safe|malicious)$")
    category: str = None
    comment: str = None

@app.get("/health")
def health():
    return {"status": "ok", "service": "PhishRadar Backend"}

@app.post("/scan")
async def scan_url(req: ScanRequest):
    raw_url = req.url.strip()
    if not raw_url:
        raise HTTPException(status_code=400, detail="URL cannot be empty.")

    # Validate / normalize scheme
    if not (raw_url.startswith("http://") or raw_url.startswith("https://")):
        raw_url = "https://" + raw_url

    try:
        parsed = urllib.parse.urlparse(raw_url)
        if not parsed.hostname:
            raise HTTPException(status_code=400, detail="Invalid target URL structure.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Malformed URL: {str(e)}")

    # Run analyzers concurrently
    try:
        threat_task = asyncio.create_task(analyze_threat(raw_url))
        headers_task = asyncio.create_task(analyze_security_headers(raw_url))
        intel_task = asyncio.create_task(analyze_intel(raw_url))
        
        # Certificate analyzer uses synchronous socket with timeout
        cert_data = await asyncio.to_thread(analyze_certificate, raw_url)
        threat_data, headers_data, intel_data = await asyncio.gather(threat_task, headers_task, intel_task)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")

    # Scoring engine
    score, verdict, reasons = compute_overall_score(threat_data, headers_data, cert_data, intel_data)

    result = {
        "url": raw_url,
        "final_url": threat_data.get("final_url", raw_url),
        "scanned_at": datetime.utcnow().isoformat() + "Z",
        "verdict": verdict,
        "score": score,
        "reasons": reasons,
        "threat": threat_data,
        "security_headers": headers_data,
        "certificate": cert_data,
        "intel": intel_data
    }

    # Persist in SQLite
    save_scan(raw_url, verdict, score, result)

    return result

@app.post("/report")
async def submit_report(req: ReportRequest):
    add_community_report(req.url, req.vote, req.category, req.comment)
    return {"status": "success", "message": "Feedback recorded in threat intelligence database."}

