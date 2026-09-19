import type { Faq } from "../../tools/registry";

/** <details> nativo: accesible por teclado y sin JavaScript. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group p-4">
          <summary className="cursor-pointer list-none font-medium marker:hidden">
            <span className="flex items-center justify-between gap-4">
              {item.question}
              <span
                aria-hidden="true"
                className="text-muted transition-transform group-open:rotate-45"
              >
                +
              </span>
            </span>
          </summary>
          <p className="mt-2 text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
