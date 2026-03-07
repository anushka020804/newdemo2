import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, Paperclip, X, Loader2 } from "lucide-react";

const GEMINI_API_KEY = "AIzaSyAiMH_gsKkzAAi0-oSyQwwZ3hXk1KLXCDk";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

interface Message {
  role: "user" | "assistant";
  text: string;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hey! How can I help you?\nAsk me anything related to tenders, bids, or procurement." },
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
      const history = [...messages, userMsg].map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: history,
          systemInstruction: {
            parts: [{ text: "You are Opportunity X AI, an expert assistant for government tenders, bids, and procurement on the GeM (Government e-Marketplace) portal. Help users understand tender requirements, eligibility criteria, bid preparation, and compliance. Keep answers concise and helpful." }],
          },
        }),
      });

      if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err: any) {
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
    <>
      {/* Floating Icon Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#4F46E5] text-white shadow-lg hover:bg-[#4338CA] transition-colors flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[420px] bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#4F46E5] text-white px-4 py-3 font-semibold text-[14px] flex items-center justify-between">
              <span>Opportunity X AI</span>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 bg-white overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 mb-4 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                      <Bot className="w-4 h-4 text-[#4F46E5]" />
                    </div>
                  )}
                  <div
                    className={`text-[13px] rounded-2xl p-3 shadow-sm max-w-[80%] whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#4F46E5] text-white rounded-tr-none"
                        : "bg-gray-50 border border-gray-200 rounded-tl-none text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                    <Bot className="w-4 h-4 text-[#4F46E5]" />
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-sm">
                    <Loader2 className="w-4 h-4 text-[#4F46E5] animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    disabled={loading}
                    className="w-full border border-blue-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors shrink-0 disabled:opacity-30"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
