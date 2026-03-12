import React, { useState, useRef, useEffect } from "react";

type HSNHit = { code: string; relevance?: string; confidence?: number };
type Message = { role: "user" | "assistant"; text: string; hsn?: HSNHit[] };

export default function HSNChatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I can help you find HSN codes for products, or tell you what product an HSN code is for. How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { role: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();
    try {
      const API_BASE =
        (typeof (globalThis as any).__API_BASE === "string"
          ? (globalThis as any).__API_BASE
          : typeof import.meta !== "undefined" && (import.meta as any).env
            ? (import.meta as any).env.VITE_API_BASE_URL
            : "") || "http://localhost:4000/api";

      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 429 || (j && j.error === "quota_exceeded")) {
          // Gemini API is dead (rate limited). Fallback silently to Local Node.js Search API
          try {
            const cleanText = text.toLowerCase().replace(/[^a-z]/g, "");
            const greetings = ["hi", "hello", "hey", "hii", "heyy", "greetings", "heya"];
            if (greetings.includes(cleanText)) {
              setMessages((m) => [...m, { role: "assistant", text: "Hello! How can I help you find an HSN code today?" }]);
              return;
            }

            const fallbackRes = await fetch(`${API_BASE}/find`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ keywords: text }),
            });
            const fallbackData = await fallbackRes.json();

            if (fallbackData.hsn && fallbackData.hsn.length > 0) {
              const topMatch = fallbackData.hsn[0];
              const hasMore = fallbackData.hsn.length > 1;

              let msg = `The top matched HSN code for "${text}" is ${topMatch.code} (${topMatch.description}).\n\n`;
              if (hasMore) {
                msg += `Other highly relevant matches include:\n`;
                fallbackData.hsn.slice(1, 4).forEach((h: any) => {
                  msg += `• ${h.code} - ${h.description}\n`;
                });
              }
              setMessages((m) => [...m, { role: "assistant", text: msg.trim() }]);
              return; // Exit successfully
            } else {
              setMessages((m) => [...m, { role: "assistant", text: `I couldn't find any exact matches for "${text}" in the GST database. Try searching with different keywords.` }]);
              return;
            }
          } catch (fallbackErr) {
            console.error("Fallback search also failed:", fallbackErr);
            // Let the error flow to the outer catch
            throw new Error("Both Gemini and Local Search failed.");
          }
        } else if (j && j.answer) {
          setMessages((m) => [...m, { role: "assistant", text: j.answer }]);
        } else {
          throw new Error(`chat failed ${res.status}`);
        }
      } else if (j && j.answer) {
        setMessages((m) => [...m, { role: "assistant", text: j.answer }]);
      }
    } catch (err: any) {
      console.error("HSNChatbot error:", err);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "I'm sorry, I couldn't connect to the server. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      border: "1px solid #f1f5f9",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #f1f5f9",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#3b82f6",
          flexShrink: 0,
        }}>
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#1e293b", fontWeight: 700, fontSize: "15px", lineHeight: 1.2 }}>
            AI Assistant
          </div>
          <div style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
            HSN Code Expert
          </div>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "#ecfdf5",
          border: "1px solid #a7f3d0",
          borderRadius: "12px",
          padding: "4px 10px",
        }}>
          <div style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#10b981",
          }} />
          <span style={{ color: "#059669", fontSize: "11px", fontWeight: 600 }}>Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          background: "#fafafa",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: m.role === "user" ? "flex-end" : "flex-start",
              gap: "4px",
            }}
          >
            <div style={{
              fontSize: "11px",
              color: "#94a3b8",
              padding: "0 4px",
              fontWeight: 500,
            }}>
              {m.role === "user" ? "You" : "Assistant"}
            </div>
            <div style={{
              maxWidth: "85%",
              padding: "12px 16px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? "#3D4BFF" : "#ffffff",
              border: m.role === "user" ? "none" : "1px solid #e2e8f0",
              color: m.role === "user" ? "#ffffff" : "#334155",
              fontSize: "14px",
              lineHeight: "1.5",
              boxShadow: m.role === "user" ? "0 4px 12px rgba(61,75,255,0.2)" : "0 2px 4px rgba(0,0,0,0.02)",
            }}>
              <div style={{ whiteSpace: "pre-wrap" }}>
                {(() => {
                  let t = m.text;
                  const options: string[] = [];
                  const optionRegex = /\[OPTION:\s*(.*?)\]/g;
                  let match;
                  while ((match = optionRegex.exec(t)) !== null) {
                    options.push(match[1]);
                  }
                  t = t.replace(optionRegex, "").trim();

                  return (
                    <>
                      {t}
                      {options.length > 0 && (
                        <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setInput(opt);
                                setTimeout(() => {
                                  if (inputRef.current) {
                                    const userMsg: Message = { role: "user", text: opt };
                                    const newMessages = [...messages, userMsg];
                                    setMessages(newMessages);
                                    setInput("");
                                    setLoading(true);

                                    const API_BASE = (typeof (globalThis as any).__API_BASE === "string" ? (globalThis as any).__API_BASE : typeof import.meta !== "undefined" && (import.meta as any).env ? (import.meta as any).env.VITE_API_BASE_URL : "") || "http://localhost:4000/api";

                                    fetch(`${API_BASE}/chat`, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.text })) }),
                                    })
                                      .then(r => r.json())
                                      .then(j => setMessages(cur => [...cur, { role: "assistant", text: j.answer }]))
                                      .catch(err => setMessages(cur => [...cur, { role: "assistant", text: "Error" }]))
                                      .finally(() => setLoading(false));
                                  }
                                }, 10);
                              }}
                              style={{
                                background: "#eff6ff",
                                border: "1px solid #bfdbfe",
                                borderRadius: "8px",
                                padding: "6px 12px",
                                color: "#3b82f6",
                                fontSize: "13px",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.background = "#dbeafe")}
                              onMouseOut={(e) => (e.currentTarget.style.background = "#eff6ff")}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              {m.hsn && (
                <ul style={{ marginTop: "8px", paddingLeft: "16px", marginBottom: 0 }}>
                  {m.hsn.map((h, idx) => (
                    <li key={idx} style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
                      <span style={{
                        background: "#f1f5f9",
                        border: "1px solid #cbd5e1",
                        borderRadius: "4px",
                        padding: "1px 6px",
                        fontWeight: 600,
                        marginRight: "6px",
                        fontSize: "12px",
                        color: "#0f172a"
                      }}>{h.code}</span>
                      {h.relevance ? `${h.relevance} Match` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8", padding: "0 4px", fontWeight: 500 }}>
              Assistant
            </div>
            <div style={{
              padding: "14px 18px",
              borderRadius: "16px 16px 16px 4px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}>
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {[0, 1, 2].map((n) => (
                  <div key={n} style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#94a3b8",
                    animation: `typing-bounce 1s ease-in-out ${n * 0.15}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "16px",
        background: "#ffffff",
        borderTop: "1px solid #f1f5f9",
      }}>
        <form
          onSubmit={sendMessage}
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "8px 8px 8px 16px",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3D4BFF";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(61,75,255,0.1)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a product or HSN code…"
            disabled={loading}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#334155",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              border: "none",
              background: input.trim() && !loading ? "#3D4BFF" : "#e2e8f0",
              color: input.trim() && !loading ? "#ffffff" : "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: "10px", fontSize: "11px", color: "#94a3b8" }}>
          Powered by Gemini AI
        </div>
      </div>

      <style>{`
        @keyframes typing-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
