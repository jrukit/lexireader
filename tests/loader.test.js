import { test } from "node:test";
import assert from "node:assert/strict";
import { loadJSON, loadCore, loadTerms } from "../web/js/loader.js";

test("loadJSON returns the data when the status is 200", async () => {
    globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({ id: "ostep" }),
    });

    const data = await loadJSON("/content/books/ostep/book.json");

    assert.deepEqual(data, { id: "ostep" });
});

test("loadJSON throws an error when the file is missing (404)", async () => {
  globalThis.fetch = async () => ({ ok: false, status: 404 });

  await assert.rejects(loadJSON("/content/missing.json"), /404/);
});

// A fake fetch that remembers every URL it was asked for.
function fakeFetch(data) {
  const urls = [];
  globalThis.fetch = async (url) => {
    urls.push(url);
    return { ok: true, status: 200, json: async () => data };
  };
  return urls;
}

test("loadCore loads the shared core dictionary", async () => {
  const core = [{ id: "fetch", word: "fetch" }];
  const urls = fakeFetch(core);

  const data = await loadCore();

  assert.deepEqual(urls, ["/content/lexicon/core.json"]);
  assert.deepEqual(data, core);
});

test("loadTerms loads the book words from the path in book.json", async () => {
  const terms = [{ id: "process:os", word: "process" }];
  const urls = fakeFetch(terms);
  const book = { id: "ostep", terms: { path: "terms.json", hash: "dev" } };

  const data = await loadTerms("ostep", book);

  assert.deepEqual(urls, ["/content/books/ostep/terms.json"]);
  assert.deepEqual(data, terms);
});

test("loadTerms gives an empty list and does not fetch when the book has no terms", async () => {
  const urls = fakeFetch([{ id: "should-not-load" }]);

  const data = await loadTerms("ostep", { id: "ostep" });

  assert.deepEqual(urls, []);
  assert.deepEqual(data, []);
});
