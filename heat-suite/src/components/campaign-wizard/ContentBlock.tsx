"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

export type ContentType = "Reel" | "Story" | "Video de TikTok";

export function ContentBlock({
  type,
  onRemove,
}: {
  type: ContentType;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [review, setReview] = useState(false);
  const [mention, setMention] = useState(false);
  const [collab, setCollab] = useState(false);

  const Check = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-[var(--color-accent)]"
      />
      {label}
    </label>
  );

  const input =
    "h-11 w-full rounded-[10px] border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

  return (
    <div className="rounded-[12px] border border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left font-bold text-ink"
      >
        {type}
        <span className="text-dim">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="space-y-5 border-t border-line px-4 py-4">
          <div>
            <p className="text-sm font-bold text-ink">Sujeto a revisión</p>
            <div className="mt-2">
              <Check
                checked={review}
                onChange={() => setReview((r) => !r)}
                label="Quiero revisar el contenido antes de publicarlo"
              />
            </div>
            <p className="mb-1.5 mt-3 text-[13px] font-semibold text-ink">
              Fecha para revisión*
            </p>
            <input type="date" className={input} />
          </div>

          <div>
            <p className="text-sm font-bold text-ink">Subida de contenido</p>
            <p className="mb-1.5 mt-2 text-[13px] font-semibold text-ink">
              Fecha de subida*
            </p>
            <input type="date" className={input} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-ink">Menciones</p>
              <div className="mt-2">
                <Check
                  checked={mention}
                  onChange={() => setMention((m) => !m)}
                  label="Quiero que me mencionen"
                />
              </div>
              <p className="mb-1.5 mt-3 text-[13px] font-semibold text-ink">
                Ingresa el nombre de la cuenta
              </p>
              <input placeholder="@nombredeusuario" className={input} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Colaboraciones</p>
              <div className="mt-2">
                <Check
                  checked={collab}
                  onChange={() => setCollab((c) => !c)}
                  label="Subir de forma colaborativa"
                />
              </div>
              <p className="mb-1.5 mt-3 text-[13px] font-semibold text-ink">
                Ingresa el nombre de la cuenta
              </p>
              <input placeholder="@nombredeusuario" className={input} />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-ink">
              Escribe tu brief
            </p>
            <div className="overflow-hidden rounded-[10px] border border-line">
              <div className="flex items-center gap-3 border-b border-line bg-soft px-3 py-2 text-sm text-soft-ink">
                <span className="font-bold">B</span>
                <span className="italic">I</span>
                <span className="underline">U</span>
                <span className="ml-1 rounded border border-line bg-surface px-2 py-0.5 text-xs">
                  Tipo ▾
                </span>
                <span>☰</span>
                <span>⛓</span>
              </div>
              <textarea
                rows={3}
                placeholder="Brief del contenido"
                className="w-full p-3 text-sm text-ink placeholder:text-dim focus:outline-none"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-ink">Hashtags</p>
            <input placeholder="Ejemplo: #TuMarca, #Hashtag" className={input} />
          </div>

          <div>
            <p className="mb-1.5 text-[13px] font-semibold text-ink">
              Enlace de referencia
            </p>
            <input placeholder="Pueden ser links a imágenes o videos" className={input} />
          </div>

          <button
            onClick={onRemove}
            className={cn(
              "rounded-[10px] bg-danger-bg px-4 py-2 text-sm font-semibold text-danger",
              "hover:bg-danger hover:text-white",
            )}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
