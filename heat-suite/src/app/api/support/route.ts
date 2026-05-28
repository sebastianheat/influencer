import { type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { SUPPORT_SYSTEM_PROMPT } from "@/lib/support-system-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

type SupportMessage = { role: "user" | "assistant"; content: string };

function isValidMessage(m: unknown): m is SupportMessage {
  if (!m || typeof m !== "object") return false;
  const obj = m as Record<string, unknown>;
  return (
    (obj.role === "user" || obj.role === "assistant") &&
    typeof obj.content === "string" &&
    obj.content.length > 0
  );
}

export async function POST(req: NextRequest) {
  if (!client) {
    return Response.json(
      { error: "AI support not configured (missing ANTHROPIC_API_KEY)" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const messagesIn = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messagesIn) || messagesIn.length === 0) {
    return Response.json({ error: "messages required" }, { status: 400 });
  }
  if (messagesIn.length > 40) {
    return Response.json({ error: "conversation too long" }, { status: 400 });
  }
  if (!messagesIn.every(isValidMessage)) {
    return Response.json({ error: "invalid message shape" }, { status: 400 });
  }
  const messages = messagesIn.map((m) => ({
    role: m.role,
    content: m.content.slice(0, 4000),
  }));

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model: "claude-haiku-4-5",
          max_tokens: 1024,
          system: SUPPORT_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
          messages,
        });

        claudeStream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        await claudeStream.finalMessage();
        controller.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("Support stream error", msg);
        controller.enqueue(
          encoder.encode(
            "\n\n[Error: no pude conectarme con el asistente. Probá de nuevo en un rato.]",
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
