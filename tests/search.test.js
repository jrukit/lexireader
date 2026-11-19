import { test } from "node:test";
import assert from "node:assert/strict";
import { buildIndex } from "../web/js/search.js";

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
