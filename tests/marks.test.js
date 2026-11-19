import { test } from "node:test";
import assert from "node:assert/strict";
import { parseInline } from "../web/js/marks.js";

test("plain text is one text token", () => {
  assert.deepEqual(parseInline("hello world"), [
    { type: "text", text: "hello world" },
  ]);
});

test("an empty string gives no tokens", () => {
  assert.deepEqual(parseInline(""), []);
});

test("italic in the middle of text", () => {
  assert.deepEqual(parseInline("it *executes* code"), [
    { type: "text", text: "it " },
    { type: "italic", text: "executes" },
    { type: "text", text: " code" },
  ]);
});

test("bold", () => {
  assert.deepEqual(parseInline("**OS**"), [
    { type: "bold", text: "OS" },
  ]);
});

test("inline code", () => {
  assert.deepEqual(parseInline("call `fork()` now"), [
    { type: "text", text: "call " },
    { type: "code", text: "fork()" },
    { type: "text", text: " now" },
  ]);
});

test("footnote marker", () => {
  assert.deepEqual(parseInline("it runs.[^1]"), [
    { type: "text", text: "it runs." },
    { type: "footnote", n: "1" },
  ]);
});

test("many marks in one text", () => {
  assert.deepEqual(parseInline("*a* and **b**"), [
    { type: "italic", text: "a" },
    { type: "text", text: " and " },
    { type: "bold", text: "b" },
  ]);
});

test("no marks inside code", () => {
  assert.deepEqual(parseInline("`a*b*c`"), [
    { type: "code", text: "a*b*c" },
  ]);
});

test("one star alone is just text", () => {
  assert.deepEqual(parseInline("2 * 3"), [
    { type: "text", text: "2 * 3" },
  ]);
});