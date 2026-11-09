import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Zap, 
  Lock, 
  Eye, 
  Flame, 
  Terminal, 
  FileWarning, 
  Fingerprint, 
  Globe2, 
  CreditCard, 
  Building2, 
  UserX, 
  Cpu, 
  Database, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export const SecurityGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'why' | 'pros' | 'consequences'>('all');

  return (
    <section id="security-guide" className="w-full max-w-5xl mx-auto mt-16 sm:mt-24 px-4 font-roboto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs tracking-wider uppercase font-roboto-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Cyber Intelligence & Threat Advisory</span>
        </div>

        {/* Collapsible intro accordion */}
        <details className="mt-4 text-left">
          <summary className="text-3xl sm:text-4xl md:text-5xl font-roboto-bold text-white tracking-tight mb-4 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 list-none text-center">
            Why PhishRadar &amp; Online Data Hygiene Matter
            <span className="ml-2 text-green-400 text-lg align-middle">&#9656;</span>
          </summary>
          <p className="max-w-3xl mx-auto text-gray-300 text-base sm:text-lg font-roboto-medium leading-relaxed mt-4 text-center">
            In an era where malicious actors deploy AI-generated spoofing, ephemeral homoglyph domains, and stealth credential harvesting, proactive URL telemetry is your frontline defense.
          </p>
          <p className="mt-2 text-sm text-green-400/90 font-roboto-medium-italic text-center">
            * &ldquo;An unverified click takes milliseconds; recovering from identity theft or corporate compromise takes years.&rdquo;
          </p>
        </details>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: 'all', label: 'Complete Overview', icon: Globe2 },
            { id: 'why', label: 'Why PhishRadar?', icon: Info },
            { id: 'pros', label: 'Core Advantages', icon: Zap },
            { id: 'consequences', label: 'Risk & Consequences', icon: AlertOctagon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 font-roboto-medium ${
                  isActive
                    ? 'bg-green-500 text-black font-roboto-bold shadow-[0_0_20px_rgba(0,255,102,0.35)]'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-green-500/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-green-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-world Telemetry Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12">
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-mono uppercase">Daily Phishing</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-roboto-bold text-white">3.4 Billion</div>
          <p className="text-[11px] text-gray-400 font-roboto-medium mt-1">
            Malicious emails & links generated across global networks every single day.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-mono uppercase">Breach Ingress</span>
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-roboto-bold text-white">36%</div>
          <p className="text-[11px] text-gray-400 font-roboto-medium mt-1">
            Of all verified cyber breaches begin directly through phishing lures.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-mono uppercase">Domain Lifespan</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-roboto-bold text-white">&lt; 48 Hours</div>
          <p className="text-[11px] text-gray-400 font-roboto-medium mt-1">
            85% of phishing domains vanish before traditional blacklists detect them.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-mono uppercase">Avg Breach Cost</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-roboto-bold text-white">$4.88M</div>
          <p className="text-[11px] text-gray-400 font-roboto-medium mt-1">
            Global average organizational cost for data compromised via social engineering.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-12">

        {/* SECTION 1: WHY USE PHISHRADAR */}
        {(activeTab === 'all' || activeTab === 'why') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-black/80 border border-green-500/20 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(0,255,102,0.08)]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-roboto-bold text-white">
                  Why Should We Use PhishRadar?
                </h3>
                <p className="text-xs sm:text-sm text-green-400/90 font-roboto-medium-italic">
                  The imperative shift from reactive blacklists to proactive zero-trust inspection
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-green-500/40 transition-colors">
                <div className="text-green-400 font-mono text-xs mb-2">01. BEYOND STATIC BLACKLISTS</div>
                <h4 className="text-base font-roboto-bold text-white mb-2">
                  Legacy Blocklists Are Too Slow
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Traditional antivirus databases and browser safe-browsing feeds rely on human reports and crawlers that take hours or days to register a threat. PhishRadar evaluates live structural cues instantly, protecting you on Day Zero.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 font-roboto-medium-italic">
                  &ldquo;Phishers spin up disposable subdomains in seconds, drain victim accounts, and tear down the infrastructure before static registries even notice.&rdquo;
                </div>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-green-500/40 transition-colors">
                <div className="text-green-400 font-mono text-xs mb-2">02. UNMASKING HOMOGLYPHS</div>
                <h4 className="text-base font-roboto-bold text-white mb-2">
                  Foiling Visual Spoofs & Punycode
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Attackers register lookalike domains using Cyrillic or Greek characters (e.g. replacing Latin &apos;a&apos; with &apos;&#1072;&apos;) that look identical to genuine sites like Apple, PayPal, or Microsoft. PhishRadar decodes IDN punycode and calculates mathematical similarity.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 font-roboto-medium-italic">
                  &ldquo;Human eyesight cannot distinguish a zero-width unicode glyph or Cyrillic homoglyph in an address bar. Automated mathematical verification is mandatory.&rdquo;
                </div>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-green-500/40 transition-colors">
                <div className="text-green-400 font-mono text-xs mb-2">03. MULTI-VECTOR CORRELATION</div>
                <h4 className="text-base font-roboto-bold text-white mb-2">
                  Holistic 360&deg; Security Audits
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  A site with an SSL padlock is not inherently safe. Free automated certificates allow fraudsters to show green locks. PhishRadar cross-checks certificate transparency, domain age, security headers, and decentralized telemetry for an authentic verdict.
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400 font-roboto-medium-italic">
                  &ldquo;Never trust the padlock blindly: over 82% of active phishing sites now carry valid HTTPS certificates.&rdquo;
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 2: PROS & ADVANTAGES */}
        {(activeTab === 'all' || activeTab === 'pros') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-zinc-900/80 to-black/80 border border-cyan-500/20 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.08)]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-roboto-bold text-white">
                  What Are The Pros of PhishRadar?
                </h3>
                <p className="text-xs sm:text-sm text-cyan-400/90 font-roboto-medium-italic">
                  Engineered with speed, accuracy, and enterprise-grade intelligence
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-roboto-bold text-white mb-1.5">
                  Real-Time Heuristic Engine
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Evaluates target URLs through algorithmic scoring of entropy, deceptive token chaining, suspicious TLD prevalence (.top, .xyz, .cfd), and IP hosting indicators in under 2 seconds.
                </p>
                <p className="mt-2 text-xs text-cyan-300 font-roboto-medium-italic">
                  &rarr; Proactive defense with zero delay.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <h4 className="text-base font-roboto-bold text-white mb-1.5">
                  Homoglyph & Brand Matching
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Calculates Levenshtein edit distance and punycode canonicalization against a high-value list of 50+ tier-1 banking, crypto, and enterprise SSO brands.
                </p>
                <p className="mt-2 text-xs text-cyan-300 font-roboto-medium-italic">
                  &rarr; Immediate alert when brand impersonation is detected.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-roboto-bold text-white mb-1.5">
                  Deep SSL/TLS Transparency Audit
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Validates certificate issuer authority, validity lifespan, TLS protocol version, and detects automated throwaway certificates frequently leveraged in credential traps.
                </p>
                <p className="mt-2 text-xs text-cyan-300 font-roboto-medium-italic">
                  &rarr; Detects rogue certificates before handshakes occur.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Terminal className="w-5 h-5" />
                </div>
                <h4 className="text-base font-roboto-bold text-white mb-1.5">
                  HTTP Security Headers Grading
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Grades the presence and configuration of HSTS, CSP, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy, exposing architecture vulnerable to clickjacking.
                </p>
                <p className="mt-2 text-xs text-cyan-300 font-roboto-medium-italic">
                  &rarr; Identifies shoddy infrastructure built purely for scams.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-base font-roboto-bold text-white mb-1.5">
                  Community Consensus & Threat Intel
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Harnesses crowd-sourced community reporting and voting signals alongside automated heuristics, establishing a self-updating cyber immunity mesh.
                </p>
                <p className="mt-2 text-xs text-cyan-300 font-roboto-medium-italic">
                  &rarr; Collective security empowers individual protection.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                  <Eye className="w-5 h-5" />
                </div>
                <h4 className="text-base font-roboto-bold text-white mb-1.5">
                  Zero Installation & High Privacy
                </h4>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Works instantly via standard web browser without demanding administrative endpoint privileges, intrusive browser extension permissions, or personal credentials.
                </p>
                <p className="mt-2 text-xs text-cyan-300 font-roboto-medium-italic">
                  &rarr; Lightweight, non-intrusive, and accessible anywhere.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* SECTION 3: CONSEQUENCES OF NOT HANDLING SENSITIVE DATA ONLINE */}
        {(activeTab === 'all' || activeTab === 'consequences') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-rose-950/40 via-zinc-950/70 to-black/90 border border-rose-500/30 backdrop-blur-xl relative overflow-hidden shadow-[0_0_35px_rgba(244,63,94,0.1)]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-roboto-bold text-white">
                  Consequences of Not Handling Sensitive Data Online
                </h3>
                <p className="text-xs sm:text-sm text-rose-400/90 font-roboto-medium-italic">
                  The cascading domino effect of entering credentials or PII on unverified domains
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              
              {/* Consequence 1 */}
              <div className="p-5 rounded-xl bg-black/70 border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                <div className="flex items-center gap-2.5 text-rose-400 mb-2">
                  <UserX className="w-5 h-5 shrink-0" />
                  <h4 className="text-base sm:text-lg font-roboto-bold text-white">
                    1. Account Takeover (ATO) & Identity Hijacking
                  </h4>
                </div>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Submitting credentials on a cloned login portal hands your raw password and MFA session tokens to threat actors. With access to your primary email or phone number, attackers trigger automated password resets across your banking, cloud storage, and social accounts.
                </p>
                <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 font-roboto-medium-italic">
                  &ldquo;A single compromised password often cascades into an irreversible loss of your entire digital identity across dozens of federated services.&rdquo;
                </div>
              </div>

              {/* Consequence 2 */}
              <div className="p-5 rounded-xl bg-black/70 border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                <div className="flex items-center gap-2.5 text-rose-400 mb-2">
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <h4 className="text-base sm:text-lg font-roboto-bold text-white">
                    2. Devastating Financial Theft & Fraud
                  </h4>
                </div>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  Payment cards and bank account numbers entered into fake payment gateways are immediately monetized on dark web carding markets or used to execute unauthorized wire transfers, crypto purchases, and line-of-credit loans under your name.
                </p>
                <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 font-roboto-medium-italic">
                  &ldquo;Victims face empty bank accounts, damaged credit scores, and months or years of grueling bureaucratic disputes with financial institutions.&rdquo;
                </div>
              </div>

              {/* Consequence 3 */}
              <div className="p-5 rounded-xl bg-black/70 border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                <div className="flex items-center gap-2.5 text-rose-400 mb-2">
                  <Building2 className="w-5 h-5 shrink-0" />
                  <h4 className="text-base sm:text-lg font-roboto-bold text-white">
                    3. Corporate Network Ingress & Ransomware
                  </h4>
                </div>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  When employees type work credentials into convincing spoofed Microsoft 365, Okta, or Google Workspace pages, hackers gain the foothold required to move laterally, exfiltrate sensitive trade secrets, and deploy devastating enterprise ransomware.
                </p>
                <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 font-roboto-medium-italic">
                  &ldquo;Over 80% of major corporate ransomware extortion events originate from one single employee falling victim to a targeted spear-phishing lure.&rdquo;
                </div>
              </div>

              {/* Consequence 4 */}
              <div className="p-5 rounded-xl bg-black/70 border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                <div className="flex items-center gap-2.5 text-rose-400 mb-2">
                  <FileWarning className="w-5 h-5 shrink-0" />
                  <h4 className="text-base sm:text-lg font-roboto-bold text-white">
                    4. Severe Regulatory Fines & Legal Liability
                  </h4>
                </div>
                <p className="text-sm text-gray-300 font-roboto-medium leading-relaxed">
                  For businesses, failure to implement rigorous anti-phishing hygiene and data protection directly breaches compliance standards such as GDPR, HIPAA, PCI-DSS, and CCPA, resulting in catastrophic multimillion-dollar fines, lawsuits, and license revocation.
                </p>
                <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 font-roboto-medium-italic">
                  &ldquo;Organizations face regulatory audits, permanent brand degradation, and customer churn that many businesses never recover from.&rdquo;
                </div>
              </div>

            </div>

            {/* Tactical Safe Habits Box */}
            <div className="p-5 rounded-xl bg-black/80 border border-white/10">
              <h4 className="text-sm sm:text-base font-roboto-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>The Golden Rules of Online Data Hygiene:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300 font-roboto-medium">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-roboto-bold text-green-400 block mb-1">1. Audit Before You Enter</span>
                  Always submit unknown links to PhishRadar before providing passwords, OTPs, or credit card details.
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-roboto-bold text-green-400 block mb-1">2. Hardware-Backed 2FA</span>
                  Use FIDO2 / WebAuthn security keys or authenticator apps rather than vulnerable SMS-based OTPs.
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-roboto-bold text-green-400 block mb-1">3. Password Uniqueness</span>
                  Never reuse credentials. A password manager protects against entering legitimate credentials on spoofed domains.
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </section>
  );
};
