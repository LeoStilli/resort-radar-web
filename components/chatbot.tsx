"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Where has the best powder right now?",
  "Best resort for beginners?",
  "Compare Jackson Hole and Vail",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || streaming) return;

    const next: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setMessages([...next, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: full }]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setStreaming(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close advisor" : "Open resort advisor"}
        className="fixed bottom-6 right-6 z-50 group flex h-14 w-14 items-center justify-center rounded-full bg-navy shadow-lg shadow-navy/50 ring-1 ring-white/10 transition-all hover:scale-105 hover:shadow-xl"
      >
        {/* Live pulse dot */}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-navy" />
          </span>
        )}
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white/60 transition group-hover:text-white">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-gold">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[420px] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
          {/* Header */}
          <div className="relative flex items-center gap-3 overflow-hidden bg-navy px-5 py-4">
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent" />
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/15 ring-1 ring-gold/30">
              <svg viewBox="0 0 32 32" fill="none" className="h-5 w-5 text-gold">
                <path d="M16 3L4 27h24L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M10 20l6-7 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="relative">
              <p className="text-sm font-semibold text-white">Resort Advisor</p>
              <p className="text-xs text-white/40">AI · Live conditions</p>
            </div>
            <div className="relative ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/40">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="max-h-96 min-h-72 flex-1 space-y-4 overflow-y-auto p-4"
            style={{ background: "#080f1a" }}
          >
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="pt-3 text-center">
                  <p className="text-sm leading-relaxed text-white/35">
                    Ask about conditions, which resort fits your skill level, or where the best powder is right now.
                  </p>
                </div>
                <div className="space-y-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="w-full rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-left text-xs text-white/55 transition hover:border-gold/30 hover:bg-white/10 hover:text-white/90"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex items-end gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/15 ring-1 ring-gold/20">
                      <svg viewBox="0 0 32 32" fill="none" className="h-4 w-4 text-gold">
                        <path d="M16 3L4 27h24L16 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M10 20l6-7 6 7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-gold font-medium text-navy"
                        : "rounded-bl-sm bg-white/8 text-white/85"
                    }`}
                  >
                    {m.content || (
                      <span className="flex items-center gap-1.5 py-0.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:0ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40 [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{ background: "#080f1a" }} className="border-t border-white/8 px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 transition focus-within:border-gold/40 focus-within:bg-white/8">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask about conditions, resorts…"
                className="flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/25"
                disabled={streaming}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || streaming}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold text-navy transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-white/20">Powered by Groq · Llama 3.1</p>
          </div>
        </div>
      )}
    </>
  );
}
