# 🛡️ PhishRadar — 3-Minute Project Pitch Document

**Project Name:** PhishRadar (Zero-Trust URL & Phishing Telemetry Engine)  
**Author / Presenter:** Sounava Das  
**Presentation Format:** 3-Minute Hackathon Demo / Technical Pitch  
**Target Audience:** Hackathon Judges, Security Engineers, General Users  
**Live Repository:** [github.com/sounavadas08/PhishRadar](https://github.com/sounavadas08/PhishRadar)  

---

## 1. Executive Summary

PhishRadar is a proactive, client-resilient cybersecurity web application engineered to audit suspicious links and detect phishing campaigns on Day-Zero. By correlating mathematical brand distance (Levenshtein), IDN punycode decoding, structural URL heuristics, SSL certificate validation, and community consensus, PhishRadar protects users before traditional blocklists even index the threat.

---

## 2. The Three Core Pillars

### Pillar I: The Point of Making It (The "Why")
* **The False Sense of Security:** Over **82% of active phishing sites now carry valid HTTPS certificates**. Users are conditioned to look for the "padlock" icon, falsely assuming HTTPS equals safety.
* **The Ephemeral Lifespan Problem:** Modern phishing domains exist for less than **48 hours**—often spun up, used to harvest credentials, and decommissioned before static reputation databases (e.g., Google Safe Browsing, PhishTank) update their registries.
* **The Solution Gap:** Existing tools require heavy endpoint agents, intrusive browser extensions, or remote backend queries that leak visited URLs. PhishRadar provides immediate zero-trust URL forensics without installations or privacy compromises.

### Pillar II: What Was Made (The "What")
* **Interactive 5-Stage Live Stepper:** Rather than an opaque loading spinner, users follow real-time progress:
  1. URL Parsing & Tokenization
  2. Domain & Lookalike Auditing
  3. TLS / Encryption Inspection
  4. HTTP Security Header Analysis
  5. Threat Intelligence & Community Consensus
* **Granular Risk Scoring:** Computes a transparent **0–100 risk score** and assigns clear verdicts (`LOW RISK`, `SUSPICIOUS`, `MALICIOUS`) backed by specific rationale bullets.
* **Defanged Threat Reporting:** One-click forensic copy utility that automatically defangs target URLs (`hxxps://`, `[.]`) for safe sharing in SOC tickets and Slack channels.
* **Full Transparency Badging:** Distinguishes between verified live client heuristics and simulated backend features without fabricating telemetry.
* **Educational & Hygiene Hub:** Built-in collapsible advisory detailing real-world breach statistics, consequences of data theft, and tactical safety rules.

### Pillar III: How It Was Made (The "How")
* **Frontend Architecture:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide React icons.
* **Accessible & Matrix Cyber Design:** High-contrast dark cyber theme with full WCAG AA compliance, visible keyboard focus indicators, and strict `prefers-reduced-motion` fallbacks.
* **Heuristic Engine (`src/lib/analyzeUrl.ts`):**
  * **Levenshtein Distance:** Compares parsed hostname tokens against high-profile target brands (PayPal, Google, Apple, Microsoft, Chase, Netflix).
  * **Punycode / Homoglyph Detection:** Identifies `xn--` encoding and zero-width/Cyrillic character substitution.
  * **Host & Protocol Forensics:** Flags raw IPv4 hosts, non-HTTPS protocols, risky TLDs (`.top`, `.xyz`, `.click`, `.tk`), and embedded credential separators (`@`).
  * **Entropy & Keyword Detection:** Identifies chained auth keywords (`login`, `verify`, `secure`, `wallet`) and abnormal subdomain nesting.
* **Dual-Mode Resilience:** Attempts connection to a FastAPI backend `/scan` endpoint, with seamless automatic fallback to client-side heuristics if offline or running in standalone demo mode.

---

## 3. Timestamped 3-Minute Presentation Cue Sheet

| Timestamp | Phase | On-Screen Action | Spoken Content / Key Talking Points |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:45** | **The Hook & The "Why"** | Show landing page, cyber grid animation, and headline. | "Over 82% of phishing links have green padlocks. Static blacklists take 24–48 hours to catch them, but domains vanish in hours. We need zero-trust Day-Zero URL inspection." |
| **0:45 – 1:30** | **The Product & Scan Flow** | Click preset `paypal-update.top`. Hit *Analyze Target*. | "Meet PhishRadar. Watch the 5-stage stepper analyze the URL in real time. We provide an exact 0-100 score, clear verdict, and specific reasons why this site is dangerous." |
| **1:30 – 2:00** | **Forensic Utilities** | Scroll to Verdict Card. Click *Copy Report*. | "Security analysts need actionable intelligence. Our 'Copy Report' feature exports a defanged plain-text summary safe for Slack and ticketing without accidental clicks." |
| **2:00 – 2:35** | **Technical Engine** | Switch tabs (Headers / Cert / Intel). | "Under the hood: pure TypeScript client-side heuristics. Levenshtein edit distance for brand spoofing, Punycode unmasking, IP-host analysis, and fallback resilience." |
| **2:35 – 3:00** | **Value Proposition & Wrap-Up** | Show recent targets & Clear button. | "Zero install, zero privacy leaks, instant audit for any device. PhishRadar turns internet users from passive targets into empowered defenders. Thank you!" |

---

## 4. Live Demonstration Test Matrix

Prepare these 5 test URLs for live demonstration during the pitch:

| Category | Test URL | Detection Logic Triggered | Expected Verdict |
| :--- | :--- | :--- | :--- |
| **Brand Lookalike** | `https://paypal-update-center.account-login.top` | Levenshtein match to 'PayPal', risky TLD `.top`, keywords `login`/`update` | **MALICIOUS / SUSPICIOUS** (Score: ~80+) |
| **Unencrypted HTTP** | `http://example.com` | Non-HTTPS protocol, unencrypted transmission channel | **SUSPICIOUS** (Score: ~35-45) |
| **Raw IP Host** | `http://192.168.1.100/chase-online/auth/login.php` | Raw IPv4 host, keywords `auth`/`login`, HTTP protocol | **MALICIOUS** (Score: ~85+) |
| **Credential Trick** | `https://example.com@phish.com` | Embedded `@` token used to mask actual destination host | **SUSPICIOUS** (Score: ~55+) |
| **Clean Baseline** | `https://github.com` | Verified brand, HTTPS, standard TLD, clean token entropy | **LOW RISK** (Score: < 15) |

---

## 5. Judge Defense & Q&A Matrix

### Q1: "How does this compare to Google Safe Browsing or VirusTotal?"
> **Answer:** "Google Safe Browsing and VirusTotal are reputation-based feeds that depend on human crawlers and prior incident reporting. PhishRadar performs **client-side structural heuristics** on the raw URL string itself, enabling proactive Day-Zero detection before the link is ever indexed by public blacklists."

### Q2: "Can an attacker bypass the brand detection by changing the domain spelling?"
> **Answer:** "PhishRadar uses defense-in-depth. If an attacker uses a subtle misspelling, Levenshtein edit distance catches it. If they distort the name completely, the social engineering lure loses credibility. If they resort to subdomains or URL encoding, our keyword analysis and subdomain depth counter-measure them."

### Q3: "Why build a client-side engine instead of running everything on a backend server?"
> **Answer:** "Two major reasons: **Privacy** and **Zero-Latency Resilience**. When users test URLs on remote services, their browsing behavior is sent to a third party. PhishRadar's client engine can audit links completely offline without transmitting browsing data."

---

*Document compiled for PhishRadar v1.0. Validated with Vite + TypeScript build passing.*
