# Antigravity Build Guideline: Phishing & Malicious Website Detection Platform

## 0. Read this first: wait for my reference

You are building a phishing and malicious website detection platform. **Do not write code, create files, scaffold a project, install packages or propose a design yet.**

Your first and only action is to reply:

> "Ready. Please share your UI reference (screenshots, Figma link, website URL or a written description) and I will start building."

Start working only after I have provided the reference. If something in the reference is unclear, ask me one short question instead of guessing.

## 1. File scope: touch only what I tell you to

- **Do not modify, rename, move, overwrite or delete any file I have not explicitly told you to change.**
- This includes config files, package files, lock files, environment files, existing styles, scripts, assets, READMEs and anything else already in the project.
- When I ask for a change, edit only the file(s) I named, and only the part I described.
- If a change seems to require touching another file, **stop and ask me first**, naming the file and the reason. Wait for my approval.
- Create a new file only when I have asked for it or approved it. Never add stray, temporary or "helper" files.
- Do not run commands that alter files outside the scope above (formatters, auto-fixers, dependency updates, migrations, mass find-and-replace).
- Do not refactor, rename, reformat or "clean up" code I did not ask you to change.
- After each task, list exactly which files you changed so I can verify.

## 2. What the product does

A user pastes a URL and receives a verdict (Safe / Suspicious / Malicious), a risk score and a plain-language explanation of why. The score combines four checks:

- **Threat analysis:** URL patterns (lookalike characters, typosquatting, odd subdomains, IP hosts, suspicious TLDs, redirects) and page signals (login forms posting to another domain, hidden iframes, obfuscated scripts).
- **Web security assessment:** security headers (CSP, HSTS, X-Frame-Options), exposed services, version leaks, with a simple grade.
- **Certificate validation:** chain, expiry, issuer, key strength, signature algorithm, domain match, Certificate Transparency log lookup, and a flag list of problematic CAs (for example the eMudhra incident).
- **Collaborative threat intelligence:** user reports and votes, plus cross-checks against Google Safe Browsing, PhishTank and VirusTotal.

A scoring engine merges these into one weighted score with reasons such as "certificate issued 3 days ago by a flagged CA".

## 3. UI rules (strict)

- **Follow my reference exactly.** Layout, sections, colours, typography, spacing and components must match it.
- **Add no UI element that is not in the reference.** No extra banners, hero sections, testimonials, pricing, footers, animations, popups, badges, icons, charts, widgets or decorative graphics.
- If a feature needs a place in the UI and the reference has none, do not invent one. Ask me where it should go.
- Keep screens clean: generous whitespace, one primary action per view, no filler text, no placeholder lorem ipsum, no duplicated information.
- Use only the colours and fonts from the reference. If the reference does not specify them, ask me.

## 4. Responsive rules (strict)

The site must work well on mobile, tablet and desktop.

- Build **mobile-first**, then scale up with breakpoints around 480px, 768px and 1024px.
- Verify the layout at 360px, 768px, 1024px and 1440px widths.
- No horizontal scrolling at any width. Tables and long results scroll or stack inside their own container.
- Touch targets at least 44px tall. Inputs and buttons are easy to use with a thumb.
- Fluid type and spacing (`clamp()`, `rem`, flexbox, grid). No fixed pixel layouts.
- Include `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Support light and dark mode only if the reference does.
- Keyboard accessible, visible focus states, sufficient colour contrast.

## 5. Technical approach

- **Frontend:** plain HTML, CSS and JavaScript, no frameworks, unless the reference clearly requires otherwise.
- **Backend:** Python with FastAPI. One endpoint such as `POST /scan` accepts a URL and returns JSON containing the verdict, overall score, per-module results and a list of reasons.
- **Analyzers:** keep each module in its own file (`threat`, `security_headers`, `certificate`, `intel`) and a separate `scoring` module that combines them.
- **Storage:** a small database (SQLite is fine) for scan history and community reports.
- **Secrets:** API keys for Safe Browsing, PhishTank and VirusTotal go in environment variables, never in code. If a key is missing, skip that source gracefully and say so in the result.
- **Safety:** never execute or render the scanned site's code. Fetch it server-side with timeouts, size limits and no script execution. Validate and sanitise every URL input.
- Handle errors clearly: unreachable site, invalid URL, timeout, rate limit.

## 6. Build order

1. Layout from my reference, responsive, with the URL input and result view using mock data.
2. `/scan` endpoint with URL analysis and the scoring engine, connected to the UI.
3. Certificate and Certificate Transparency checks.
4. Security headers check.
5. Community reports and external feeds, only where the reference has a place for them.

Pause after each step and show me what works before moving on.

## 7. Definition of done

- Matches my reference with nothing extra added.
- Works at 360px, 768px, 1024px and 1440px with no horizontal scroll.
- A pasted URL returns a verdict, score and readable reasons.
- No files were changed other than the ones I told you to change.
- No console errors, no hard-coded secrets, no unused code or files.
- A short README with setup steps and the environment variables needed (created only if I approve it).
