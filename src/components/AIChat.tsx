import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Send, Sparkles } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  ts: number;
};

const SUGGESTIONS = [
  "Build my business website",
  "How much does a website cost?",
  "Improve my SEO",
  "Create an online store",
  "Which platform should I use?",
  "Make my website faster",
  "Redesign my current website",
  "Generate website ideas",
];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [pending, setPending] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, pending, streaming]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setError(null);

    const userMsg: ChatMessage = { role: "user", content: trimmed, ts: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);
    setPending("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/hilluxe-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setPending(acc);
      }
      if (!acc.trim()) throw new Error("Empty response from AI.");
      setMessages((m) => [...m, { role: "assistant", content: acc, ts: Date.now() }]);
      setPending("");
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setPending("");
    } finally {
      setStreaming(false);
      abortRef.current = null;
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit(input);
    }
  }

  const isEmpty = messages.length === 0 && !streaming && !pending;

  return (
    <section id="ai-assistant" className="mx-auto max-w-5xl px-5 py-24 md:py-32">
      <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground">
        / 07 — AI WEBSITE ASSISTANT
      </p>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-4xl leading-tight md:text-6xl">
          Chat with <span className="italic text-primary">Hilluxe AI.</span>
        </h2>
        <p className="max-w-md text-muted-foreground">
          A real conversational assistant for websites, SEO, eCommerce and
          growth — powered by AI, tuned by Hilluxe Tech.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/[0.06]">
        {/* HILLUXE AI header (replaces SKILL MOST INTERESTED IN) */}
        <div className="border-b border-border bg-secondary/40 px-5 py-5 md:px-7 md:py-6">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground">
            HILLUXE AI
          </p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-foreground text-background">
                <Sparkles className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div className="leading-tight">
                <p className="font-display text-xl">Hilluxe AI</p>
                <p className="text-[11px] tracking-[0.15em] text-muted-foreground">
                  WEBSITE CONSULTANT
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Online
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Your intelligent website consultant powered by AI.
          </p>
        </div>

        {/* HILLUXE IS TYPING... conversation area (replaces WHY DO YOU WANT TO JOIN) */}
        <div className="border-b border-border px-5 pt-5 md:px-7">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground">
            {streaming ? "HILLUXE IS TYPING..." : "CONVERSATION"}
          </p>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[560px] min-h-[380px] overflow-y-auto px-4 py-6 md:px-7"
          role="log"
          aria-live="polite"
        >
          {isEmpty && (
            <div className="flex flex-col items-center gap-6 py-6 text-center">
              <p className="max-w-md text-sm text-muted-foreground">
                Hi 👋 I'm Hilluxe AI. Ask me anything about websites, design,
                development, SEO, eCommerce or growth — or start with a suggestion below.
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

          <div className="space-y-5">
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} ts={m.ts} />
            ))}
            {streaming && pending && (
              <MessageBubble role="assistant" content={pending} ts={Date.now()} streaming />
            )}
            {streaming && !pending && <TypingBubble />}
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
            Ask Hilluxe AI anything about websites
          </label>
          <textarea
            id="ai-chat-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Ask Hilluxe AI anything about websites..."
            className="max-h-52 flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={streaming}
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            aria-label="Send message"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Hilluxe AI can make mistakes. For quotes and custom projects,{" "}
        <a
          href="https://wa.link/n0x44i"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-primary"
        >
          message us on WhatsApp
        </a>
        .
      </p>
    </section>
  );
}

function MessageBubble({
  role,
  content,
  ts,
  streaming,
}: {
  role: "user" | "assistant";
  content: string;
  ts: number;
  streaming?: boolean;
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const time = useMemo(() => formatTime(ts), [ts]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-300`}
    >
      {!isUser && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-background">
          <Sparkles className="h-4 w-4" strokeWidth={1.5} />
        </span>
      )}
      <div className={`flex max-w-[85%] flex-col gap-1 md:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-secondary text-foreground"
          }`}
        >
          {isUser ? (
            content
          ) : (
            <div className="hilluxe-markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => (
                    <a {...props} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2" />
                  ),
                  code: ({ className, children, ...props }) => {
                    const isBlock = /language-/.test(className ?? "");
                    if (isBlock) {
                      return (
                        <pre className="my-2 overflow-x-auto rounded-lg bg-background/70 p-3 text-xs">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    }
                    return (
                      <code className="rounded bg-background/70 px-1 py-0.5 text-[0.85em]" {...props}>
                        {children}
                      </code>
                    );
                  },
                  ul: (props) => <ul className="my-2 list-disc space-y-1 pl-5" {...props} />,
                  ol: (props) => <ol className="my-2 list-decimal space-y-1 pl-5" {...props} />,
                  p: (props) => <p className="my-2 first:mt-0 last:mb-0" {...props} />,
                  h1: (props) => <h3 className="mt-3 mb-1 font-display text-lg" {...props} />,
                  h2: (props) => <h4 className="mt-3 mb-1 font-display text-base" {...props} />,
                  h3: (props) => <h5 className="mt-3 mb-1 font-display text-base" {...props} />,
                  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
              {streaming && (
                <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-foreground/60 align-middle" />
              )}
            </div>
          )}
        </div>
        <div className={`flex items-center gap-2 px-1 text-[10px] text-muted-foreground ${isUser ? "flex-row-reverse" : ""}`}>
          <span>{time}</span>
          {!isUser && !streaming && content && (
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1 rounded-full border border-transparent px-1.5 py-0.5 transition hover:border-border hover:text-foreground"
              aria-label="Copy message"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2 animate-in fade-in duration-300">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-background">
        <Sparkles className="h-4 w-4" strokeWidth={1.5} />
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
