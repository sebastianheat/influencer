"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui";
import { influencers } from "@/lib/data";
import { cn } from "@/lib/cn";

const convos = influencers.slice(0, 6).map((inf, i) => ({
  inf,
  last: [
    "¡Hola! Me encantaría participar en la campaña 😊",
    "Te envío la propuesta de contenido hoy.",
    "Perfecto, lo subo mañana a primera hora.",
    "¿Cuándo es la fecha límite de entrega?",
    "Gracias por la oportunidad 🙌",
    "Acabo de enviar el borrador del Reel.",
  ][i],
  time: ["09:12", "Ayer", "Ayer", "Lun", "Lun", "Dom"][i],
  unread: i < 2,
}));

const thread = [
  { me: false, text: "¡Hola! Me encantaría participar en la campaña 😊" },
  { me: true, text: "¡Hola! Genial, tu perfil encaja muy bien. ¿Tienes ideas?" },
  { me: false, text: "Sí, pensaba en un Reel cercano explicando lo fácil que es cotizar." },
  { me: true, text: "Me gusta. Te paso el brief y los entregables." },
  { me: false, text: "Perfecto, lo reviso y te confirmo tarifa hoy mismo." },
];

export default function Chat() {
  const [active, setActive] = useState(0);
  const current = convos[active];

  return (
    <div className="flex h-[calc(100vh-9rem)] overflow-hidden rounded-[16px] border border-line bg-surface shadow-[var(--shadow-soft)]">
      {/* List */}
      <div className="hidden w-72 flex-col border-r border-line sm:flex">
        <div className="border-b border-line p-4">
          <h1 className="font-extrabold text-ink">Chat</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convos.map((c, i) => (
            <button
              key={c.inf.id}
              onClick={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left transition-colors",
                i === active ? "bg-accent-soft" : "hover:bg-soft",
              )}
            >
              <Avatar name={c.inf.name} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-semibold text-ink">
                    {c.inf.name}
                  </p>
                  <span className="text-[11px] text-dim">{c.time}</span>
                </div>
                <p className="truncate text-xs text-soft-ink">{c.last}</p>
              </div>
              {c.unread && <span className="h-2 w-2 rounded-full bg-accent" />}
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-line p-4">
          <Avatar name={current.inf.name} size={40} />
          <div>
            <p className="text-sm font-bold text-ink">{current.inf.name}</p>
            <p className="text-xs text-dim">{current.inf.handle}</p>
          </div>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-soft p-5">
          {thread.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.me ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[75%] rounded-[14px] px-4 py-2.5 text-sm",
                  m.me
                    ? "heat-gradient-blue text-white"
                    : "border border-line bg-surface text-ink",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-line p-3">
          <input
            placeholder="Escribe un mensaje…"
            className="h-11 flex-1 rounded-[10px] border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
          <button className="heat-gradient-blue flex h-11 items-center rounded-[10px] px-5 text-sm font-semibold text-white">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
