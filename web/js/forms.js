const ENDS_LIKE_S = /(s|x|z|ch|sh)$/;           // fetch, process, box
const CONSONANT_Y = /[^aeiou]y$/;               // copy (not play)
const CONSONANT_VOWEL_CONSONANT = /[^aeiou][aeiou][^aeiouwxy]$/; // map, stop

/**
 * Make all the forms of a dictionary word, so we can find it in a text.
 * The regular forms (-s / -es, -ed, -ing) are guessed here; `irregular`
 * comes from the dictionary entry's `forms` (e.g. run → ["ran"]).
 * Everything is lowercase, and there are no duplicates.
 */
export function wordForms(word, irregular = []) {
  const base = word.toLowerCase();
  const extra = irregular.map((form) => form.toLowerCase());

  if (isPhrase(base)) {
    return unique([base, ...extra]);
  }

  return unique([
    base,
    sForm(base),
    edForm(base),
    ingForm(base),
    ...doubledForms(base),
    ...extra,
  ]);
}

function isPhrase(word) {
  return word.includes(" ");
}

// fetch → fetches, copy → copies, look → looks
function sForm(word) {
  if (ENDS_LIKE_S.test(word)) {
    return word + "es";
  }
  if (CONSONANT_Y.test(word)) {
    return word.slice(0, -1) + "ies";
  }
  return word + "s";
}

// execute → executed, copy → copied, look → looked
function edForm(word) {
  if (word.endsWith("e")) {
    return word + "d";
  }
  if (CONSONANT_Y.test(word)) {
    return word.slice(0, -1) + "ied";
  }
  return word + "ed";
}

// execute → executing, free → freeing, copy → copying
function ingForm(word) {
  if (word.endsWith("e") && !word.endsWith("ee")) {
    return word.slice(0, -1) + "ing";
  }
  return word + "ing";
}

// map → [mapped, mapping]; other words → []
function doubledForms(word) {
  if (!CONSONANT_VOWEL_CONSONANT.test(word)) {
    return [];
  }
  const last = word.at(-1);
  return [word + last + "ed", word + last + "ing"];
}

function unique(list) {
  return [...new Set(list)];
}
