import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { ScanResult } from '../types';

interface SimulationProps {
  onScan: (url: string) => Promise<void>;
  onClose: () => void;
}

export const Simulation: React.FC<SimulationProps> = ({ onScan, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');

  const extractUrl = (text: string): string | null => {
    // Simple regex to find first http(s) URL
    const match = text.match(/https?:\/\/[^\s\"'<>]+/i);
    return match ? match[0] : null;
  };

  const handleRun = async () => {
    setError('');
    const found = extractUrl(input);
    if (!found) {
      setError('No valid URL found in the input.');
      return;
    }
    setUrl(found);
    setLoading(true);
    try {
      await onScan(found);
    } catch (e) {
      setError('Scan failed.');
    }
    setLoading(false);
  };

  return (
    <dialog open className="fixed inset-0 z-50 w-full h-full bg-black/80 backdrop-blur-md flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg shadow-lg border border-white/10">
        <h2 className="text-xl font-roboto-bold text-white mb-4">Phishing Simulation Playground</h2>
        <textarea
          className="w-full h-32 p-2 rounded bg-black/50 border border-white/20 text-gray-200 focus:outline-none focus:border-green-500 font-roboto-medium"
          placeholder="Paste a URL, HTML snippet, or text containing a link…"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {error && <p className="text-rose-400 mt-2 font-roboto-medium">{error}</p>}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleRun}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500 flex items-center gap-1"
          >
            {loading ? <Check className="w-4 h-4 animate-pulse" /> : <Check className="w-4 h-4" />}
            Run Simulation
          </button>
        </div>
      </div>
    </dialog>
  );
};

