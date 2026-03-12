import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchHSN, HSNRecord } from '../utils/hsnSearch';
import { getSuggestions, Suggestion } from '../utils/suggestionEngine';

function useDebounced(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function HSNFinder() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounced = useDebounced(query, 300);
  const [results, setResults] = useState<Array<{ record: HSNRecord; score?: number }>>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestRef = useRef<HTMLDivElement | null>(null);

  // Live suggestions on every keystroke (O(1) — no debounce needed)
  useEffect(() => {
    const raw = query.trim();
    if (raw.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    const subs = getSuggestions(raw, 6);
    setSuggestions(subs);
    setShowSuggestions(subs.length > 0);
  }, [query]);

  // Debounced search
  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!debounced) { setResults([]); return; }
      setLoading(true);
      try {
        const res = await searchHSN(debounced, 5);
        if (!mounted) return;
        setResults(res);
        listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [debounced]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestRef.current && !suggestRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = useCallback((phrase: string) => {
    setQuery(phrase);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  async function handleCopy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch (e) { console.error(e); }
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">HSN / SAC Finder</h3>
        <div className="text-sm text-gray-500">Fast client-side search</div>
      </div>

      {/* Input + Suggestion Dropdown */}
      <div className="relative mb-3">
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Type HSN code or product (e.g. 'steel pipe')"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          autoComplete="off"
        />

        {showSuggestions && (
          <div
            ref={suggestRef}
            className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onMouseDown={() => handleSuggestionClick(s.phrase)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                <span className="font-medium">{s.phrase}</span>
                <span className="ml-2 text-xs text-gray-400">{s.freq} matches</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="min-h-[120px]">
        {loading && <div className="text-sm text-gray-500">Searching...</div>}
        {!loading && results.length === 0 && debounced && (
          <div className="text-sm text-gray-500">No results</div>
        )}

        <div ref={listRef} className="space-y-3">
          {results.map((r, idx) => (
            <div key={idx} className="p-3 border rounded-md flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block bg-gray-100 text-gray-800 font-semibold px-2 py-1 rounded">
                    HSN {r.record.hsn_sac}
                  </span>
                  {r.record.gst_rate && (
                    <span className="inline-block bg-green-100 text-green-800 font-medium px-2 py-1 rounded">
                      {r.record.gst_rate}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-700">{r.record.description}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleCopy(r.record.hsn_sac)}
                  className="text-sm px-2 py-1 bg-indigo-600 text-white rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
