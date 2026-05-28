"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content:
    "¡Hola! Soy Lab, el asistente de Heat Suite. Te puedo ayudar con campañas, pagos, integraciones (Stripe, Instagram, TikTok) o cualquier duda de la plataforma. ¿En qué te ayudo?",
};

export function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");

    const next: Msg[] = [
      ...msgs,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ];
    setMsgs(next);
    setBusy(true);

    try {
      const conversation = next
        .slice(0, -1)
        .filter((m) => m !== WELCOME)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation }),
      });

      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(err?.error ?? "error");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      setMsgs((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            msg === "AI support not configured (missing ANTHROPIC_API_KEY)"
              ? "El soporte AI todavía no está configurado en este entorno. Escribime a hola@heat-suite.com mientras tanto."
              : "Hubo un error al conectarme. Probá de nuevo o escribime a hola@heat-suite.com.",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar soporte" : "Abrir soporte"}
        className={cn(
          "fixed z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-[var(--shadow-accent)] transition-transform hover:scale-105",
          "bottom-20 right-4 lg:bottom-6 lg:right-6",
          open ? "bg-ink text-white" : "heat-gradient-blue text-white",
        )}
      >
        {open ? "×" : "💬"}
      </button>

      {/* Panel */}
      {open && (
        <div
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden rounded-[16px] border border-line bg-surface shadow-[var(--shadow-card)]",
            "bottom-36 right-4 left-4 max-h-[70vh] lg:bottom-24 lg:left-auto lg:right-6 lg:w-[380px]",
          )}
        >
          <header className="heat-gradient-blue px-4 py-3 text-white">
            <p className="text-sm font-bold">Lab · Soporte Heat Suite</p>
            <p className="text-xs text-white/80">
              Asistente IA · respuesta en segundos
            </p>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-2 overflow-y-auto bg-page px-3 py-3"
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-[12px] px-3 py-2 text-sm",
                    m.role === "user"
                      ? "bg-accent text-white"
                      : "bg-surface text-ink ring-1 ring-line",
                  )}
                >
                  {m.content ? (
                    <p className="whitespace-pre-wrap break-words">
                      {m.content}
                    </p>
                  ) : (
                    <span className="inline-flex gap-1">
                      <Dot />
                      <Dot delay={150} />
                      <Dot delay={300} />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
            className="flex gap-2 border-t border-line bg-surface p-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hacé una pregunta…"
              maxLength={2000}
              disabled={busy}
              className="h-9 flex-1 rounded-[8px] border border-line bg-soft px-3 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="h-9 rounded-[8px] bg-ink px-3.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40"
            >
              {busy ? "…" : "Enviar"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-dim"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
