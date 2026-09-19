"use client";

import { useState } from "react";
import { buttonClass, type ButtonVariant } from "./button";

export function CopyButton({
  value,
  label = "Copiar",
  variant = "secondary",
}: {
  value: string;
  label?: string;
  variant?: ButtonVariant;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <button type="button" className={buttonClass(variant)} onClick={copy} disabled={!value}>
      {status === "copied" ? "¡Copiado!" : status === "error" ? "No se pudo copiar" : label}
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Copiado al portapapeles" : ""}
      </span>
    </button>
  );
}
