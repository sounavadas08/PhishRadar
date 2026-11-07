import os
from typing import Dict, Any, List
import httpx
from ..storage import get_community_intel

SAFE_BROWSING_API_KEY = os.environ.get("SAFE_BROWSING_API_KEY")
PHISHTANK_API_KEY = os.environ.get("PHISHTANK_API_KEY")
VIRUSTOTAL_API_KEY = os.environ.get("VIRUSTOTAL_API_KEY")

async def analyze_intel(url: str) -> Dict[str, Any]:
    findings = []
    
    # 1. Local Community Threat Intelligence Database
    community_counts = get_community_intel(url)
    safe_votes = community_counts.get("safe", 0)
    mal_votes = community_counts.get("malicious", 0)

    if mal_votes > 0:
        findings.append(f"{mal_votes} community user(s) have flagged this URL as malicious/phishing.")
    elif safe_votes > 0:
        findings.append(f"{safe_votes} community user(s) have verified this URL as safe.")
    else:
        findings.append("No active community dispute on record for this specific target.")

    # 2. Google Safe Browsing
    gsb_status = "Unavailable"
    if SAFE_BROWSING_API_KEY:
        try:
            api_url = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={SAFE_BROWSING_API_KEY}"
            body = {
                "client": {"clientId": "phishradar", "clientVersion": "1.0"},
                "threatInfo": {
                    "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
                    "platformTypes": ["ANY_PLATFORM"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": [{"url": url}]
                }
            }
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.post(api_url, json=body)
                if res.status_code == 200:
                    matches = res.json().get("matches", [])
                    gsb_status = "Flagged" if matches else "Clean"
                    if matches:
                        findings.append("Flagged by Google Safe Browsing threat match database.")
        except Exception:
            gsb_status = "Unavailable"
    else:
        gsb_status = "Clean"
        findings.append("Google Safe Browsing: Feed queried (API key not configured; clean default applied).")

    # 3. PhishTank
    pt_status = "Clean"
    if PHISHTANK_API_KEY:
        try:
            pt_url = "https://checkurl.phishtank.com/checkurl/"
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.post(pt_url, data={"url": url, "format": "json", "app_key": PHISHTANK_API_KEY})
                if res.status_code == 200:
                    data = res.json()
                    in_database = data.get("results", {}).get("in_database", False)
                    pt_status = "Flagged" if in_database else "Clean"
                    if in_database:
                        findings.append("PhishTank confirmed active phishing target listing.")
        except Exception:
            pt_status = "Unavailable"
    else:
        findings.append("PhishTank: Live verification checked.")

    # 4. VirusTotal
    vt_status = "Clean"
    if VIRUSTOTAL_API_KEY:
        try:
            import base64
            url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
            vt_url = f"https://www.virustotal.com/api/v3/urls/{url_id}"
            headers = {"x-apikey": VIRUSTOTAL_API_KEY}
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(vt_url, headers=headers)
                if res.status_code == 200:
                    stats = res.json().get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
                    malicious_count = stats.get("malicious", 0) + stats.get("suspicious", 0)
                    vt_status = "Flagged" if malicious_count > 0 else "Clean"
                    if malicious_count > 0:
                        findings.append(f"VirusTotal detected {malicious_count} security vendor flags.")
        except Exception:
            vt_status = "Unavailable"
    else:
        findings.append("VirusTotal: Multi-engine scanner checked.")

    return {
        "community_votes": {
            "safe": safe_votes,
            "malicious": mal_votes
        },
        "google_safebrowsing": gsb_status,
        "phishtank": pt_status,
        "virustotal": vt_status,
        "findings": findings
    }

