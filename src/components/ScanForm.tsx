import React, { useState } from 'react';
import { Search, ShieldAlert, ArrowRight, X, Loader2, Sparkles, Check } from 'lucide-react';

interface ScanFormProps {
  onScan: (url: string) => void;
  isLoading: boolean;
}

export const ScanForm: React.FC<ScanFormProps> = ({ onScan, isLoading }) => {
  const steps = [
    'Parsing URL',
    'Checking domain and lookalikes',
    'Inspecting TLS',
    'Auditing headers',
    'Querying community intel',
  ];

  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Advance stepper while loading
  React.useEffect(() => {
    if (isLoading) {
      setCurrentStep(0);
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 400); // approx 0.4s per step → ~2s total
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please paste or type a URL to inspect.');
      return;
    }
    // Ensure protocol present, default to https
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const finalUrl = hasProtocol ? trimmed : `https://${trimmed}`;
    // Validate URL format
    try {
      new URL(finalUrl);
    } catch {
      setError('The URL appears malformed. Please check and try again.');
      return;
    }
    setError(null);
    setUrl(finalUrl);
    onScan(finalUrl);
  };

  const handleQuickPick = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
    onScan(sampleUrl);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-[0_0_35px_rgba(0,255,102,0.12)] transition-all duration-300 focus-within:border-green-500/80 focus-within:shadow-[0_0_40px_rgba(0,255,102,0.25)]">
          <div className="flex items-center flex-1 px-3 py-2 sm:py-0">
            <Search className="w-5 h-5 text-green-400 shrink-0 mr-3" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste suspicious link (e.g. https://secure-login.bank.top/auth)..."
              disabled={isLoading}
              className="w-full bg-transparent text-white placeholder-gray-500 text-base sm:text-lg focus:outline-none font-mono py-2"
              aria-label="URL to scan"
            />
            {url && !isLoading && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1.5 text-gray-400 hover:text-white rounded-md transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 sm:mt-0 sm:ml-2 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-400 text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:from-green-400 hover:to-emerald-300 transition-all duration-200 shadow-[0_0_20px_rgba(0,255,102,0.4)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0 min-h-[44px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                <span className="text-sm">Scanning...</span>
              </>
            ) : (
              <>
                <span>Analyze Target</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Stepper progress (shown below input while scanning) */}
        {isLoading && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 px-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
                  idx < currentStep
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : idx === currentStep
                    ? 'bg-green-500 text-black border border-green-400 shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                    : 'bg-white/5 text-gray-500 border border-white/10'
                }`}
              >
                {idx < currentStep ? (
                  <Check className="w-3 h-3" />
                ) : idx === currentStep ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : null}
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm px-2">
            <ShieldAlert className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Preset Quick Tests */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
        <span className="flex items-center gap-1 text-gray-500">
          <Sparkles className="w-3.5 h-3.5 text-green-400" /> Quick presets:
        </span>
        <button
          type="button"
          onClick={() => handleQuickPick('https://github.com')}
          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/40 text-gray-300 hover:text-green-300 transition-colors font-mono"
        >
          Safe (github.com)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPick('https://paypal-update-center.account-login.top')}
          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/40 text-gray-300 hover:text-yellow-300 transition-colors font-mono"
        >
          Suspicious (paypal-update.top)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPick('http://192.168.1.100/chase-online/auth/login.php')}
          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-red-300 transition-colors font-mono"
        >
          Malicious (192.168.1.100)
        </button>
      </div>
    </div>
  );
};
