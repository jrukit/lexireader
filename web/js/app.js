import { loadBook, loadChapter } from "./loader.js";

console.log("lexireader started");

const book = await loadBook("ostep");
console.log("book:", book);

const chapter = book.chapters.find((c) => c.num === 2);
const text = await loadChapter("ostep", chapter);
console.log("chapter 2:", text);