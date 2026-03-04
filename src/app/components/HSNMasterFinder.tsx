import React, { useEffect, useState, useRef } from 'react';
import { searchHSN, logClick } from '../utils/hsnSearch';
import { suggestionLabel } from '../utils/powerSearch';

function useDebounced(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => { clearTimeout(t); };
  }, [value, delay]);
  return debounced;
}

export default function HSNMasterFinder() {
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query, 300);
  const [results, setResults] = useState<Array<Awaited<ReturnType<typeof searchHSN>>[number]>>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const debouncedRef = useRef(debounced);
  useEffect(() => { debouncedRef.current = debounced; }, [debounced]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!debounced) { setResults([]); return; }
      setLoading(true);
      try {
        const res = await searchHSN(debounced, 5);
        if (mounted) setResults(res);
      } catch (e) {
        console.error('searchHSN failed', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [debounced]);

  async function handleCopy(hsnCode: string) {
    try {
      await navigator.clipboard.writeText(hsnCode);
      logClick(debouncedRef.current, hsnCode);
      setCopied(hsnCode);
      setTimeout(() => setCopied(null), 1500);
    } catch (e) { console.error('copy failed', e); }
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-800">HSN / SAC Finder</h3>
        <span className="text-xs text-slate-400">Smart search</span>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a product (e.g. 'steel pipe', 'cotton yarn')"
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
      />

      {loading && (
        <p className="text-sm text-slate-400">Searching…</p>
      )}

      {!loading && debounced && results.length === 0 && (
        <p className="text-sm text-slate-400">No results found.</p>
      )}

      <div className="space-y-2">
        {results.map((r, idx) => {
          const label = suggestionLabel(r.record.description);
          const isCopied = copied === r.record.hsn_sac;
          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 px-4 py-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {/* Left: code + label + GST rate */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-sm font-semibold text-slate-800 shrink-0">
                  {r.record.hsn_sac}
                </span>
                {r.record.gst_rate && (
                  <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">
                    GST {r.record.gst_rate}
                  </span>
                )}
                <span className="text-sm text-slate-500 truncate">
                  {label}
                </span>
              </div>

              {/* Right: copy button */}
              <button
                onClick={() => handleCopy(r.record.hsn_sac)}
                className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${isCopied
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                {isCopied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
