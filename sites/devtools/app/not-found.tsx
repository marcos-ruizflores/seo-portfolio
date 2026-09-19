import { buttonClass } from "@seo/core/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Esta página no existe</h1>
      <p className="mt-3 text-muted">
        Puede que la dirección esté mal escrita o que la hayamos movido.
      </p>
      <Link href="/" className={`${buttonClass("primary")} mt-8`}>
        Ver todas las herramientas
      </Link>
    </main>
  );
}
