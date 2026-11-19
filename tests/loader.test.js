import { test } from "node:test";
import assert from "node:assert/strict";
import { loadJSON } from "../web/js/loader.js";

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