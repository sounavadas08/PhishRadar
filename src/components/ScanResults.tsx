import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, Lock, Globe, Server, 
  Users, CheckCircle2, XCircle, AlertCircle, ThumbsUp, ThumbsDown,
  ExternalLink, ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import { ScanResult } from '../types';
// Detect reduced motion preference
const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ScanResultsProps {
  result: ScanResult;
  onVote?: (vote: 'safe' | 'malicious') => void;
}

export const ScanResults: React.FC<ScanResultsProps> = ({ result, onVote }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'threat' | 'headers' | 'cert' | 'intel'>('all');
  const [userVoted, setUserVoted] = useState<'safe' | 'malicious' | null>(null);

  const getVerdictTheme = (verdict: string) => {
    switch (verdict.toLowerCase()) {
      case 'low risk':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/40',
          text: 'text-emerald-400',
          glow: 'shadow-[0_0_35px_rgba(16,185,129,0.2)]',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          barColor: 'from-emerald-500 to-green-400',
          icon: ShieldCheck
        };
      case 'safe':
        // fallback for any legacy data
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/40',
          text: 'text-emerald-400',
          glow: 'shadow-[0_0_35px_rgba(16,185,129,0.2)]',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          barColor: 'from-emerald-500 to-green-400',
          icon: ShieldCheck
        };
      case 'suspicious':
        return {
          bg: 'bg-amber-950/40 border-amber-500/40',
          text: 'text-amber-400',
          glow: 'shadow-[0_0_35px_rgba(245,158,11,0.2)]',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          barColor: 'from-amber-500 to-yellow-400',
          icon: AlertTriangle
        };
      case 'malicious':
      default:
        return {
          bg: 'bg-rose-950/40 border-rose-500/40',
          text: 'text-rose-400',
          glow: 'shadow-[0_0_35px_rgba(244,63,94,0.25)]',
          badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          barColor: 'from-rose-500 to-red-400',
          icon: ShieldAlert
        };
    }
  };

  const theme = getVerdictTheme(result.verdict);
  const VerdictIcon = theme.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUserVote = (vote: 'safe' | 'malicious') => {
    setUserVoted(vote);
    if (onVote) onVote(vote);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 space-y-6">
      {/* Primary Verdict Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-xl ${theme.bg} ${theme.glow} transition-all duration-300`}>
          {/* Copy report button */}
          <button
            onClick={() => {
              const defanged = result.url.replace(/^https?:\/\//i, (match) => match.replace('http', 'hxxp')).replace(/\./g, '[.]');
              const text = `URL: ${defanged}\nVerdict: ${result.verdict}\nScore: ${result.score}/100\nReasons:\n${result.reasons.join('\n')}`;
              navigator.clipboard.writeText(text);
              // Show temporary copied state via local state (could reuse copied state) - reuse existing copied state for URL copy
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
            }
            className="ml-2 px-2 py-1 rounded bg-green-600/20 text-green-300 hover:bg-green-600/30 transition-colors text-xs"
          >
            {copied ? 'Copied' : 'Copy Report'}
          </button>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl ${theme.badge} border`}>
              <VerdictIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${theme.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md border ${theme.badge}`}>
                  VERDICT: {result.verdict}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(result.scanned_at).toLocaleTimeString()}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                Risk Score: <span className={theme.text}>{result.score}</span> / 100
              </h2>
              <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-400 font-mono break-all">
                <span>{result.url}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:text-white transition-colors"
                  title="Copy scanned URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Calibrated Risk Meter */}
          <div className="w-full md:w-48 bg-black/50 p-4 rounded-xl border border-white/10 shrink-0">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-mono">
              <span>Risk Meter</span>
              <span className={`font-bold ${theme.text}`}>{result.score}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${theme.barColor} transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(100, Math.max(5, result.score))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
              <span>0 (Safe)</span>
              <span>100 (Critical)</span>
            </div>
          </div>
        </div>

        {/* Plain-Language Findings */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
            Why this verdict was reached:
          </h3>
          <ul className="space-y-2">
            {result.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${result.verdict === 'Safe' ? 'bg-emerald-400' : result.verdict === 'Suspicious' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Module Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          All 4 Inspection Modules
        </button>
        <button
          onClick={() => setActiveTab('threat')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'threat'
              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Threat Analysis
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'headers'
              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Security Headers ({result.security_headers.grade})
        </button>
        <button
          onClick={() => setActiveTab('cert')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'cert'
              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Certificate Validation
        </button>
        <button
          onClick={() => setActiveTab('intel')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'intel'
              ? 'bg-green-500/20 text-green-300 border border-green-500/40'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Threat Intelligence
        </button>
      </div>

      {/* Grid of 4 Detailed Check Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Module 1: Threat Analysis */}
        {(activeTab === 'all' || activeTab === 'threat') && (
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-white text-base">Threat Analysis</h4>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${result.threat.lookalike_detected || result.threat.ip_host ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  {result.threat.lookalike_detected || result.threat.ip_host ? 'Anomaly Detected' : 'Patterns Normal'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-gray-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Punycode / Homoglyph:</span>
                  <span className={result.threat.lookalike_detected ? 'text-amber-400 font-bold' : 'text-gray-200'}>
                    {result.threat.lookalike_detected ? 'Lookalike Detected' : 'None'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Host Type:</span>
                  <span className={result.threat.ip_host ? 'text-rose-400 font-bold' : 'text-gray-200'}>
                    {result.threat.ip_host ? 'Raw IP Host (High Risk)' : 'Registered Domain'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Top-Level Domain (TLD):</span>
                  <span className={result.threat.suspicious_tld ? 'text-amber-400' : 'text-gray-200'}>
                    {result.threat.tld} {result.threat.suspicious_tld ? '(Flagged TLD)' : ''}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Subdomain Depth:</span>
                  <span className="text-gray-200">{result.threat.subdomain_depth} level(s)</span>
                </div>
                {result.threat.suspicious_keywords.length > 0 && (
                  <div className="py-1">
                    <span className="text-gray-500 block mb-1">Target Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {result.threat.suspicious_keywords.map((k, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-rose-500/10 text-rose-300 rounded text-[11px]">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-400">
              {result.threat.findings.map((f, i) => (
                <p key={i} className="flex items-center gap-1.5 py-0.5">
                  <span className="text-green-400">›</span> {f}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Module 2: Web Security Assessment */}
        {(activeTab === 'all' || activeTab === 'headers') && (
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-white text-base">Security Assessment</h4>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded font-bold font-mono ${
                  result.security_headers.grade === 'A+' || result.security_headers.grade === 'A'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : result.security_headers.grade === 'B' || result.security_headers.grade === 'C'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  Grade: {result.security_headers.grade}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-white/5 flex items-center justify-between">
                  <span className="text-gray-400">HSTS:</span>
                  {result.security_headers.hsts ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Present</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Missing</span>
                  )}
                </div>
                <div className="p-2 rounded bg-white/5 flex items-center justify-between">
                  <span className="text-gray-400">CSP:</span>
                  {result.security_headers.csp ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Present</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Missing</span>
                  )}
                </div>
                <div className="p-2 rounded bg-white/5 flex items-center justify-between">
                  <span className="text-gray-400">X-Frame-Opts:</span>
                  {result.security_headers.x_frame_options ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Protected</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Vulnerable</span>
                  )}
                </div>
                <div className="p-2 rounded bg-white/5 flex items-center justify-between">
                  <span className="text-gray-400">Content-Type:</span>
                  {result.security_headers.x_content_type_options ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Protected</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Missing</span>
                  )}
                </div>
              </div>

              {result.security_headers.server_version_leaked && (
                <div className="mt-3 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300">
                  <span className="font-semibold">Version Leak:</span> {result.security_headers.server_version_leaked}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-400">
              {result.security_headers.findings.map((f, i) => (
                <p key={i} className="flex items-center gap-1.5 py-0.5">
                  <span className="text-green-400">›</span> {f}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Module 3: Certificate Validation */}
        {(activeTab === 'all' || activeTab === 'cert') && (
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-white text-base">Certificate Validation</h4>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${result.certificate.valid && !result.certificate.flagged_ca ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {result.certificate.valid && !result.certificate.flagged_ca ? 'TLS Valid' : 'Cert Risk'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono text-gray-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Issuer CA:</span>
                  <span className="text-gray-200 truncate max-w-[200px]" title={result.certificate.issuer}>
                    {result.certificate.issuer}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Key Strength / Algo:</span>
                  <span className="text-gray-200">{result.certificate.key_size ? `${result.certificate.key_size}-bit` : 'N/A'} ({result.certificate.signature_algorithm})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">Certificate Age:</span>
                  <span className={result.certificate.days_since_issued <= 7 ? 'text-amber-400 font-bold' : 'text-gray-200'}>
                    {result.certificate.days_since_issued} day(s) old {result.certificate.days_since_issued <= 7 ? '(Fresh Cert)' : ''}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-500">CT Log Audit:</span>
                  <span className={result.certificate.ct_log_verified ? 'text-emerald-400' : 'text-rose-400'}>
                    {result.certificate.ct_log_verified ? 'Verified in Logs' : 'Not Recorded'}
                  </span>
                </div>
                {result.certificate.flagged_ca && (
                  <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <span className="font-semibold">Flagged CA Watchlist:</span> {result.certificate.flagged_reason}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-400">
              {result.certificate.findings.map((f, i) => (
                <p key={i} className="flex items-center gap-1.5 py-0.5">
                  <span className="text-green-400">›</span> {f}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Module 4: Collaborative Threat Intelligence */}
        {(activeTab === 'all' || activeTab === 'intel') && (
          <div className="bg-black/60 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <h4 className="font-semibold text-white text-base">Threat Intelligence</h4>
                </div>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-blue-500/20 text-blue-300">
                  Collaborative Intel
                </span>
              </div>

              {/* Feed Cross-Checks */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center mb-4">
                <div className="p-2 rounded bg-white/5">
                  <span className="text-gray-400 block text-[10px]">SafeBrowsing</span>
                  <span className={`font-semibold ${result.intel.google_safebrowsing === 'Clean' ? 'text-emerald-400' : result.intel.google_safebrowsing === 'Flagged' ? 'text-rose-400' : 'text-gray-400'}`}>
                    {result.intel.google_safebrowsing}
                  </span>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <span className="text-gray-400 block text-[10px]">PhishTank</span>
                  <span className={`font-semibold ${result.intel.phishtank === 'Clean' ? 'text-emerald-400' : result.intel.phishtank === 'Flagged' ? 'text-rose-400' : 'text-gray-400'}`}>
                    {result.intel.phishtank}
                  </span>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <span className="text-gray-400 block text-[10px]">VirusTotal</span>
                  <span className={`font-semibold ${result.intel.virustotal === 'Clean' ? 'text-emerald-400' : result.intel.virustotal === 'Flagged' ? 'text-rose-400' : 'text-gray-400'}`}>
                    {result.intel.virustotal}
                  </span>
                </div>
              </div>

              {/* Community Votes & Interactive Voting */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-gray-400">Community Consensus:</span>
                  <span className="text-gray-300">
                    <span className="text-emerald-400">{result.intel.community_votes.safe} Safe</span> / <span className="text-rose-400">{result.intel.community_votes.malicious} Malicious</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-gray-400">Your report:</span>
                  <button
                    onClick={() => handleUserVote('safe')}
                    disabled={userVoted !== null}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      userVoted === 'safe'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Vote Safe
                  </button>
                  <button
                    onClick={() => handleUserVote('malicious')}
                    disabled={userVoted !== null}
                    className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      userVoted === 'malicious'
                        ? 'bg-rose-500 text-black'
                        : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    Flag Malicious
                  </button>
                </div>
                {userVoted && (
                  <p className="text-[11px] text-green-400 font-mono mt-2 text-center">
                    ✓ Feedback recorded to threat database.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-xs text-gray-400">
              {result.intel.findings.map((f, i) => (
                <p key={i} className="flex items-center gap-1.5 py-0.5">
                  <span className="text-green-400">›</span> {f}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

