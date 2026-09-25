export type JsonIndent = "2" | "4" | "tab";

export type JsonError = { message: string; line?: number; column?: number };

export type JsonResult = { ok: true; output: string } | { ok: false; error: JsonError };

/** Turns a character index into line/column (both 1-based). */
export function positionToLineColumn(text: string, position: number) {
  const lines = text.slice(0, position).split("\n");
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

class SyntaxErrorAt extends Error {
  constructor(
    message: string,
    readonly position: number,
  ) {
    super(message);
  }
}

/**
 * Walks the text following the JSON grammar just to find the first error and
 * report it in Spanish. JSON.parse messages differ between browsers and
 * sometimes don't include the position.
 */
export function findJsonError(text: string): JsonError | null {
  let i = 0;

  const describe = (index: number) =>
    index >= text.length ? "el final del texto" : `"${text[index]}"`;
  const fail = (expected: string): never => {
    throw new SyntaxErrorAt(`Se esperaba ${expected} y se encontró ${describe(i)}`, i);
  };
  const skipWhitespace = () => {
    while (i < text.length && " \t\n\r".includes(text[i]!)) i++;
  };
  const expectLiteral = (literal: string) => {
    if (text.startsWith(literal, i)) i += literal.length;
    else fail("un valor JSON");
  };

  const parseString = () => {
    i++; // opening quote
    while (i < text.length) {
      const char = text[i]!;
      if (char === '"') {
        i++;
        return;
      }
      if (char === "\n") fail("el cierre de comillas antes del salto de línea");
      if (char < " ") {
        throw new SyntaxErrorAt("Carácter de control sin escapar dentro de un texto", i);
      }
      if (char === "\\") {
        const next = text[i + 1];
        if (next === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) {
            throw new SyntaxErrorAt("Secuencia \\u inválida: necesita 4 dígitos hexadecimales", i);
          }
          i += 6;
          continue;
        }
        if (next === undefined || !'"\\/bfnrt'.includes(next)) {
          throw new SyntaxErrorAt(`Secuencia de escape inválida: \\${next ?? ""}`, i);
        }
        i += 2;
        continue;
      }
      i++;
    }
    fail("el cierre de comillas");
  };

  const parseNumber = () => {
    const match = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
    if (!match) fail("un número válido");
    i += match![0].length;
  };

  const parseValue = (): void => {
    skipWhitespace();
    const char = text[i];
    if (char === "{") return parseObject();
    if (char === "[") return parseArray();
    if (char === '"') return parseString();
    if (char === "-" || (char !== undefined && char >= "0" && char <= "9")) return parseNumber();
    if (char === "t") return expectLiteral("true");
    if (char === "f") return expectLiteral("false");
    if (char === "n") return expectLiteral("null");
    if (char === "'") fail('comillas dobles (") en lugar de simples');
    fail("un valor JSON");
  };

  const parseObject = () => {
    i++;
    skipWhitespace();
    if (text[i] === "}") {
      i++;
      return;
    }
    for (;;) {
      skipWhitespace();
      if (text[i] === "}") fail("otra propiedad (JSON no permite comas finales)");
      if (text[i] !== '"') fail("un nombre de propiedad entre comillas dobles");
      parseString();
      skipWhitespace();
      if (text[i] !== ":") fail('":" después del nombre de la propiedad');
      i++;
      parseValue();
      skipWhitespace();
      if (text[i] === ",") {
        i++;
        continue;
      }
      if (text[i] === "}") {
        i++;
        return;
      }
      fail('"," o "}"');
    }
  };

  const parseArray = () => {
    i++;
    skipWhitespace();
    if (text[i] === "]") {
      i++;
      return;
    }
    for (;;) {
      skipWhitespace();
      if (text[i] === "]") fail("otro elemento (JSON no permite comas finales)");
      parseValue();
      skipWhitespace();
      if (text[i] === ",") {
        i++;
        continue;
      }
      if (text[i] === "]") {
        i++;
        return;
      }
      fail('"," o "]"');
    }
  };

  try {
    parseValue();
    skipWhitespace();
    if (i < text.length) fail("el final del texto (sobra contenido)");
    return null;
  } catch (err) {
    if (err instanceof SyntaxErrorAt) {
      return { message: err.message, ...positionToLineColumn(text, err.position) };
    }
    throw err;
  }
}

function parse(input: string): { ok: true; value: unknown } | { ok: false; error: JsonError } {
  if (input.trim() === "") {
    return { ok: false, error: { message: "Pega un JSON para empezar." } };
  }
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (err) {
    const located = findJsonError(input);
    const fallback = err instanceof Error ? err.message : String(err);
    return { ok: false, error: located ?? { message: fallback } };
  }
}

export function formatJson(input: string, indent: JsonIndent = "2"): JsonResult {
  const parsed = parse(input);
  if (!parsed.ok) return parsed;
  const space = indent === "tab" ? "\t" : Number(indent);
  return { ok: true, output: JSON.stringify(parsed.value, null, space) };
}

export function minifyJson(input: string): JsonResult {
  const parsed = parse(input);
  if (!parsed.ok) return parsed;
  return { ok: true, output: JSON.stringify(parsed.value) };
}
