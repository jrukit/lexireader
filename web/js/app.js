import { loadBook, loadChapter } from "./loader.js";
import { renderChapter } from "./render.js";

console.log("lexireader started");

const app = document.getElementById("app");

const book = await loadBook("ostep");
const chapter = book.chapters.find((c) => c.num === 2);
const text = await loadChapter("ostep", chapter);

// TODO F5d: make the index from the dictionary
//   1. import loadCore, loadTerms (loader.js), mergeDict (dict.js), buildIndex (search.js)
//   2. load core and terms (both at the same time: Promise.all)
//   3. dict = mergeDict(core, terms)  →  index = buildIndex(dict)
//   4. replace the empty Map below with your index
const index = new Map();

renderChapter(app, chapter, text, index);
