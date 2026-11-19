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