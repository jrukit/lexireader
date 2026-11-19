import { test } from "node:test";
import assert from "node:assert/strict";
import { buildIndex, findWords } from "../web/js/search.js";

// Make a dictionary Map (id → entry) from a list of entries, in order.
function makeDict(entries) {
  return new Map(entries.map((entry) => [entry.id, entry]));
}

test("an empty dictionary gives an empty index", () => {
  const index = buildIndex(new Map());
  assert.equal(index.size, 0);
});

test("every form of a word points to its id", () => {
  const index = buildIndex(makeDict([{ id: "fetch", word: "fetch" }]));
  assert.equal(index.get("fetch"), "fetch");
  assert.equal(index.get("fetches"), "fetch");
  assert.equal(index.get("fetched"), "fetch");
  assert.equal(index.get("fetching"), "fetch");
});

test("irregular forms point to the id too", () => {
  const index = buildIndex(makeDict([{ id: "run", word: "run", forms: ["ran"] }]));
  assert.equal(index.get("ran"), "run");
});

test("a phrase points to its id", () => {
  const index = buildIndex(makeDict([{ id: "in-charge-of", word: "in charge of" }]));
  assert.equal(index.get("in charge of"), "in-charge-of");
});

test("the book word wins over the core word with the same form", () => {
  const index = buildIndex(makeDict([
    { id: "process", word: "process" },
    { id: "process:os", word: "process" },
  ]));
  assert.equal(index.get("process"), "process:os");
  assert.equal(index.get("processes"), "process:os");
});

test("forms are lowercase", () => {
  const index = buildIndex(makeDict([{ id: "cpu", word: "CPU" }]));
  assert.equal(index.get("cpu"), "cpu");
  assert.equal(index.get("CPU"), undefined);
});

test("an entry without a word is skipped (bad data)", () => {
  const index = buildIndex(makeDict([{ id: "fetch", inBook: "only an overlay" }]));
  assert.equal(index.size, 0);
});

// ---------- findWords ----------

// A small index (form → id), made by hand so these tests only test findWords.
const index = new Map([
  ["fetch", "fetch"],
  ["fetches", "fetch"],
  ["fetched", "fetch"],
  ["charge", "charge"],
  ["in charge of", "in-charge-of"],
  ["process", "process:os"],
  ["system", "system"],
]);

test("a text with no dictionary words gives no matches", () => {
  assert.deepEqual(findWords("hello world", index), []);
});

test("finds a word with its start and end", () => {
  assert.deepEqual(findWords("it fetches data", index), [
    { id: "fetch", start: 3, end: 10 },
  ]);
});

test("capital letters do not matter", () => {
  assert.deepEqual(findWords("Fetch the ball.", index), [
    { id: "fetch", start: 0, end: 5 },
  ]);
});

test("finds a phrase", () => {
  assert.deepEqual(findWords("she is in charge of it", index), [
    { id: "in-charge-of", start: 7, end: 19 },
  ]);
});

test("the longest match wins", () => {
  assert.deepEqual(findWords("He is in charge of the CPU, and the charge is low.", index), [
    { id: "in-charge-of", start: 6, end: 18 },
    { id: "charge", start: 36, end: 42 },
  ]);
});

test("whole words only", () => {
  assert.deepEqual(findWords("prefetch and fetcher", index), []);
});

test("punctuation is not part of the match", () => {
  assert.deepEqual(findWords("It fetched.", index), [
    { id: "fetch", start: 3, end: 10 },
  ]);
});

test("an apostrophe ends the word (system's → system)", () => {
  assert.deepEqual(findWords("the system's state", index), [
    { id: "system", start: 4, end: 10 },
  ]);
});

test("many matches, in order", () => {
  assert.deepEqual(findWords("fetch, then process", index), [
    { id: "fetch", start: 0, end: 5 },
    { id: "process:os", start: 12, end: 19 },
  ]);
});
