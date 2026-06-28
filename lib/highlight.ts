/**
 * A tiny, dependency-free tokenizer for React/TSX snippets. It is intentionally
 * minimal — just enough to color imports, strings, JSX tags, attributes,
 * numbers, and comments in the playground's code panel.
 */

export type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "tag"
  | "attr"
  | "number"
  | "punct"
  | "plain";

export interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "function",
  "return",
  "const",
  "let",
  "default",
  "true",
  "false",
]);

const IDENT = /[A-Za-z_$][\w$]*/y;
const NUMBER = /\d+(?:\.\d+)?/y;
const WS = /\s+/y;

/** Tokenize a TSX string into a flat list of typed tokens. */
export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = code.length;

  const push = (type: TokenType, value: string) => tokens.push({ type, value });
  const prevMeaningful = (): Token | undefined => {
    for (let k = tokens.length - 1; k >= 0; k--) {
      if (tokens[k].type !== "plain" || tokens[k].value.trim() !== "") {
        return tokens[k];
      }
    }
    return undefined;
  };

  while (i < n) {
    const ch = code[i];

    // Line comment
    if (ch === "/" && code[i + 1] === "/") {
      let j = i + 2;
      while (j < n && code[j] !== "\n") j++;
      push("comment", code.slice(i, j));
      i = j;
      continue;
    }

    // Strings (", ', `)
    if (ch === '"' || ch === "'" || ch === "`") {
      let j = i + 1;
      while (j < n && code[j] !== ch) {
        if (code[j] === "\\") j++;
        j++;
      }
      j++;
      push("string", code.slice(i, Math.min(j, n)));
      i = Math.min(j, n);
      continue;
    }

    // Whitespace
    WS.lastIndex = i;
    const ws = WS.exec(code);
    if (ws && ws.index === i) {
      push("plain", ws[0]);
      i = WS.lastIndex;
      continue;
    }

    // Numbers
    NUMBER.lastIndex = i;
    const num = NUMBER.exec(code);
    if (num && num.index === i) {
      push("number", num[0]);
      i = NUMBER.lastIndex;
      continue;
    }

    // Identifiers / keywords / tags / attrs
    IDENT.lastIndex = i;
    const id = IDENT.exec(code);
    if (id && id.index === i) {
      const word = id[0];
      const prev = prevMeaningful();
      let next = IDENT.lastIndex;
      while (next < n && (code[next] === " " || code[next] === "\t")) next++;
      if (KEYWORDS.has(word)) {
        push("keyword", word);
      } else if (prev && (prev.value === "<" || prev.value === "</")) {
        push("tag", word);
      } else if (code[next] === "=") {
        push("attr", word);
      } else {
        push("plain", word);
      }
      i = IDENT.lastIndex;
      continue;
    }

    // Punctuation (single char)
    if ("<>/{}()[]=;,.:".includes(ch)) {
      push("punct", ch);
      i++;
      continue;
    }

    push("plain", ch);
    i++;
  }

  return tokens;
}
