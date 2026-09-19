import type { ToolDefinition } from "@seo/core/tools/registry";
import Content from "./content.mdx";
import { FiniquitoCalculator } from "./FiniquitoCalculator";

export const finiquito: ToolDefinition = {
  slug: "finiquito",
  name: "Calculadora de finiquito",
  title: "Calculadora de finiquito 2026 en España: con indemnización",
  description:
    "Calcula tu finiquito y tu indemnización por despido en España en 2026: vacaciones, pagas extra, días trabajados y preaviso, explicado paso a paso.",
  h1: "Calculadora de finiquito 2026",
  intro:
    "Calcula lo que te corresponde al terminar tu contrato en España: vacaciones, pagas extra, días trabajados y, si hay despido, la indemnización. Con cada paso explicado.",
  category: "Despido y finiquito",
  keywords: [
    "calculadora finiquito",
    "calcular finiquito",
    "finiquito 2026",
    "indemnización despido",
    "calcular indemnización despido improcedente",
  ],
  faq: [
    {
      question: "¿Tengo derecho a finiquito si me voy yo de la empresa?",
      answer:
        "Sí. El finiquito se paga siempre que termina la relación laboral, también en una baja voluntaria. Lo que no hay en ese caso es indemnización, y la empresa puede descontarte los días de preaviso que no hayas respetado.",
    },
    {
      question: "¿Cuál es la diferencia entre finiquito e indemnización?",
      answer:
        "El finiquito liquida lo que ya has generado: días trabajados, vacaciones pendientes y parte de las pagas extra. La indemnización compensa la pérdida del empleo y solo existe en algunos despidos y en el fin de contratos temporales.",
    },
    {
      question: "¿Cuándo tiene que pagarme la empresa el finiquito?",
      answer:
        "Al terminar la relación laboral. El Estatuto de los Trabajadores obliga a acompañar la comunicación del cese con una propuesta del documento de liquidación (art. 49.2 ET).",
    },
    {
      question: "¿Debo firmar el finiquito si no estoy de acuerdo?",
      answer:
        "Puedes firmarlo añadiendo «no conforme» junto a tu firma. Así dejas constancia de que lo recibes sin aceptar las cantidades, y conservas el derecho a reclamar.",
    },
    {
      question: "¿El finiquito paga impuestos?",
      answer:
        "Los conceptos salariales (días trabajados, vacaciones y pagas extra) tributan IRPF y cotizan como una nómina. La indemnización legal por despido está exenta de IRPF hasta 180.000 €.",
    },
  ],
  relatedTools: [],
  relatedArticles: [],
  updatedAt: "2026-09-19",
  Component: FiniquitoCalculator,
  Content,
};
