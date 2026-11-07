from typing import Dict, Any, List, Tuple

def compute_overall_score(
    threat: Dict[str, Any],
    headers: Dict[str, Any],
    certificate: Dict[str, Any],
    intel: Dict[str, Any]
) -> Tuple[int, str, List[str]]:
    score = 10  # Base neutral score
    reasons = []

    # 1. Threat Analysis Weighting
    if threat.get("ip_host"):
        score += 45
        reasons.append("Raw IP address used as hostname instead of a standard domain name.")

    if threat.get("lookalike_detected"):
        score += 35
        reasons.append("Deceptive homoglyph characters or punycode detected in domain structure.")

    if threat.get("suspicious_tld"):
        score += 20
        reasons.append(f"Domain uses high-risk top-level domain ({threat.get('tld', '')}) with known spam correlation.")

    if len(threat.get("suspicious_keywords", [])) >= 2:
        score += 25
        kws = ", ".join(threat.get("suspicious_keywords", [])[:3])
        reasons.append(f"Contains high-value target credentials keywords: {kws}.")

    if threat.get("subdomain_depth", 0) >= 2:
        score += 15
        reasons.append("Multiple nested subdomains used, which is common in deceptive redirection chains.")

    # 2. Certificate Validation Weighting
    if not certificate.get("valid"):
        score += 35
        if certificate.get("issuer") == "None (Unencrypted HTTP)":
            score += 10
            reasons.append("Unencrypted connection (HTTP); no SSL/TLS encryption present.")
        else:
            reasons.append("SSL/TLS certificate is invalid, expired, or handshake failed.")

    if certificate.get("flagged_ca"):
        score += 40
        reasons.append(f"Certificate issued by a flagged or untrusted Certificate Authority: {certificate.get('flagged_reason')}")

    if certificate.get("days_since_issued", 999) <= 5 and certificate.get("valid"):
        score += 20
        reasons.append(f"Certificate was issued only {certificate.get('days_since_issued')} day(s) ago (freshly created certificate).")

    # 3. Security Headers Weighting
    grade = headers.get("grade", "C")
    if grade == "F":
        score += 20
        reasons.append("Critical web security headers missing (Grade F); no clickjacking or script protections.")
    elif grade == "D":
        score += 12
        reasons.append("Lacks essential security headers such as HSTS or Content-Security-Policy.")
    elif grade in ("A", "A+"):
        score -= 10

    # 4. Threat Intel Weighting
    if intel.get("google_safebrowsing") == "Flagged":
        score += 50
        reasons.append("Active threat match found on Google Safe Browsing blacklists.")

    if intel.get("phishtank") == "Flagged":
        score += 50
        reasons.append("Verified active phishing record found in PhishTank database.")

    if intel.get("virustotal") == "Flagged":
        score += 40
        reasons.append("Flagged as malicious by multiple security engines on VirusTotal.")

    comm_mal = intel.get("community_votes", {}).get("malicious", 0)
    comm_safe = intel.get("community_votes", {}).get("safe", 0)
    if comm_mal > comm_safe and comm_mal >= 2:
        score += 20
        reasons.append(f"Flagged by {comm_mal} community user report(s).")
    elif comm_safe > 10 and comm_mal == 0:
        score -= 10

    # Clamp score to [0, 100]
    final_score = max(0, min(100, score))

    # Verdict assignment
    if final_score <= 25:
        verdict = "Safe"
        if not reasons:
            reasons.append("No suspicious indicators, clean certificate, and established domain reputation.")
    elif final_score <= 65:
        verdict = "Suspicious"
        if not reasons:
            reasons.append("Elevated risk indicators detected across URL patterns or web security configuration.")
    else:
        verdict = "Malicious"
        if not reasons:
            reasons.append("Multiple critical security threats or blacklists flagged this website.")

    return final_score, verdict, reasons

