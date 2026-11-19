import { wordForms } from "./forms.js";

/**
 * Build a "form → id" Map from the dictionary (id → entry),
 * so we can find the entry for any word we see in a text:
 *   index.get("fetches") → "fetch"
 * When two entries have the same form, the LATER one wins
 * (mergeDict puts book-only terms after core words, so the book word wins).
 */
export function buildIndex(dict) {
  const index = new Map();

  for (const [id, entry] of dict) {
    if (!entry.word) {
      continue; // bad data: e.g. an overlay without a core word
    }
    for (const form of wordForms(entry.word, entry.forms)) {
      index.set(form, id);
    }
  }

  return index;
}

const WORD = /[A-Za-z]+(?:-[A-Za-z]+)*/g; // letters, may have hyphens: "easy-to-use"
const MAX_PHRASE_WORDS = 4;

/**
 * Find all dictionary words (and phrases) in a text.
 * Returns [{ id, start, end }] in text order; `end` is not included,
 * so text.slice(start, end) is the matched text.
 * At each word, the longest phrase is tried first.
 */
export function findWords(text, index) {
  const words = splitWords(text);
  const matches = [];
  let i = 0;

  while (i < words.length) {
    const match = longestMatchAt(words, i, index);
    if (match) {
      const last = words[i + match.length - 1];
      matches.push({ id: match.id, start: words[i].start, end: last.end });
      i += match.length; // jump over the matched words
    } else {
      i += 1;
    }
  }

  return matches;
}

// "It fetched." → [{ text: "it", start: 0, end: 2 }, { text: "fetched", start: 3, end: 10 }]
function splitWords(text) {
  return [...text.matchAll(WORD)].map((m) => ({
    text: m[0].toLowerCase(),
    start: m.index,
    end: m.index + m[0].length,
  }));
}

// Try the longest phrase first (up to MAX_PHRASE_WORDS words), then shorter ones.
// Returns { id, length } or null.
function longestMatchAt(words, i, index) {
  const most = Math.min(MAX_PHRASE_WORDS, words.length - i);
  for (let length = most; length >= 1; length--) {
    const key = words.slice(i, i + length).map((w) => w.text).join(" ");
    const id = index.get(key);
    if (id !== undefined) {
      return { id, length };
    }
  }
  return null;
}
