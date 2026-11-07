import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, History, ArrowDown, Activity } from 'lucide-react';
import { CyberGrid } from './components/CyberGrid';
import { ScanForm } from './components/ScanForm';
import { ScanResults } from './components/ScanResults';
import { ScanResult } from './types';
import { mockResults } from './mockData';

export const App: React.FC = () => {
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const performScan = async (targetUrl: string) => {
    setIsLoading(true);

    try {
      // 1. Attempt connection to the backend FastAPI /scan endpoint
      const response = await fetch('/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (response.ok) {
        const data: ScanResult = await response.json();
        setCurrentResult(data);
        setScanHistory((prev) => [data, ...prev.filter((p) => p.url !== data.url)].slice(0, 5));
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return;
      }
    } catch {
      // Backend not yet running or network error -> fallback to client-side heuristics & mock datasets
    }

    // 2. Client-side heuristic analyzer fallback (Step 1 requirement)
    await new Promise((resolve) => setTimeout(resolve, 1100)); // Simulate radar inspection
    const lower = targetUrl.toLowerCase();
    let selectedMock: ScanResult;

    if (lower.includes('192.168') || lower.includes('chase-online') || lower.includes('login.php')) {
      selectedMock = { ...mockResults.malicious, url: targetUrl, scanned_at: new Date().toISOString() };
    } else if (lower.includes('paypal') || lower.includes('.top') || lower.includes('update') || lower.includes('verify')) {
      selectedMock = { ...mockResults.suspicious, url: targetUrl, scanned_at: new Date().toISOString() };
    } else {
      selectedMock = { ...mockResults.safe, url: targetUrl, scanned_at: new Date().toISOString() };
    }

    setCurrentResult(selectedMock);
    setScanHistory((prev) => [selectedMock, ...prev.filter((p) => p.url !== selectedMock.url)].slice(0, 5));
    setIsLoading(false);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleVote = async (vote: 'safe' | 'malicious') => {
    if (!currentResult) return;
    try {
      await fetch('/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: currentResult.url, vote }),
      });
    } catch {
      // Offline fallback
    }

    setCurrentResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        intel: {
          ...prev.intel,
          community_votes: {
            safe: prev.intel.community_votes.safe + (vote === 'safe' ? 1 : 0),
            malicious: prev.intel.community_votes.malicious + (vote === 'malicious' ? 1 : 0),
          },
        },
      };
    });
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-gray-100 flex flex-col justify-between selection:bg-green-500/30 selection:text-green-300">
      {/* Matrix Canvas Backdrop */}
      <CyberGrid />

      {/* Top Cyber Navigation Bar */}
      <header className="relative z-20 w-full border-b border-white/10 bg-black/70 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wider font-mono text-sm sm:text-base">
                PHISHRADAR
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Phishing & Malicious Website Detection Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-gray-300">RADAR ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-16">
        
        {/* Central Hero Scanner Card */}
        <div className="w-full max-w-4xl text-center">
          
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
          >
            <Radio className="h-4 w-4 text-green-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-gray-200 font-mono">
              Zero-Trust URL & Threat Telemetry
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-100 to-gray-500"
          >
            Detect Malicious Websites
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 font-normal leading-relaxed"
          >
            Multi-vector threat audit: detect homoglyph lookalikes, audit SSL certificate transparency, grade security headers, and cross-reference real-time threat intelligence.
          </motion.p>

          {/* Search Input Box */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <ScanForm onScan={performScan} isLoading={isLoading} />
          </motion.div>

          {/* Scan History Pill Tags */}
          {scanHistory.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1 text-gray-500">
                <History className="w-3.5 h-3.5" /> Recent targets:
              </span>
              {scanHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentResult(item)}
                  className="px-2 py-1 rounded bg-black/60 border border-white/10 hover:border-green-500/30 text-gray-300 hover:text-white transition-colors"
                >
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${item.verdict === 'Safe' ? 'bg-emerald-400' : item.verdict === 'Suspicious' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                  {item.url.replace(/^https?:\/\//, '').slice(0, 24)}...
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scan Results Anchor & Display */}
        <div ref={resultsRef} className="w-full">
          {currentResult && (
            <ScanResults result={currentResult} onVote={handleVote} />
          )}
        </div>
      </main>

      {/* Cyber Footer */}
      <footer className="relative z-20 w-full border-t border-white/10 bg-black/80 backdrop-blur-md px-4 sm:px-8 py-5 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Safe • Suspicious • Malicious Defense System</span>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Threat Analysis • Headers • Certificates • Intel</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

