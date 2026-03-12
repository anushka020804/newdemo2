import { useState, useRef, useEffect } from "react";
import { Bot, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

/** Minimal markdown renderer: bold, italic, inline code, line breaks */
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) elements.push(<br key={`br-${lineIdx}`} />);

    const bulletMatch = line.match(/^(\s*)[*-]\s+(.*)/);
    const content = bulletMatch ? bulletMatch[2] : line;
    const isBullet = !!bulletMatch;

    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      if (match[2]) {
        parts.push(<strong key={`b-${lineIdx}-${match.index}`}>{match[2]}</strong>);
      } else if (match[3]) {
        parts.push(<em key={`i-${lineIdx}-${match.index}`}>{match[3]}</em>);
      } else if (match[4]) {
        parts.push(
          <code key={`c-${lineIdx}-${match.index}`} className="bg-gray-200 px-1 rounded text-[12px]">
            {match[4]}
          </code>
        );
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    if (isBullet) {
      elements.push(
        <span key={`li-${lineIdx}`} className="flex gap-1.5 ml-1">
          <span className="text-indigo-400">•</span>
          <span>{parts}</span>
        </span>
      );
    } else {
      elements.push(<span key={`line-${lineIdx}`}>{parts}</span>);
    }
  });

  return elements;
}

export function InlineChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey! How can I help you?\nAsk me anything related to this tender.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const GEMINI_API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY;
      const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const history = [...messages, userMsg];
      const contents = history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: "You are Opportunity X AI, an expert assistant for tenders, bids, and procurement on the GeM (Government e-Marketplace) portal in India. Keep responses concise (2-3 sentences max). Be professional and helpful." }],
          },
          contents,
        }),
      });

      const data = await res.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-[400px] sm:h-[670px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-3 sm:p-4 font-bold text-center text-sm sm:text-[16px]">
        Opportunity X AI
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-3 sm:p-5 bg-white overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 sm:gap-3 mb-4 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              </div>
            )}
            <div
              className={`text-xs sm:text-[13px] rounded-2xl p-3 sm:p-4 shadow-sm max-w-[80%] leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#4F46E5] text-white rounded-tr-none"
                  : "bg-white border border-gray-200 rounded-tl-none text-gray-800"
              }`}
            >
              {msg.role === "assistant" ? renderMarkdown(msg.text) : msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 sm:gap-3 mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 sm:p-4 shadow-sm">
              <Loader2 className="w-4 h-4 text-[#4F46E5] animate-spin" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={loading}
              className="w-full border border-gray-200 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] disabled:opacity-50"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 transition-colors shrink-0 disabled:opacity-30"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
