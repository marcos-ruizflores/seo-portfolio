"use client";

import { buttonClass, fieldClass, labelClass } from "@seo/core/components/ui/button";
import { CopyButton } from "@seo/core/components/ui/CopyButton";
import { useId, useState } from "react";
import { formatJson, minifyJson, type JsonIndent, type JsonResult } from "./json";

const EXAMPLE = '{"nombre":"Ada","lenguajes":["TypeScript","C"],"activo":true,"edad":36}';

export function JsonFormatter() {
  const id = useId();
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<JsonIndent>("2");
  const [result, setResult] = useState<JsonResult | null>(null);

  const output = result?.ok ? result.output : "";

  return (
    <div className="space-y-4 rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={`${id}-input`} className={labelClass}>
            JSON de entrada
          </label>
          <button
            type="button"
            className="text-sm text-brand hover:underline"
            onClick={() => {
              setInput(EXAMPLE);
              setResult(null);
            }}
          >
            Cargar ejemplo
          </button>
        </div>
        <textarea
          id={`${id}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          spellCheck={false}
          placeholder='{"clave": "valor"}'
          className={`${fieldClass} font-mono`}
          aria-describedby={result && !result.ok ? `${id}-error` : undefined}
          aria-invalid={result ? !result.ok : undefined}
        />
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-indent`} className={labelClass}>
            Sangría
          </label>
          <select
            id={`${id}-indent`}
            value={indent}
            onChange={(e) => setIndent(e.target.value as JsonIndent)}
            className={`${fieldClass} w-auto`}
          >
            <option value="2">2 espacios</option>
            <option value="4">4 espacios</option>
            <option value="tab">Tabulador</option>
          </select>
        </div>
        <button
          type="button"
          className={buttonClass("primary")}
          onClick={() => setResult(formatJson(input, indent))}
        >
          Formatear
        </button>
        <button
          type="button"
          className={buttonClass("secondary")}
          onClick={() => setResult(minifyJson(input))}
        >
          Minificar
        </button>
        <button
          type="button"
          className={buttonClass("ghost")}
          onClick={() => {
            setInput("");
            setResult(null);
          }}
        >
          Limpiar
        </button>
      </div>

      {result && !result.ok && (
        <p
          id={`${id}-error`}
          role="alert"
          className="rounded-md bg-surface-muted p-3 text-sm text-danger"
        >
          {result.error.line !== undefined && (
            <strong>
              Línea {result.error.line}, columna {result.error.column}:{" "}
            </strong>
          )}
          {result.error.message}
        </p>
      )}

      {result?.ok && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={`${id}-output`} className={labelClass}>
              Resultado <span className="font-normal text-success">· JSON válido</span>
            </label>
            <CopyButton value={output} />
          </div>
          <textarea
            id={`${id}-output`}
            value={output}
            readOnly
            rows={Math.min(20, Math.max(6, output.split("\n").length))}
            spellCheck={false}
            className={`${fieldClass} bg-surface-muted font-mono`}
          />
        </div>
      )}
    </div>
  );
}
