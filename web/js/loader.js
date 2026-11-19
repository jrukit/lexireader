export async function loadJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status}`);
  }
  return res.json();
}

export function loadBook(bookId) {
  return loadJSON(`/content/books/${bookId}/book.json`);
}

export function loadChapter(bookId, chapter) {
  return loadJSON(`/content/books/${bookId}/${chapter.text.path}`);
}

// The shared dictionary for all books: /content/lexicon/core.json
export function loadCore() {
  // TODO F5d: one line, like loadBook
  throw new Error("TODO: loadCore");
}

// The book's own words. The path comes from book.json: book.terms.path
// A book without `terms` has no book words → return an empty list (no fetch).
export async function loadTerms(bookId, book) {
  // TODO F5d
  throw new Error("TODO: loadTerms");
}
