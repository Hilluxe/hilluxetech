import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithHilluxeAi } from "@/lib/ai-chat.functions";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How much does a website cost?",
  "Which website is best for my business?",
  "How long does it take to build a website?",
  "Can you redesign my existing website?",
  "How can I rank my website on Google?",
];

export function AIChat() {
  const send = useServerFn(chatWithHilluxeAi);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await send({ data: { messages: nextMessages } });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit(input);
    }
  }

  return (
    <section id="ai-assistant" className="mx-auto max-w-5xl px-5 py-24 md:py-32">
      <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground">
        / 07 — AI WEBSITE ASSISTANT
      </p>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-4xl leading-tight md:text-6xl">
          Ask <span className="italic text-primary">Hilluxe AI.</span>
        </h2>
        <p className="max-w-md text-muted-foreground">
          A live consultant for websites, SEO, eCommerce, and everything in between.
          Trained on how we build and grow premium brands.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/[0.04]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/60 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-full bg-foreground font-display text-lg text-background">
              H
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg">Hilluxe AI</p>
              <p className="text-[11px] tracking-[0.15em] text-muted-foreground">
                WEBSITE EXPERT · ONLINE
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:bg-background hover:text-foreground"
            >
              New chat
            </button>
          )}
        </div>

        {/* Transcript */}
        <div
          ref={scrollRef}
          className="max-h-[520px] min-h-[360px] overflow-y-auto px-4 py-6 md:px-6"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center gap-6 py-6 text-center">
              <p className="max-w-md text-sm text-muted-foreground">
                Hi 👋 I'm Hilluxe AI. Ask me anything about websites, design,
                development, SEO or eCommerce — or pick a starter below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void submit(s)}
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition hover:border-primary hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && <TypingBubble />}
            {error && (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit(input);
          }}
          className="flex items-end gap-2 border-t border-border bg-background/60 px-3 py-3 md:px-4"
        >
          <label htmlFor="ai-chat-input" className="sr-only">
            Ask anything about websites
          </label>
          <textarea
            id="ai-chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask anything about websites..."
            className="max-h-40 flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send <span aria-hidden>↑</span>
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Hilluxe AI can make mistakes. For quotes and custom projects,{" "}
        <a href="https://wa.link/n0x44i" target="_blank" rel="noreferrer" className="underline hover:text-primary">
          message us on WhatsApp
        </a>
        .
      </p>
    </section>
  );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      {!isUser && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground font-display text-sm text-background">
          H
        </span>
      )}
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed md:max-w-[75%] ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-secondary text-foreground"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2 animate-in fade-in duration-300">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground font-display text-sm text-background">
        H
      </span>
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
        <span>Hilluxe is typing</span>
        <span className="flex gap-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </span>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/70"
      style={{ animationDelay: delay }}
    />
  );
}
