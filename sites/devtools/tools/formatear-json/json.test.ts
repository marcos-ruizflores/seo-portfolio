import { describe, expect, it } from "vitest";
import { findJsonError, formatJson, minifyJson, positionToLineColumn } from "./json";

describe("formatJson", () => {
  it("formatea con 2 espacios por defecto", () => {
    expect(formatJson('{"a":1,"b":[1,2]}')).toEqual({
      ok: true,
      output: '{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}',
    });
  });

  it("admite 4 espacios y tabuladores", () => {
    expect(formatJson('{"a":1}', "4")).toEqual({ ok: true, output: '{\n    "a": 1\n}' });
    expect(formatJson('{"a":1}', "tab")).toEqual({ ok: true, output: '{\n\t"a": 1\n}' });
  });

  it("conserva caracteres unicode", () => {
    expect(formatJson('{"ciudad":"Málaga"}')).toEqual({
      ok: true,
      output: '{\n  "ciudad": "Málaga"\n}',
    });
  });

  it("pide contenido si la entrada está vacía", () => {
    const result = formatJson("   ");
    expect(result.ok).toBe(false);
  });

  it("localiza la línea y columna del error", () => {
    const result = formatJson('{\n  "a": 1,\n  "b": \n}');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.line).toBe(4);
      expect(result.error.column).toBe(1);
    }
  });

  it("rechaza comas finales (no son JSON válido)", () => {
    expect(formatJson('{"a":1,}').ok).toBe(false);
  });
});

describe("minifyJson", () => {
  it("elimina espacios y saltos de línea", () => {
    expect(minifyJson('{\n  "a": [1, 2]\n}')).toEqual({ ok: true, output: '{"a":[1,2]}' });
  });
});

describe("findJsonError", () => {
  it.each([
    ['{"a":1,}', 1, 8, /comas finales/],
    ["[1,2,]", 1, 6, /comas finales/],
    ["{'a':1}", 1, 2, /nombre de propiedad/],
    ["['a']", 1, 2, /comillas dobles/],
    ['{"a" 1}', 1, 6, /":"/],
    ['{"a":1}}', 1, 8, /sobra contenido/],
    ['{"a":"sin cerrar}', 1, 18, /cierre de comillas/],
    ['{\n  "a": tru\n}', 2, 8, /valor JSON/],
    ['"\\x"', 1, 2, /escape inválida/],
  ])("%j → línea %i, columna %i", (input, line, column, message) => {
    const error = findJsonError(input);
    expect(error).toMatchObject({ line, column });
    expect(error?.message).toMatch(message);
  });

  it("coincide con JSON.parse sobre qué es válido", () => {
    const samples = [
      "{}",
      "[]",
      "0",
      "-0.5e+10",
      '"\\u00e1"',
      "null",
      ' [1, {"a": [true, false]}] ',
      "01",
      "1.",
      ".5",
      "+1",
      "NaN",
      "[1 2]",
      '{"a":}',
      "",
      "{",
      '"\t"',
    ];
    for (const sample of samples) {
      let valid = true;
      try {
        JSON.parse(sample);
      } catch {
        valid = false;
      }
      expect(findJsonError(sample) === null, sample).toBe(valid);
    }
  });
});

describe("positionToLineColumn", () => {
  it("convierte índices en línea y columna 1-indexadas", () => {
    expect(positionToLineColumn("ab\ncd", 0)).toEqual({ line: 1, column: 1 });
    expect(positionToLineColumn("ab\ncd", 4)).toEqual({ line: 2, column: 2 });
  });
});
