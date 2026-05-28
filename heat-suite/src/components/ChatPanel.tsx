"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { markMessagesRead, sendMessage } from "@/lib/chat-actions";

type Msg = {
  id: string;
  body: string;
  createdAt: string;
  mine: boolean;
};

function timeShort(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatPanel({
  applicationId,
  peerName,
}: {
  applicationId: string;
  peerName: string;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, startTransition] = useTransition();
  const lastIso = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  const fetchMessages = useCallback(
    async (incremental: boolean) => {
      const qs = incremental && lastIso.current ? `?since=${encodeURIComponent(lastIso.current)}` : "";
      const r = await fetch(`/api/chat/${applicationId}${qs}`);
      if (!r.ok) return;
      const data = (await r.json()) as { messages: Msg[] };
      if (!data.messages.length) return;
      setMsgs((prev) => (incremental ? [...prev, ...data.messages] : data.messages));
      lastIso.current = data.messages[data.messages.length - 1].createdAt;
      scrollBottom();
    },
    [applicationId, scrollBottom],
  );

  useEffect(() => {
    void fetchMessages(false);
    void markMessagesRead(applicationId);
    const t = setInterval(() => {
      void fetchMessages(true);
    }, 5000);
    return () => clearInterval(t);
  }, [applicationId, fetchMessages]);

  const send = () => {
    const body = input.trim();
    if (!body) return;
    setInput("");
    startTransition(async () => {
      const r = await sendMessage(applicationId, body);
      if (r?.ok) {
        // optimistic: refrescamos para ver el mensaje nuestro y de otros.
        await fetchMessages(true);
      }
    });
  };

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[400px] flex-col overflow-hidden rounded-[14px] border border-line bg-surface shadow-[var(--shadow-soft)]">
      <header className="border-b border-line bg-soft px-4 py-3">
        <p className="text-sm font-bold text-ink">{peerName}</p>
        <p className="text-xs text-dim">Conversación de la ODT</p>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-page px-4 py-4"
      >
        {msgs.length === 0 ? (
          <p className="mt-10 text-center text-sm text-dim">
            Aún no hay mensajes. Escribí el primero abajo.
          </p>
        ) : (
          <div className="space-y-2">
            {msgs.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-[14px] px-3.5 py-2 text-sm",
                    m.mine
                      ? "bg-accent text-white"
                      : "bg-surface text-ink ring-1 ring-line",
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <p
                    className={cn(
                      "mt-1 text-[10px]",
                      m.mine ? "text-white/70" : "text-dim",
                    )}
                  >
                    {timeShort(m.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex gap-2 border-t border-line bg-surface p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí un mensaje…"
          maxLength={2000}
          className="h-10 flex-1 rounded-[10px] border border-line bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="h-10 rounded-[10px] bg-ink px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
        >
          {sending ? "…" : "Enviar"}
        </button>
      </form>
    </div>
  );
}
