/**
 * Make all the forms of a dictionary word, so we can find it in a text.
 * The regular forms (-s / -es, -ed, -ing) are guessed here; `irregular`
 * comes from the dictionary entry's `forms` (e.g. run → ["ran"]).
 * Everything is lowercase, and there are no duplicates.
 */
export function wordForms(word, irregular = []) {
  const base = word.toLowerCase();
  const extra = irregular.map((form) => form.toLowerCase());

  // 1. A phrase (it has a space) gets no guessed forms
  if (base.includes(" ")) {
    return unique([base, ...extra]);
  }

  const forms = [base];
  const consonantY = /[^aeiou]y$/.test(base);

  // 2. -s / -es
  if (/(s|x|z|ch|sh)$/.test(base)) {
    forms.push(base + "es");
  } else if (consonantY) {
    forms.push(base.slice(0, -1) + "ies");
  } else {
    forms.push(base + "s");
  }

  // 3. -ed
  if (base.endsWith("e")) {
    forms.push(base + "d");
  } else if (consonantY) {
    forms.push(base.slice(0, -1) + "ied");
  } else {
    forms.push(base + "ed");
  }

  // 4. -ing
  if (base.endsWith("e") && !base.endsWith("ee")) {
    forms.push(base.slice(0, -1) + "ing");
  } else {
    forms.push(base + "ing");
  }

  // 5. Doubling: consonant + vowel + consonant (not w, x, y) → also add the doubled forms
  if (/[^aeiou][aeiou][^aeiouwxy]$/.test(base)) {
    const last = base.at(-1);
    forms.push(base + last + "ed", base + last + "ing");
  }

  // 6. Irregular forms + 7. no duplicates
  return unique([...forms, ...extra]);
}

function unique(list) {
  return [...new Set(list)];
}
