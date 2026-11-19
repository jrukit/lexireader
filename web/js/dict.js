/**
 * Join the core words and the book words into one Map (id → entry).
 * The book layer wins, field by field: a terms entry with the same id
 * keeps the core fields and adds or replaces only its own fields.
 */
export function mergeDict(core, terms) {
  const dict = new Map();

  for (const entry of core) {
    dict.set(entry.id, { ...entry });
  }

  for (const entry of terms) {
    dict.set(entry.id, { ...dict.get(entry.id), ...entry });
  }

  return dict;
}
