import type { ToolDefinition } from "@seo/core/tools/registry";
import Content from "./content.mdx";
import { JsonFormatter } from "./JsonFormatter";

export const formatearJson: ToolDefinition = {
  slug: "formatear-json",
  name: "Formatear JSON",
  title: "Formatear JSON online: formateador y validador gratis",
  description:
    "Formatea, valida y minifica JSON online gratis. Detecta la línea exacta de cada error. Funciona en tu navegador: tus datos no salen de tu equipo.",
  h1: "Formatear JSON online",
  intro:
    "Pega tu JSON para ordenarlo con sangría, validarlo o minificarlo. Si hay un error, te decimos en qué línea y columna está.",
  category: "JSON",
  keywords: ["formatear json", "formateador json", "json formatter", "validar json"],
  faq: [
    {
      question: "¿Mis datos se envían a algún servidor?",
      answer:
        "No. El formateo se hace íntegramente en tu navegador con JavaScript. Puedes comprobarlo desconectando internet: la herramienta sigue funcionando.",
    },
    {
      question: "¿Por qué mi JSON da error si funciona en JavaScript?",
      answer:
        "JSON es más estricto que un objeto de JavaScript: exige comillas dobles en claves y textos, no admite comas finales ni comentarios, y no acepta valores como undefined.",
    },
    {
      question: "¿Cuál es la diferencia entre formatear y minificar?",
      answer:
        "Formatear añade sangría y saltos de línea para leerlo mejor; minificar los elimina para que ocupe lo mínimo. El contenido es el mismo en ambos casos.",
    },
  ],
  relatedTools: [],
  relatedArticles: [],
  updatedAt: "2026-09-19",
  Component: JsonFormatter,
  Content,
};
