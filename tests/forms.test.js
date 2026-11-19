import { test } from "node:test";
import assert from "node:assert/strict";
import { wordForms } from "../web/js/forms.js";

// Check that `forms` has every word in `expected` (the order does not matter).
function assertHas(forms, expected) {
  for (const word of expected) {
    assert.ok(forms.includes(word), `missing "${word}" in [${forms.join(", ")}]`);
  }
}

test("the base word is always in the list", () => {
  assertHas(wordForms("look"), ["look"]);
});

test("normal word: add -s, -ed, -ing", () => {
  assertHas(wordForms("look"), ["looks", "looked", "looking"]);
});

test("ends in ch / sh / s / x / z: add -es", () => {
  assertHas(wordForms("fetch"), ["fetches", "fetched", "fetching"]);
  assertHas(wordForms("process"), ["processes", "processed", "processing"]);
});

test("consonant + y: y becomes i for -es and -ed, but stays for -ing", () => {
  assertHas(wordForms("copy"), ["copies", "copied", "copying"]);
});

test("vowel + y: keep the y", () => {
  assertHas(wordForms("play"), ["plays", "played", "playing"]);
});

test("ends in e: add only -d, and drop the e before -ing", () => {
  assertHas(wordForms("execute"), ["executes", "executed", "executing"]);
});

test("short consonant-vowel-consonant word: double the last letter", () => {
  assertHas(wordForms("map"), ["maps", "mapped", "mapping"]);
});

test("irregular forms are added", () => {
  assertHas(wordForms("run", ["ran"]), ["run", "runs", "running", "ran"]);
});

test("a phrase has no guessed forms", () => {
  assert.deepEqual(wordForms("in charge of"), ["in charge of"]);
});

test("all forms are lowercase", () => {
  assertHas(wordForms("CPU"), ["cpu", "cpus"]);
  assertHas(wordForms("go", ["Went"]), ["went"]);
});

test("there are no duplicates", () => {
  const forms = wordForms("fetch", ["fetched"]);
  assert.equal(new Set(forms).size, forms.length);
});
