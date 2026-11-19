import { test } from "node:test";
import assert from "node:assert/strict";
import { splitByWords } from "../web/js/pieces.js";
import { buildIndex, findWords } from "../web/js/search.js";

test("empty text gives no pieces", () => {
  assert.deepEqual(splitByWords("", []), []);
});

test("text without matches is one plain piece", () => {
  assert.deepEqual(splitByWords("Hello there.", []), [
    { text: "Hello there." },
  ]);
});

test("a word in the middle splits the text into 3 pieces", () => {
  const text = "The process runs.";
  const matches = [{ id: "process:os", start: 4, end: 11 }];
  assert.deepEqual(splitByWords(text, matches), [
    { text: "The " },
    { text: "process", id: "process:os" },
    { text: " runs." },
  ]);
});

test("no empty plain piece when the word is at the start or the end", () => {
  const text = "fetch it";
  assert.deepEqual(splitByWords(text, [{ id: "fetch", start: 0, end: 5 }]), [
    { text: "fetch", id: "fetch" },
    { text: " it" },
  ]);
  assert.deepEqual(splitByWords(text, [{ id: "it", start: 6, end: 8 }]), [
    { text: "fetch " },
    { text: "it", id: "it" },
  ]);
});

test("the word keeps its spelling from the text (not lowercase)", () => {
  const matches = [{ id: "fetch", start: 0, end: 7 }];
  assert.deepEqual(splitByWords("Fetched!", matches), [
    { text: "Fetched", id: "fetch" },
    { text: "!" },
  ]);
});

test("two words next to each other give no empty piece between them", () => {
  // "ab" with two matches: "a" (0–1) and "b" (1–2)
  const matches = [
    { id: "a", start: 0, end: 1 },
    { id: "b", start: 1, end: 2 },
  ];
  assert.deepEqual(splitByWords("ab", matches), [
    { text: "a", id: "a" },
    { text: "b", id: "b" },
  ]);
});

test("joining all pieces gives back the original text", () => {
  const text = "It ran, and then it fetched the data.";
  const matches = [
    { id: "run", start: 3, end: 6 },
    { id: "fetch", start: 20, end: 27 },
  ];
  const joined = splitByWords(text, matches).map((p) => p.text).join("");
  assert.equal(joined, text);
});

test("works together with buildIndex and findWords (phrase + word)", () => {
  const dict = new Map([
    ["in-charge-of", { id: "in-charge-of", word: "in charge of" }],
    ["process:os", { id: "process:os", word: "process" }],
  ]);
  const text = "The OS is in charge of every process.";
  const pieces = splitByWords(text, findWords(text, buildIndex(dict)));
  assert.deepEqual(pieces, [
    { text: "The OS is " },
    { text: "in charge of", id: "in-charge-of" },
    { text: " every " },
    { text: "process", id: "process:os" },
    { text: "." },
  ]);
});
