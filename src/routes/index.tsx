import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import profileImg from "../assets/profile.jpg";
import { AIChat } from "@/components/AIChat";

const FAQ_ITEMS: Array<[string, string]> = [
  ["How quickly can you start working on my store?", "Most engagements start within 3–5 business days after our discovery call and onboarding."],
  ["What makes your approach different?", "I combine conversion engineering, paid media, and retention into one connected system — instead of selling them as silos."],
  ["Do you work with new stores or only established ones?", "Both. I have foundation-stage packages for new stores and growth retainers for established brands doing $10K+/mo."],
  ["What's your typical timeline for seeing results?", "Most clients see meaningful lift within 30–60 days; compounding results show by month 3."],
  ["Do you offer ongoing support or one-time projects?", "Both options are available. Most founders start with a project and upgrade to a monthly retainer."],
  ["What platforms and tools do you specialize in?", "Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, GA4, and the standard CRO toolkit."],
  ["How do you communicate during projects?", "Weekly async updates + a bi-weekly call. WhatsApp & Slack for quick decisions."],
  ["What information do you need to get started?", "Store access, current ad accounts, analytics, and a quick brief on goals & constraints."],
];

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map(([q, a]) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
          })),
        }),
      },
    ],
  }),
});


function useCountUp(target: number, duration = 1800, decimals = 0) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();
  return { ref, formatted };
}

function StatCard({ target, prefix, suffix, decimals, label }: {
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}) {
  const { ref, formatted } = useCountUp(target, 1800, decimals);
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/[0.07]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <p ref={ref} className="font-display text-5xl leading-none tracking-tight text-foreground md:text-[3.25rem]">
        {prefix}{formatted}{suffix}
      </p>
      <p className="mt-3 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}


const NAV = [
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "results", label: "Results" },
  { id: "services", label: "Services" },
  { id: "reviews", label: "Reviews" },
  { id: "ai-assistant", label: "AI Assistant" },
  { id: "faq", label: "FAQ" },
];

const WHATSAPP = "https://wa.link/n0x44i";
const FACEBOOK = "https://www.facebook.com/profile.php?id=61583751440599";
const INSTAGRAM = "https://www.instagram.com/hilluxetech?igsh=N3dlZWMyZng2bGVl";

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScrolled(h.scrollTop > 24);
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      {/* scroll progress */}
      <div
        className="fixed left-0 top-0 z-[60] h-0.5 bg-primary transition-[width]"
        style={{ width: `${progress}%` }}
      />

      {/* NAV */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled ? "backdrop-blur-md bg-background/80 border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card font-display text-xl text-primary">
              H
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg">Hilluxe Tech</span>
              <span className="block text-[10px] tracking-[0.2em] text-muted-foreground">
                SHOPIFY GROWTH
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 rounded-full border border-border bg-card/60 px-2 py-1.5 backdrop-blur md:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href="#audit"
            className="hidden items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 md:inline-flex"
          >
            Free Audit <span aria-hidden>↗</span>
          </a>
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
          >
            <span className="text-lg">{menuOpen ? "×" : "≡"}</span>
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
                >
                  {n.label}
                </a>
              ))}
              <a
                href="#audit"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-center text-sm text-background"
              >
                Get Free Audit
              </a>
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <Process />
        <Results />
        <Services />
        
        <Reviews />
        <Audit />
        <AIChat />
        <FAQ />
        <Footer />
      </main>

      {/* floating WhatsApp */}
      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-accent-foreground shadow-lg shadow-accent/20 transition hover:translate-y-[-2px]"
      >
        <span aria-hidden>💬</span> Chat with me
      </a>

      <LeadPopup />
    </div>
  );
}

