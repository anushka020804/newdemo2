import React, { useEffect, useRef, useState } from 'react';
import { searchMaster } from '../utils/powerSearch';
import type { GSTRecord } from '../utils/powerSearch';

type Message = { role: 'user' | 'assistant'; text: string; results?: Array<{ record: GSTRecord; score?: number }>; };

function formatConfidence(score?: number) {
  if (typeof score !== 'number') return undefined;
  const conf = Math.max(0, Math.min(1, 1 - score));
  return Math.round(conf * 100);
}

export default function HSNMasterChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi — tell me what you want. Example: 'Give me HSN codes for steel pipes'" }
  ]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  function pushMessage(m: Message) { setMessages(prev => [...prev, m]); }

  function detectIntent(q: string) {
    const t = q.trim();
    if (/^\d+$/.test(t)) return 'numeric';
    return 'text';
  }

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return;
    pushMessage({ role: 'user', text });
    setInput('');
    setLoading(true);
    try {
      const intent = detectIntent(text);
      const res = await searchMaster(text, 4);
      if (!res || res.length === 0) {
        pushMessage({ role: 'assistant', text: 'I could not find authoritative matches. Can you provide more details (material, shape, example)?' });
      } else {
        const bestScore = typeof res[0].score === 'number' ? (1 - res[0].score) : 1;
        if (bestScore < 0.4) {
          pushMessage({ role: 'assistant', text: 'I found some candidates but confidence is low. Do you have more details (material/form)?', results: res });
        } else {
          pushMessage({ role: 'assistant', text: `Top ${res.length} matches:`, results: res });
        }
      }
    } catch (err) {
      console.error(err);
      pushMessage({ role: 'assistant', text: 'Request failed — try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } catch (e) {
      console.error('copy failed', e);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
      <h3 className="text-md font-semibold mb-3">HSN Chat (Master)</h3>

      <div className="border rounded p-3 mb-3 custom-scrollbar" style={{ maxHeight: 320, overflow: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'mb-3 text-right' : 'mb-3 text-left'}>
            <div className={`inline-block chat-bubble ${m.role === 'user' ? 'chat-user' : 'chat-assistant'}`}>
              <div className="text-sm">{m.text}</div>
              {m.results && m.results.length > 0 && (
                <div className="mt-2 space-y-2">
                  {m.results.map((r, idx) => (
                    <div key={idx} className="result-card">
                      <div style={{ width: 72 }}>
                        <div className="result-badge">{r.record.code}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="meta">{(r.record as any).gst_rate || r.record.type}</div>
                          {typeof r.score === 'number' && (
                            <div className="ml-2 text-xs muted">{formatConfidence(r.score)}%</div>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 truncate-2">{r.record.description}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => handleCopy(r.record.code)} className="copy-small">Copy</button>
                        {copied === r.record.code && <div className="text-xs" style={{ color: 'var(--success)' }}>Copied!</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">HSN Bot is typing...</div>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask: Give me HSN codes for steel" className="flex-1 px-3 py-2 border rounded" />
        <button type="submit" disabled={loading} className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}
