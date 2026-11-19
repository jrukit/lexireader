import { parseInline } from "./marks.js";
import { findWords } from "./search.js";
import { splitByWords } from "./pieces.js";

const TAG = { italic: "em", bold: "strong", code: "code" };

// Add plain text to `parent`.
// Dictionary words become <span class="word" data-id="...">word</span>.
function renderText(parent, text, index) {
  // TODO F5d
  //   1. find the words:  findWords(text, index)
  //   2. cut the text:    splitByWords(text, matches)
  //   3. for each piece:
  //        no id → parent.append(piece.text)   (a plain text node)
  //        id    → create a <span>, set className = "word",
  //                dataset.id = piece.id, textContent = piece.text,
  //                then parent.append(span)
  //   Never use innerHTML.
  parent.append(text); // remove this line when you write the TODO
}

export function renderInline(parent, text, index) {
  for (const token of parseInline(text)) {
    if (token.type === "text") {
      renderText(parent, token.text, index);
    } else if (token.type === "footnote") {
      const link = document.createElement("a");
      link.href = `#fn-${token.n}`;
      link.id = `fnref-${token.n}`;
      link.textContent = token.n;

      const sup = document.createElement("sup");
      sup.append(link);
      parent.append(sup);
    } else {
      const el = document.createElement(TAG[token.type]);
      el.textContent = token.text;
      parent.append(el);
    }
  }
}

export function renderBlock(block, index) {
  switch (block.type) {
    case "heading": {
      const el = document.createElement(`h${block.level}`);
      renderInline(el, block.text, index);
      el.dataset.id = block.id;
      return el;
    }
    case "paragraph": {
      const el = document.createElement("p");
      renderInline(el, block.text, index);
      el.dataset.id = block.id;
      return el;
    }
    default:
      console.warn("Unknown block type:", block.type, block);
      return null;
  }
}

function renderFootnotes(footnotes, index) {
  const entries = Object.entries(footnotes);
  if (entries.length === 0) {
    return null;
  }

  const section = document.createElement("section");
  section.className = "footnotes";

  for (const [n, note] of entries) {
    const p = document.createElement("p");
    p.id = `fn-${n}`;

    const back = document.createElement("a");
    back.href = `#fnref-${n}`;
    back.textContent = `${n}.`;

    p.append(back, " ");
    renderInline(p, note, index);
    section.append(p);
  }

  return section;
}

// `index` = Map form → id (from buildIndex). Empty Map = no dictionary words.
export function renderChapter(container, chapter, text, index = new Map()) {
  const article = document.createElement("article");

  const title = document.createElement("h1");
  title.textContent = chapter.title;
  article.append(title);

  for (const block of text.blocks) {
    const el = renderBlock(block, index);
    if (el) {
      article.append(el);
    }
  }

  const notes = renderFootnotes(text.footnotes, index);
  if (notes) {
    article.append(notes);
  }

  container.replaceChildren(article);
}
