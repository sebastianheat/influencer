"use client";

import { useState, useTransition } from "react";
import { submitContent } from "@/lib/odt-actions";

export function SubmitContentForm({ appId }: { appId: string }) {
  const [url, setUrl] = useState("");
  const [busy, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <p className="rounded-[8px] bg-success-bg px-3 py-2 text-xs font-semibold text-success">
        ✓ Contenido enviado. La marca lo está revisando.
      </p>
    );
  }

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setError(null);
        startTransition(async () => {
          const r = await submitContent(appId, url);
          if (r?.ok) setDone(true);
          else setError(r?.error ?? "error");
        });
      }}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <input
        type="url"
        required
        placeholder="https://instagram.com/p/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="h-9 flex-1 rounded-[8px] border border-line bg-surface px-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
      />
      <button
        type="submit"
        disabled={busy || !url}
        className="h-9 rounded-[8px] bg-ink px-4 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40"
      >
        {busy ? "Enviando…" : "Entregar contenido"}
      </button>
      {error && <span className="text-xs text-danger">⚠ {error}</span>}
    </form>
  );
}
