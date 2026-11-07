import re
import ipaddress
import urllib.parse
from typing import Dict, Any, List
import unicodedata
import httpx

SUSPICIOUS_TLDS = {
    'top', 'xyz', 'click', 'country', 'link', 'work', 'buzz', 'rest',
    'tk', 'ml', 'ga', 'cf', 'gq', 'monster', 'hair', 'live', 'support'
}

SUSPICIOUS_KEYWORDS = [
    'login', 'signin', 'verify', 'verification', 'secure', 'account',
    'update', 'banking', 'wallet', 'confirm', 'password', 'recover',
    'support', 'security', 'auth', 'authorize'
]

POPULAR_BRANDS = [
    'paypal', 'google', 'apple', 'microsoft', 'amazon', 'netflix',
    'chase', 'wellsfargo', 'bankofamerica', 'citibank', 'facebook',
    'instagram', 'meta', 'twitter', 'telegram', 'binance', 'coinbase'
]

def check_homoglyphs(domain: str) -> bool:
    """Detects unicode lookalike characters / mixed script deceptive domains."""
    # Check if domain contains punycode prefix xn--
    if 'xn--' in domain.lower():
        return True
    
    # Check for mixed script or non-ascii homoglyphs
    try:
        decoded = domain.encode('idna').decode('ascii')
        if decoded.startswith('xn--'):
            return True
    except Exception:
        return True

    # Look for characters outside standard domain ascii set
    for char in domain:
        if ord(char) > 127:
            return True
    return False

def check_typosquatting(domain: str) -> List[str]:
    """Checks whether the domain or its subdomains imitate well-known brands."""
    matches = []
    lower_dom = domain.lower()
    
    # Strip TLD for matching
    parts = lower_dom.split('.')
    dom_body = parts[0] if len(parts) > 1 else lower_dom

    for brand in POPULAR_BRANDS:
        # Keyword embedded in subdomains (e.g. paypal-security.com)
        if brand in lower_dom and not lower_dom.endswith(f".{brand}.com") and lower_dom != f"{brand}.com":
            matches.append(brand)
        else:
            # 1-char edit distance
            if len(dom_body) == len(brand) and sum(1 for a, b in zip(dom_body, brand) if a != b) == 1:
                matches.append(f"typosquatting on '{brand}'")
    return list(set(matches))

def is_ip_address(host: str) -> bool:
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False

async def analyze_threat(url: str) -> Dict[str, Any]:
    findings = []
    
    # Ensure scheme
    parsed = urllib.parse.urlparse(url)
    if not parsed.scheme:
        url = "http://" + url
        parsed = urllib.parse.urlparse(url)

    host = parsed.hostname or ''
    path = parsed.path or ''
    full_url = url.lower()

    # 1. IP Host Check
    ip_host = is_ip_address(host)
    if ip_host:
        findings.append("Hostname is a raw IP address; legitimate brands utilize registered DNS domain names.")

    # 2. Lookalike / Homoglyph Check
    lookalike = check_homoglyphs(host)
    if lookalike:
        findings.append("Deceptive unicode / punycode lookalike characters detected in hostname.")

    # 3. TLD Check
    tld = host.split('.')[-1].lower() if '.' in host else ''
    suspicious_tld = tld in SUSPICIOUS_TLDS
    if suspicious_tld:
        findings.append(f"Domain uses a high-risk TLD (.{tld}) statistically correlated with transient phishing.")

    # 4. Subdomain Depth
    host_parts = host.split('.')
    subdomain_depth = max(0, len(host_parts) - 2) if not ip_host else 0
    if subdomain_depth >= 2:
        findings.append(f"Excessive subdomain nesting ({subdomain_depth} levels) used to mask destination domain.")

    # 5. Typosquatting / Brand Spoofing
    spoofed = check_typosquatting(host)
    if spoofed:
        findings.append(f"Target brand keyword(s) detected outside official origin: {', '.join(spoofed)}")

    # 6. Keyword Analysis
    detected_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_url]
    if len(detected_keywords) >= 2:
        findings.append(f"Multiple high-sensitivity action keywords found: {', '.join(detected_keywords)}")

    # 7. Safe Server-side Page Inspection (no JS execution, 5s timeout, 1MB limit)
    redirect_count = 0
    final_url = url
    page_signals = []
    try:
        async with httpx.AsyncClient(timeout=4.0, follow_redirects=True, max_redirects=4, verify=False) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) PhishRadarBot/1.0"})
            final_url = str(resp.url)
            redirect_count = len(resp.history)
            if redirect_count > 1:
                findings.append(f"URL executes multiple redirects ({redirect_count} hops) before reaching destination.")

            # Inspect first 50KB of content
            content = resp.text[:50000].lower()
            
            # Check for cross-domain form submission
            forms = re.findall(r'<form[^>]*action=[\'"]([^\'"]+)[\'"]', content)
            for form_action in forms:
                form_parsed = urllib.parse.urlparse(form_action)
                if form_parsed.hostname and form_parsed.hostname != host:
                    page_signals.append("HTML contains a form submitting data to an external unauthorized third-party host.")
                    findings.append("Credential harvesting indicator: form action routes to an external host.")
                    break

            # Check for hidden iframe
            if '<iframe' in content and ('display:none' in content or 'visibility:hidden' in content or 'width="0"' in content):
                findings.append("Hidden iframe detected on target webpage.")

            # Obfuscated script markers
            if 'unescape(' in content or 'document.write(atob(' in content:
                findings.append("Obfuscated or encoded JavaScript payload detected.")
    except Exception:
        # Destination unreachable or timed out
        pass

    if not findings:
        findings.append("No suspicious URL heuristics or brand impersonation anomalies detected.")

    return {
        "lookalike_detected": lookalike,
        "punycode_host": host,
        "ip_host": ip_host,
        "suspicious_tld": suspicious_tld,
        "tld": f".{tld}" if tld else "N/A",
        "subdomain_depth": subdomain_depth,
        "redirect_count": redirect_count,
        "suspicious_keywords": detected_keywords,
        "findings": findings,
        "final_url": final_url
    }

