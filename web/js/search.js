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
