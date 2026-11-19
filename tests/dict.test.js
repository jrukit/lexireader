import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeDict } from "../web/js/dict.js";

const fetchCore = {
  id: "fetch", word: "fetch", kind: "word", pos: "verb",
  en: "To go and get something, then bring it back.",
  example: "The dog fetched the ball.", th: "ไปหยิบมา",
};

test("empty lists give an empty dictionary", () => {
  const dict = mergeDict([], []);
  assert.equal(dict.size, 0);
});

test("a core word can be found by its id", () => {
  const dict = mergeDict([fetchCore], []);
  assert.deepEqual(dict.get("fetch"), fetchCore);
});

test("a book-only term can be found by its id", () => {
  const term = { id: "process:os", word: "process", kind: "term", pos: "noun", en: "A running program." };
  const dict = mergeDict([], [term]);
  assert.deepEqual(dict.get("process:os"), term);
});

test("an overlay adds the book meaning to a core word", () => {
  const overlay = { id: "fetch", inBook: "The CPU gets the next instruction.", thInBook: "CPU ดึงคำสั่งถัดไป" };
  const dict = mergeDict([fetchCore], [overlay]);
  assert.deepEqual(dict.get("fetch"), {
    ...fetchCore,
    inBook: "The CPU gets the next instruction.",
    thInBook: "CPU ดึงคำสั่งถัดไป",
  });
});

test("the book layer wins, field by field", () => {
  const overlay = { id: "fetch", en: "To get something." };
  const dict = mergeDict([fetchCore], [overlay]);
  assert.equal(dict.get("fetch").en, "To get something.");
  assert.equal(dict.get("fetch").example, "The dog fetched the ball.");
});

test("mergeDict does not change the input objects", () => {
  const core = [{ ...fetchCore }];
  mergeDict(core, [{ id: "fetch", en: "changed" }]);
  assert.equal(core[0].en, fetchCore.en);
});
