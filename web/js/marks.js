const MARK = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[\^(\w+)\]/g;

export function parseInline(text) {
  const tokens = [];
  let last = 0;

  for (const m of text.matchAll(MARK)) {
    // 1. Text before the match
    const before = text.slice(last, m.index);
    if (before !== "") {
      tokens.push({ type: "text", text: before });
    }

    // 2. The mark itself: only one group has a value
    if (m[1] !== undefined) {
      tokens.push({ type: "code", text: m[1] });
    } else if (m[2] !== undefined) {
      tokens.push({ type: "bold", text: m[2] });
    } else if (m[3] !== undefined) {
      tokens.push({ type: "italic", text: m[3] });
    } else {
      tokens.push({ type: "footnote", n: m[4] });
    }

    // 3. Move `last` to the end of this match
    last = m.index + m[0].length;
  }

  // 4. Text after the last match
  const after = text.slice(last);
  if (after !== "") {
    tokens.push({ type: "text", text: after });
  }

  return tokens;
}
