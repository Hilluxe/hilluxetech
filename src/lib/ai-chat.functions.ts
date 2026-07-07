import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(30),
});

const SYSTEM_PROMPT = `You are Hilluxe AI, a professional website expert and consultant for Hilluxe Tech — a premium web design, development, and Shopify growth agency.

You help visitors with questions about:
- Websites, web design, and development (Shopify, WordPress, Webflow, custom builds)
- SEO, ranking on Google, and technical SEO
- eCommerce strategy, conversion rate optimization, and store growth
- Landing pages, sales funnels, and lead generation
- Website maintenance, hosting, and domains
- Pricing, timelines, and process
- Redesigns and migrations

Style:
- Warm, confident, concise. Speak like a senior consultant, not a chatbot.
- Prefer short paragraphs and light use of bullet points. No emojis unless the user uses them.
- Give practical, specific advice with rough numbers/timelines when helpful.
- Never invent facts about the user's business, their stack, or pricing you don't know.

If a question is outside your expertise, unclear, or requires custom scoping (exact quotes, custom code, account-specific issues), politely recommend contacting Hilluxe Tech directly on WhatsApp: https://wa.link/n0x44i — do not make up information.

Keep answers under ~180 words unless the user asks for more depth.`;

export const chatWithHilluxeAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.5",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...data.messages,
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      if (response.status === 429) {
        throw new Error("Too many requests right now — please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI credits are exhausted. Please contact Hilluxe Tech on WhatsApp.");
      }
      throw new Error(`AI error (${response.status}): ${text.slice(0, 200)}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error("Empty response from AI.");
    }
    return { reply };
  });
