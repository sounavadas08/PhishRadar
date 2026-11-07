# PhishRadar — Phishing and Malicious Website Detection Engine

> **Zero-Trust Multi-Vector Threat Radar and URL Security Auditing Platform**

PhishRadar is a cybersecurity platform designed to protect users against sophisticated phishing campaigns, credential harvesting, brand impersonation, and malicious websites. Built with an interactive cyber-matrix visual interface, the platform performs multi-vector inspection in parallel and compiles findings into a 0–100 calibrated risk score, an immediate verdict (Safe / Suspicious / Malicious), and plain-language explanations.

---

## Key Highlights and Architecture

- **Interactive Cyber Matrix HUD:** Reactive cursor proximity lighting, randomized character glitch animations, and dark glassmorphic terminal styling.
- **Concurrent Python FastAPI Core:** Four isolated analyzer pipelines operating asynchronously with server-side sandboxing, timeouts, and size limits.
- **Collaborative Intelligence and Community Feedback:** SQLite-backed voting engine allowing users to dispute or confirm emerging threats.
- **Mobile-First and Fully Accessible:** Responsive across 360px, 768px, 1024px, and 1440px with touch targets at least 44px tall and zero horizontal scrolling.

---

## The 4 Modular Inspection Engines

### 1. Threat and Heuristic Analysis (`threat.py`)
- **Punycode / Homoglyph Detection:** Identifies deceptive Cyrillic, Greek, or zero-width character substitutions mimicking legitimate brands.
- **Raw IP and Hostname Validation:** Flags numerical IPv4/IPv6 hostnames and disposable high-risk TLDs (.top, .xyz, .click, .buzz, etc.).
- **Subdomain Nesting and Brand Impersonation:** Detects high-value target keywords (paypal, chase, login, verify) embedded in deceptive subdomains.
- **Passive HTML Signals:** Detects cross-domain login form actions, hidden tracking iframes, and obfuscated JavaScript scripts without client-side script execution.

### 2. Web Security Assessment (`security_headers.py`)
- **Header Posture Audit:** Inspects Strict-Transport-Security (HSTS), Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.
- **Grade Evaluation:** Computes an automated security posture grade from A+ to F.
- **Software Disclosure Detection:** Flags server software and version disclosure leaks (Server, X-Powered-By).

### 3. Certificate and PKI Validation (`certificate.py`)
- **Handshake Verification:** Validates TLS chain, active validity period, key strength (at least 2048-bit RSA / P-256 ECC), and signature algorithms.
- **Certificate Freshness:** Flags newly issued certificates (under 5 days old) heavily correlated with transient attack campaigns.
- **Certificate Transparency (CT):** Verifies certificate presence in public CT logs.
- **Compromised CA Watchlist:** Flags revoked or untrusted authorities (e.g. eMudhra, WoSign, StartCom).

### 4. Collaborative Threat Intelligence (`intel.py`)
- **Community Consensus:** Live user votes and reports persisted in SQLite.
- **Global Feeds:** Graceful cross-checks against Google Safe Browsing, PhishTank, and VirusTotal APIs when configured.

---

## Quality Assurance (QA) Verification Matrix

| Test ID | Test Target | Expected Verdict | Score Range | Primary Triggers Verified | Status |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **QA-01** | `https://github.com` | **Safe** | 0 – 25 | Established domain, A+ headers (HSTS + CSP), DigiCert valid cert, clean feeds. | **PASS** |
| **QA-02** | `https://paypal-update-center.account-login.top` | **Suspicious** | 45 – 65 | Brand keywords in subdomains, high-risk .top TLD, freshly minted certificate (3 days old), missing CSP. | **PASS** |
| **QA-03** | `http://192.168.1.100/chase-online/auth/login.php` | **Malicious** | 85 – 100 | Raw IP host, unencrypted HTTP, missing cert, Grade F headers, credential harvesting path. | **PASS** |
| **QA-04** | `http://xn--pypal-4ve.com` (Homoglyph) | **Suspicious / Malicious** | 60 – 85 | Punycode conversion flag, deceptive ASCII character substitution. | **PASS** |
| **QA-05** | Community Voting (`POST /report`) | **Success** | N/A | Submits vote, updates tally in SQLite database, updates consensus UI in real time. | **PASS** |

---

## Responsive and Performance Checklist

- [x] **360px (Mobile):** Single-column layout, touch-friendly inputs (at least 44px), zero horizontal overflow.
- [x] **768px (Tablet):** Two-column module grid, centered input with responsive button layout.
- [x] **1024px – 1440px (Desktop):** Fluid typography, interactive matrix background tracking, full 4-module expanded view.
- [x] **Zero Client Execution Risk:** Analyzed URLs are never rendered or executed in the user's browser.

---

## Quick Setup and Local Execution

### Prerequisites
- **Node.js:** v18+ 
- **Python:** v3.11+

### 1. Clone and Install Frontend
```bash
git clone https://github.com/sounavadas08/PhishRadar.git
cd PhishRadar
npm install
```

### 2. Install Backend Dependencies
```bash
python -m pip install fastapi uvicorn httpx cryptography
```

### 3. Start Backend and Frontend
```bash
# Terminal 1 - Backend (FastAPI on Port 8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

# Terminal 2 - Frontend (Vite on Port 5173)
npm run dev
```

Visit **`http://localhost:5173`** to access the live dashboard.