/* ───────────────────────────  LEAD POPUP  ─────────────────────────── */
function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("hilluxe_lead_popup_shown")) return;
    const t = window.setTimeout(() => {
      sessionStorage.setItem("hilluxe_lead_popup_shown", "1");
      setOpen(true);
    }, 60000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const company = String(fd.get("company") || "").trim();
    const msg =
      `Hi Hilluxe Tech! I'd like to claim my Free Strategy Session.%0A%0A` +
      `Name: ${encodeURIComponent(name)}%0A` +
      `Email: ${encodeURIComponent(email)}%0A` +
      `Business: ${encodeURIComponent(company || "—")}`;
    window.open(`${WHATSAPP}?text=${msg}`, "_blank", "noopener,noreferrer");
    setSubmitting(false);
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.18_0.02_60)]/90 p-7 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300"
        style={{
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.6), 0 0 60px -10px rgba(99,102,241,0.35), 0 0 80px -20px rgba(168,85,247,0.25)",
        }}
      >
        {/* glow accents */}
        <div className="pointer-events-none absolute -top-20 -left-16 h-48 w-48 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-purple-500/30 blur-3xl" />

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          ×
        </button>

        <div className="relative">
          <h3
            id="lead-popup-title"
            className="font-display text-3xl leading-tight text-white"
          >
            🚀 Wait! Before You Leave
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            Get a <span className="text-white font-medium">FREE Website & AI Automation Strategy Session</span> and discover how we can help you grow your business with a high-converting website, AI automation, and digital solutions.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <input
              required
              name="name"
              type="text"
              maxLength={100}
              placeholder="Full Name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              required
              name="email"
              type="email"
              maxLength={255}
              placeholder="Email Address"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <input
              name="company"
              type="text"
              maxLength={120}
              placeholder="Business / Company Name (optional)"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:-translate-y-0.5 hover:shadow-purple-500/50 disabled:opacity-60"
            >
              Claim My Free Strategy Session
            </button>
            <p className="text-center text-xs text-white/50">
              No spam. Your information is kept private.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────  HERO  ────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pt-40">
      <div className="absolute inset-0 grid-paper opacity-60" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background to-transparent" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5">
        {/* badges row */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent text-xs font-medium text-primary-foreground"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 text-primary">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
                <span className="ml-2 text-sm font-medium text-foreground">5.0</span>
              </div>
              <p className="text-xs text-muted-foreground">600+ happy founders</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs tracking-[0.2em] text-muted-foreground">
            <span>SHOPIFY PARTNER</span>
            <span className="text-primary">•</span>
            <span>GOOGLE ADS CERTIFIED</span>
            <span className="text-primary">•</span>
            <span>TOP RATED · FIVERR</span>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground">
              [ SHOPIFY GROWTH PARTNER — EST. 2019 ]
            </p>
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-[6.5rem]">
              I help e-com <span className="text-muted-foreground">brands</span>{" "}
              <span className="relative inline-block text-primary">
                3×
                <span className="absolute -bottom-2 left-0 h-1 w-full bg-primary/30" />
              </span>{" "}
              their sales in{" "}
              <em className="not-italic underline decoration-primary decoration-[3px] underline-offset-[10px]">
                60 days.
              </em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              High-converting funnels, data-driven ads, and proven email automation —
              engineered to turn struggling Shopify stores into profit machines.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                Book Free Strategy Call
                <span className="transition group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="#results"
                className="inline-flex items-center gap-3 text-sm font-medium text-foreground"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card transition hover:bg-secondary">
                  →
                </span>
                See real results
              </a>
            </div>

            <div className="mt-12">
              <p className="mb-3 text-[10px] tracking-[0.25em] text-muted-foreground">
                OR HIRE ME INSTANTLY ON
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Instagram", href: INSTAGRAM },
                  { label: "Facebook", href: FACEBOOK },
                  { label: "WhatsApp", href: WHATSAPP },
                ].map((p) => (
                  <a
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:bg-secondary"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* profile card */}
          <aside className="relative rounded-3xl border border-border bg-card/70 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <img
                src={profileImg}
                alt="Hilluxe Tech — Shopify Growth Expert"
                width={96}
                height={96}
                className="h-20 w-20 rounded-2xl object-cover ring-1 ring-border"
              />
              <div>
                <p className="font-display text-2xl">Hilluxe Tech</p>
                <p className="text-sm text-primary">Shopify Growth Expert</p>
              </div>
            </div>
            <div className="mt-6 divide-y divide-border">
              {[
                ["Revenue generated", "$15M+"],
                ["Stores scaled", "200+"],
                ["Avg. ROAS", "4.8×"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">{k}</span>
                  <span className="font-display text-2xl">{v}</span>
                </div>
              ))}
            </div>
            <a
              href="#about"
              className="mt-2 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm font-medium transition hover:bg-muted"
            >
              MORE ABOUT ME <span>→</span>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────  MARQUEE / TRUST  ────────────────────── */
const TOP_ROW = ["React", "Next.js", "Tailwind CSS", "Shopify", "Meta Ads", "Google Ads", "Klaviyo", "GA4", "Framer", "Webflow"];
const BOTTOM_ROW = ["OpenAI", "Claude", "Gemini", "AI Automation", "Vibe Coding", "Website Development", "Sales Funnels", "Email Marketing", "Conversion Rate Optimization", "E-commerce Growth"];

function MarqueeRow({ items, direction = "left" }: { items: string[]; direction?: "left" | "right" }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />
      <div
        className="flex w-max gap-4 py-3"
        style={{ animation: `marquee-${direction} 45s linear infinite` }}
      >
        {loop.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="group/badge relative inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
            style={{
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 6px 24px -12px rgba(99,102,241,0.45), 0 6px 24px -12px rgba(168,85,247,0.35)",
            }}
          >
            <span className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-purple-500/0 opacity-0 blur-md transition-opacity duration-300 group-hover/badge:opacity-100" />
            <span className="relative whitespace-nowrap">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-secondary/40 py-10">
      <div className="mx-auto max-w-7xl px-5">
        <p className="mb-6 text-center text-[10px] tracking-[0.3em] text-muted-foreground">
          TRUSTED PARTNERS & PLATFORMS
        </p>
        <div className="space-y-3">
          <MarqueeRow items={TOP_ROW} direction="left" />
          <MarqueeRow items={BOTTOM_ROW} direction="right" />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────  ABOUT  ───────────────────────────── */
function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground">/ 01 — ABOUT</p>
        <h2 className="max-w-4xl font-display text-4xl leading-tight md:text-6xl">
          Strategy-led growth for ambitious{" "}
          <span className="italic text-primary">e-commerce founders.</span>
        </h2>

        {/* Stats — credibility first */}
        <div className="mt-14 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          <StatCard target={15} prefix="$" suffix="M+" label="Revenue Generated" />
          <StatCard target={200} suffix="+" label="Stores Built" />
          <StatCard target={5.0} decimals={1} label="Star Rating" />
          <StatCard target={600} suffix="+" label="Happy Clients" />
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:items-start">
          <div className="relative">
            <img
              src={profileImg}
              alt="Hilluxe Tech — Shopify Expert"
              width={720}
              height={900}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-3xl object-cover"
            />
            <div className="absolute -bottom-6 -right-6 hidden max-w-xs rounded-2xl border border-border bg-card p-5 shadow-sm md:block">
              <p className="font-display text-xl italic leading-snug">
                "Profit is engineered, not wished for."
              </p>
              <p className="mt-2 text-xs tracking-[0.2em] text-muted-foreground">— MY APPROACH</p>
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              With over five years scaling Shopify brands, I've helped 200+ store owners turn
              struggling catalogs into 6 & 7-figure businesses. My process is engineered around
              three things: <span className="text-foreground">conversion, retention, and sustainable scale.</span>
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Top Rated Seller on Fiverr & Upwork",
                "Certified Google Ads Partner",
                "Shopify Partner Expert",
                "5+ years of e-commerce experience",
                "Specialized in Multi-Market & International Conversion Rate Optimization (CRO) across Europe and the US",
              ].map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-primary">
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <a
              href="#services"
              className="mt-10 inline-flex items-center gap-2 text-sm font-medium underline decoration-primary underline-offset-4"
            >
              Explore my services →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────  PROCESS  ──────────────────────────── */
function Process() {
  const steps = [
    {
      n: "01",
      tag: "Foundation",
      title: "Pre-Marketing",
      body: "Strategic foundation building precedes every campaign. Brand identity, store optimization, and conversion architecture — so your store is ready to convert from day one.",
    },
    {
      n: "02",
      tag: "Momentum",
      title: "Launch & Scale",
      body: "Targeted campaigns across Meta, Google, and TikTok. Creative, content, and ad management built to attract, engage, and convert at scale.",
    },
    {
      n: "03",
      tag: "Compounding",
      title: "Optimize & Retain",
      body: "Continuous optimization compounds results. I analyze, refine, and operate your store like a virtual growth partner — retention flows, offers, and follow-ups that bring customers back.",
    },
  ];
  return (
    <section id="process" className="bg-foreground py-24 text-background md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <p className="mb-6 text-xs tracking-[0.25em] text-background/80">/ 02 — PROCESS</p>
        <h2 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">
          A three-phase system that{" "}
          <span className="italic text-primary">just works.</span>
        </h2>
        <p className="mt-6 max-w-xl text-background/85">
          Tested across 200+ Shopify brands. Repeatable. Measurable. Profitable.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group relative overflow-hidden rounded-3xl border border-background/10 bg-background/5 p-8 backdrop-blur transition hover:bg-background/10"
            >
              <p className="font-display text-6xl text-primary">{s.n}</p>
              <p className="mt-6 text-xs tracking-[0.25em] text-background/80">{s.tag}</p>
              <h3 className="mt-2 font-display text-3xl">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-background/85">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────  RESULTS  ─────────────────────────── */
function Results() {
  const cases: Array<{
    tag: string;
    title: string;
    stats: string[][];
    note: string;
  }> = [
    {
      tag: "3 Months",
      title: "Fashion & Apparel",
      stats: [
        ["$180K", "Revenue", "+350%"],
        ["4.8×", "ROAS", "+220%"],
        ["2,400+", "Orders", "+380%"],
      ],
      note: "Turned a struggling boutique into a 6-figure brand through strategic Meta ads.",
    },
    {
      tag: "4 Months",
      title: "Electronics Store",
      stats: [
        ["$320K", "Revenue", "+420%"],
        ["4.2%", "Conversion", "+180%"],
        ["$145", "AOV", "+95%"],
      ],
      note: "Scaled from $5K to $80K/month using Google Shopping & Search campaigns.",
    },
    {
      tag: "6 Months",
      title: "Home & Living",
      stats: [
        ["$450K", "Revenue", "+520%"],
        ["35%", "Email Revenue", "+280%"],
        ["15K+", "Subscribers", "+450%"],
      ],
      note: "Built an automated email system that drives 35% of total revenue via Klaviyo.",
    },
    {
      tag: "2 Months",
      title: "Beauty & Cosmetics",
      stats: [
        ["$95K", "Revenue", "+280%"],
        ["18%", "Cart Recovery", "+340%"],
        ["$280", "LTV", "+150%"],
      ],
      note: "Launched a new product line with conversion-focused funnels & retargeting.",
    },
  ];

  return (
    <section id="results" className="mx-auto max-w-7xl px-5 py-24 md:py-32">
      <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground">/ 03 — RESULTS</p>
      <h2 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">
        Real numbers from <span className="italic text-primary">real clients.</span>
      </h2>
      <p className="mt-6 max-w-xl text-muted-foreground">
        Selected case studies across niches. Same playbook, repeatable outcomes.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <article
            key={c.title}
            className="group rounded-3xl border border-border bg-card p-8 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs">
                {c.tag}
              </span>
              <span className="text-xs text-muted-foreground">Case study</span>
            </div>
            <h3 className="mt-6 font-display text-3xl">{c.title}</h3>
            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-border py-6">
              {c.stats.map(([v, l, d]) => (
                <div key={l}>
                  <p className="font-display text-3xl">{v}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l}</p>
                  <p className="text-xs font-medium text-primary">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
            <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline decoration-primary/40 underline-offset-4">
              Coming soon →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────  SERVICES  ─────────────────────────── */
function Services() {
  const services = [
    ["Shopify Marketing", "End-to-end marketing strategy & execution to grow your store with proven frameworks.", "$150"],
    ["Sales Funnel Design", "Conversion-engineered funnels — landing pages, upsells, and checkout flows optimized for AOV.", "$200"],
    ["Google & Meta Ads", "Profitable PPC — Google Search, Shopping, Meta retargeting, and creative testing.", "$250"],
    ["Klaviyo Email Automation", "Automated flows that recover carts, win back lapsed customers, and drive repeat revenue.", "$100"],
    ["Product Research", "Find winning products with data-backed research — demand, margin, and competitive analysis.", "$80"],
    ["End-to-End Store Development & Architecture", "Full-stack Shopify store building, custom architecture, supplier vetting, and seamless international logistics setups.", "$450"],
    ["Analytics & CRO", "Heatmaps, A/B tests, and funnel diagnostics to compound your conversion rate.", "$180"],
    ["Google Merchant Center & Ad Account Recovery", "Is your GMC suspended or are your Google Ads restricted? I audit and fix policy violations like Misrepresentation and Unacceptable Business Practices to get your products back online safely.", "$190"],
    ["SEO & Content", "Technical SEO, blog content, and product page optimization for compounding traffic.", "$120"],
  ];
  return (
    <section id="services" className="bg-secondary/50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground">/ 04 — SERVICES</p>
        <h2 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">
          Everything your store needs to{" "}
          <span className="italic text-primary">scale.</span>
        </h2>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Pick a service or get the full growth retainer. Every engagement is custom-fit.
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {services.map(([title, desc, price]) => (
            <a
              key={title}
              href="#audit"
              className="group flex flex-col gap-4 bg-card p-6 transition hover:bg-background"
            >
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="flex-1 text-sm text-muted-foreground">{desc}</p>
              <div className="flex items-end justify-between border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-display text-3xl text-primary">{price}</p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background transition group-hover:rotate-[-45deg]">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────  REVIEWS  ──────────────────────────── */
function Reviews() {
  const reviews = [
    {
      quote:
        "Hilluxe Tech transformed my struggling store into a profit machine. Within 3 months, revenue increased by 250%. His marketing strategies are simply incredible.",
      name: "Sarah Johnson",
      role: "Fashion E-commerce Owner",
    },
    {
      quote:
        "His product research helped me find 3 winning products that generated over $100K in sales. Highly recommend.",
      name: "Michael Chen",
      role: "Dropshipping Entrepreneur",
    },
    {
      quote:
        "His Google Ads campaigns brought quality traffic that actually converts. ROAS went from 1.5× to 4.2× in 2 months.",
      name: "Emily Rodriguez",
      role: "Beauty Brand Founder",
    },
    {
      quote:
        "The Klaviyo automation Hilluxe Tech set up recovers so many abandoned carts. We now have consistent daily sales.",
      name: "David Thompson",
      role: "Home Decor Store Owner",
    },
    {
      quote:
        "The sales funnel he created is converting at 12%. Professional, responsive, and results-driven.",
      name: "Lisa Anderson",
      role: "Fitness Products Brand",
    },
    {
      quote:
        "His comprehensive approach helped me scale from $5K to $50K monthly. Worth every penny.",
      name: "James Wilson",
      role: "Electronics Store Owner",
    },
  ];
  return (
    <section id="reviews" className="mx-auto max-w-7xl px-5 py-24 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground">/ 05 — REVIEWS</p>
          <h2 className="max-w-3xl font-display text-4xl leading-tight md:text-6xl">
            Words from <span className="italic text-primary">happy founders.</span>
          </h2>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <span className="font-display text-3xl text-primary">5.0</span>
            <div className="text-primary">★★★★★</div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Based on 600+ verified reviews on Fiverr & Upwork
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <figure
            key={r.name}
            className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-7"
          >
            <div className="text-primary">★★★★★</div>
            <blockquote className="font-display text-xl leading-snug">"{r.quote}"</blockquote>
            <figcaption className="mt-auto flex items-center gap-3 border-t border-border pt-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-medium text-primary-foreground">
                {r.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────  AUDIT  ────────────────────────────── */
function Audit() {
  return (
    <section
      id="audit"
      className="relative overflow-hidden bg-foreground py-24 text-background md:py-32"
    >
      <div className="absolute inset-0 grid-paper opacity-[0.08]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-6 text-xs tracking-[0.25em] text-background/80">FREE STORE AUDIT</p>
          <h2 className="font-display text-4xl leading-tight md:text-6xl">
            Get your <span className="italic text-primary">free store audit.</span>
          </h2>
          <p className="mt-6 max-w-lg text-background/85">
            I'll personally analyze your store and send a detailed audit report within 48
            hours — completely free.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              ["Complete Store Analysis", "In-depth review of design, UX, and conversion funnel"],
              ["Growth Opportunities", "Identify untapped revenue streams and optimization areas"],
              ["Quick Wins", "Actionable recommendations you can implement immediately"],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-4">
                <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  ✓
                </span>
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="text-sm text-background/80">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const msg =
              `Hi Hillux, I'd like a free store audit.\n\n` +
              `Store name: ${fd.get("store_name") || ""}\n` +
              `Store URL: ${fd.get("store_url") || ""}\n` +
              `Email: ${fd.get("email") || ""}\n` +
              `Monthly revenue: ${fd.get("revenue") || "—"}\n` +
              `Main challenge: ${fd.get("challenge") || "—"}`;
            window.open(
              `https://wa.link/n0x44i?text=${encodeURIComponent(msg)}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className="rounded-3xl border border-background/15 bg-background/5 p-8 backdrop-blur-md"
        >
          <p className="mb-6 font-display text-2xl">Tell me about your store</p>
          {[
            ["Store name", "store_name", "text", true],
            ["Store URL", "store_url", "url", true],
            ["Email address", "email", "email", true],
            ["Monthly revenue (optional)", "revenue", "text", false],
          ].map(([label, name, type, req]) => (
            <label key={name as string} className="mb-4 block">
              <span className="mb-1.5 block text-xs tracking-[0.15em] text-background/80">
                {(label as string).toUpperCase()} {req ? "*" : ""}
              </span>
              <input
                required={req as boolean}
                type={type as string}
                name={name as string}
                className="w-full rounded-xl border border-background/15 bg-background/10 px-4 py-3 text-sm text-background placeholder-background/40 outline-none ring-primary/40 transition focus:ring-2"
              />
            </label>
          ))}
          <label className="mb-6 block">
            <span className="mb-1.5 block text-xs tracking-[0.15em] text-background/80">
              MAIN CHALLENGE (OPTIONAL)
            </span>
            <textarea
              name="challenge"
              rows={3}
              className="w-full rounded-xl border border-background/15 bg-background/10 px-4 py-3 text-sm text-background placeholder-background/40 outline-none ring-primary/40 transition focus:ring-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Send on WhatsApp →
          </button>
          <p className="mt-3 text-center text-xs text-background/50">
            Sent directly to WhatsApp · Reply within 48 hours · 100% confidential
          </p>
        </form>
      </div>
    </section>
  );
}

/* ─────────────────────────────  FAQ  ──────────────────────────────── */
function FAQ() {
  const faqs = FAQ_ITEMS;

  return (
    <section id="faq" className="mx-auto max-w-5xl px-5 py-24 md:py-32">
      <p className="mb-6 text-xs tracking-[0.25em] text-muted-foreground">/ 06 — FAQ</p>
      <h2 className="font-display text-4xl leading-tight md:text-6xl">
        Common <span className="italic text-primary">questions.</span>
      </h2>
      <p className="mt-6 max-w-xl text-muted-foreground">
        Everything you need to know about working together.
      </p>

      <div className="mt-12 divide-y divide-border border-y border-border">
        {faqs.map(([q, a], i) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
              <span className="font-display text-xl md:text-2xl">{q}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-sm transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-border bg-secondary/60 p-10 text-center">
        <h3 className="font-display text-3xl md:text-4xl">Still have questions?</h3>
        <p className="mt-3 text-muted-foreground">
          Let's discuss your project and how I can help your business grow.
        </p>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Chat on WhatsApp →
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────────  FOOTER  ───────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">Hilluxe Tech</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Shopify Growth Partner · Est. 2019
          </p>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Helping ambitious e-commerce founders engineer profitable, repeatable growth
            on Shopify.
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs tracking-[0.2em] text-muted-foreground">EXPLORE</p>
          <ul className="space-y-2 text-sm">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="hover:text-primary">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs tracking-[0.2em] text-muted-foreground">CONNECT</p>
          <ul className="space-y-2 text-sm">
            <li><a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-primary">Instagram</a></li>
            <li><a href={FACEBOOK} target="_blank" rel="noreferrer" className="hover:text-primary">Facebook</a></li>
            <li><a href={WHATSAPP} target="_blank" rel="noreferrer" className="hover:text-primary">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Hilluxe Tech. All rights reserved.</p>
          <p>Built with care · Shopify Partner · Google Ads Certified</p>
        </div>
      </div>
    </footer>
  );
}
