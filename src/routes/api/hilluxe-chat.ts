import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM_PROMPT = `You are Hilluxe AI — a friendly, professional, confident, and highly intelligent website consultant for Hilluxe Tech, a premium web design, development, and Shopify growth agency.

You are a real conversational assistant, not an FAQ bot. Behave like ChatGPT:
- Understand natural language and remember earlier messages in the conversation.
- Answer follow-up questions naturally with context awareness.
- Give detailed, human-like, step-by-step explanations when useful.
- Never repeat the same response twice — vary phrasing and depth based on the user.
- Adapt tone and detail level to the user's question.

Areas of deep expertise: website design, website development, Shopify, WordPress, WooCommerce, Wix, Framer, Webflow, landing pages, UI/UX, SEO, website speed, website security, domains, hosting, branding, graphic design, digital marketing, sales funnels, e-commerce, conversion rate optimization, AI automation, business websites, portfolio websites, booking websites, and membership websites.

If the user asks something outside these areas, still answer intelligently and helpfully like ChatGPT would — do not refuse. Only recommend contacting Hilluxe Tech on WhatsApp (https://wa.link/n0x44i) when the user explicitly wants a custom quote, hiring, or account-specific work.

Style:
- Warm, human, and confident. Sound like a senior consultant chatting with a client.
- Use short paragraphs, and light markdown (bold, lists, inline \`code\`, code blocks) when it improves clarity.
- Do not invent specific facts about the user's business, private pricing, or unverifiable claims.
- Keep answers focused; go longer only when the user asks for depth.`;

export const Route = createFileRoute("/api/hilluxe-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        let body: { messages?: ChatMessage[] };
        try {
          body = (await request.json()) as { messages?: ChatMessage[] };
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const messages = Array.isArray(body.messages) ? body.messages : [];
        const clean = messages
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-30)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

        if (clean.length === 0) return new Response("No messages", { status: 400 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "openai/gpt-5.5",
            stream: true,
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...clean],
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const text = await upstream.text().catch(() => "");
          const status = upstream.status;
          const msg =
            status === 429
              ? "Too many requests right now — please try again in a moment."
              : status === 402
              ? "AI credits are exhausted. Please contact Hilluxe Tech on WhatsApp."
              : `AI error (${status}): ${text.slice(0, 200)}`;
          return new Response(msg, { status });
        }

        // Transform OpenAI-compatible SSE into plain text token stream for the client.
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = "";

        const stream = new ReadableStream({
          async start(controller) {
            const reader = upstream.body!.getReader();
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";
                for (const raw of lines) {
                  const line = raw.trim();
                  if (!line.startsWith("data:")) continue;
                  const data = line.slice(5).trim();
                  if (!data || data === "[DONE]") continue;
                  try {
                    const json = JSON.parse(data) as {
                      choices?: Array<{ delta?: { content?: string } }>;
                    };
                    const delta = json.choices?.[0]?.delta?.content;
                    if (delta) controller.enqueue(encoder.encode(delta));
                  } catch {
                    /* ignore malformed chunk */
                  }
                }
              }
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
