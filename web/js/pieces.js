/**
 * Cut a text into pieces, using the matches from findWords.
 *   - plain text      → { text }
 *   - dictionary word → { text, id }
 * Example:
 *   splitByWords("The process runs.", [{ id: "process:os", start: 4, end: 11 }])
 *   → [{ text: "The " }, { text: "process", id: "process:os" }, { text: " runs." }]
 * Rules:
 *   - no empty pieces ({ text: "" } never appears)
 *   - joining all piece texts gives back the original text
 *   - `matches` is in text order and matches do not overlap (findWords does this)
 */
export function splitByWords(text, matches) {
  // TODO F5d
  // Hint: it is the same idea as parseInline in marks.js:
  //   keep a `last` position, and for each match:
  //   1. the text before the match (if not empty) → a plain piece
  //   2. the match itself → a piece with an id (use text.slice)
  //   3. move `last` to the end of the match
  //   at the end: the text after the last match (if not empty) → a plain piece
  return [];
}
