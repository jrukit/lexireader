import { parseInline } from "./marks.js";

const TAG = { italic: "em", bold: "strong", code: "code" };

export function renderInline(parent, text) {
  for (const token of parseInline(text)) {
    if (token.type === "text") {
      parent.append(token.text);
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

export function renderBlock(block) {
  switch (block.type) {
    case "heading": {
      const el = document.createElement(`h${block.level}`);
      renderInline(el, block.text);
      el.dataset.id = block.id;
      return el;
    }
    case "paragraph": {
      const el = document.createElement("p");
      renderInline(el, block.text);
      el.dataset.id = block.id;
      return el;
    }
    default:
      console.warn("Unknown block type:", block.type, block);
      return null;
  }
}

function renderFootnotes(footnotes) {
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
    renderInline(p, note);
    section.append(p);
  }

  return section;
}

export function renderChapter(container, chapter, text) {
  const article = document.createElement("article");

  const title = document.createElement("h1");
  title.textContent = chapter.title;
  article.append(title);

  for (const block of text.blocks) {
    const el = renderBlock(block);
    if (el) {
      article.append(el);
    }
  }

  const notes = renderFootnotes(text.footnotes);
  if (notes) {
    article.append(notes);
  }

  container.replaceChildren(article);
}