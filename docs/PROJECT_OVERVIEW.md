# PhishRadar Project Overview

## Goal
The PhishRadar hackathon project is a lightweight web‑app that demonstrates real‑time phishing detection and threat telemetry.  It provides a **radar scanner** UI, a **simulation playground**, and a quick‑jump CTA that smoothly scrolls to the security guide section.

## Tech Stack
- **Framework**: React + Vite (TypeScript)
- **Styling**: Tailwind CSS with custom Roboto font faces.
- **Animation**: Framer Motion for entrance animations.
- **Backend**: None – the demo runs entirely client‑side; future versions can hook into Vercel AI Gateway or external threat intel APIs.
- **Deployment**: Vercel (static site) – `vercel deploy`.

## Core Features
| Feature | Implementation Details |
|---------|------------------------|
| Header navigation links | `<a href="#scanner">` and similar anchors. |
| Smooth scroll to sections | Added `html { scroll-behavior: smooth; }` in `src/index.css`. |
| Radar scanner UI | Motion‑wrapped components (`motion.div`, `motion.h1`) with `fadeUpVariants`.
| Simulation playground | Toggles a `<Simulation />` component via state (`setShowSimulation`). |
| Custom scrollbars | Tailwind + WebKit scrollbar rules for dark theme.

## Challenges Solved
1. **Instant Jump vs. Smooth Scroll**
   - *Problem*: Clicking a header link jumped instantly to the target, breaking the visual flow.
   - *Solution*: Enabled native smooth scrolling by adding `scroll-behavior: smooth` globally in CSS. This required a small CSS insertion and a commit.
2. **Consistent Font Loading**
   - *Problem*: Multiple Roboto weights needed for the UI, but the default system fonts caused FOUT.
   - *Solution*: Declared `@font-face` rules for each weight/italic variant and referenced them via utility classes (`font-roboto-medium`, etc.).
3. **Responsive Navigation Visibility**
   - Used Tailwind's responsive utilities (`hidden md:flex`) to hide the nav on mobile while keeping the layout intact.
4. **Animation Timing**
   - Leveraged Framer Motion's `custom` prop to stagger the fade‑up animation of hero elements, ensuring a smooth entrance.
5. **Git Workflow**
   - After adding the smooth‑scroll CSS, staged, committed, and pushed the change (`git add src/index.css && git commit -m "Add smooth scrolling to index.css" && git push`).

## How to Run Locally
```bash
# Clone the repository
git clone https://github.com/sounavadas08/PhishRadar.git
cd PhishRadar

# Install dependencies (uses pnpm, npm also works)
pnpm install

# Start the dev server
pnpm dev
```
Open http://localhost:5173 in a browser.

## Future Work
- Integrate real threat‑intel APIs (e.g., VirusTotal, URLhaus).
- Add server‑side validation via Vercel Functions.
- Implement user authentication (Vercel Auth or Clerk).
- Expand the simulation with customizable attack vectors.

---
*Documentation generated on 2026‑11‑09.*
