import { loadBook, loadChapter } from "./loader.js";
import { renderChapter } from "./render.js";

console.log("lexireader started");

const app = document.getElementById("app");

const book = await loadBook("ostep");
const chapter = book.chapters.find((c) => c.num === 2);
const text = await loadChapter("ostep", chapter);

renderChapter(app, chapter, text);