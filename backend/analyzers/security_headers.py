import httpx
from typing import Dict, Any, List, Optional

async def analyze_security_headers(url: str) -> Dict[str, Any]:
    findings = []
    headers = {}
    server_version = None

    try:
        async with httpx.AsyncClient(timeout=4.0, follow_redirects=True, verify=False) as client:
            resp = await client.head(url, headers={"User-Agent": "Mozilla/5.0 PhishRadar/1.0"})
            if resp.status_code >= 400:
                resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0 PhishRadar/1.0"})
            headers = {k.lower(): v for k, v in resp.headers.items()}
    except Exception:
        findings.append("Target server did not respond to HTTP probe or connection was refused.")
        return {
            "grade": "F",
            "hsts": False,
            "csp": False,
            "x_frame_options": False,
            "x_content_type_options": False,
            "referrer_policy": False,
            "server_version_leaked": None,
            "findings": findings
        }

    # Evaluate individual security headers
    hsts = 'strict-transport-security' in headers
    csp = 'content-security-policy' in headers
    x_frame = 'x-frame-options' in headers
    x_content_type = headers.get('x-content-type-options', '').lower() == 'nosniff'
    referrer = 'referrer-policy' in headers

    # Server version leak
    server_hdr = headers.get('server')
    x_powered = headers.get('x-powered-by')
    if server_hdr and any(char.isdigit() for char in server_hdr):
        server_version = server_hdr
    elif x_powered:
        server_version = x_powered

    if server_version:
        findings.append(f"Server software version disclosure detected: {server_version}")

    # Build findings & compute grade
    score = 0
    if hsts:
        score += 30
        findings.append("HSTS (Strict-Transport-Security) header is active, enforcing HTTPS transport.")
    else:
        findings.append("Missing HSTS header: vulnerable to SSL-stripping man-in-the-middle attacks.")

    if csp:
        score += 35
        findings.append("Content-Security-Policy (CSP) is implemented, restricting untrusted script execution.")
    else:
        findings.append("Missing Content-Security-Policy: site allows unrestricted cross-origin script injection.")

    if x_frame:
        score += 15
        findings.append(f"X-Frame-Options set to '{headers['x-frame-options']}', defending against clickjacking.")
    else:
        findings.append("Missing X-Frame-Options: site can be embedded inside unauthorized iframes.")

    if x_content_type:
        score += 10
        findings.append("X-Content-Type-Options: nosniff header prevents MIME-type confusion attacks.")

    if referrer:
        score += 10

    # Grade assignment
    if score >= 90:
        grade = "A+"
    elif score >= 75:
        grade = "A"
    elif score >= 60:
        grade = "B"
    elif score >= 40:
        grade = "C"
    elif score >= 20:
        grade = "D"
    else:
        grade = "F"

    return {
        "grade": grade,
        "hsts": hsts,
        "csp": csp,
        "x_frame_options": x_frame,
        "x_content_type_options": x_content_type,
        "referrer_policy": referrer,
        "server_version_leaked": server_version,
        "findings": findings
    }

