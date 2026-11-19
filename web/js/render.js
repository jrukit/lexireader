export function renderBlock(block) {
  switch (block.type) {
    case "heading": {
      const el = document.createElement(`h${block.level}`);
      el.textContent = block.text;
      el.dataset.id = block.id;
      return el;
    }
    case "paragraph": {
      const el = document.createElement("p");
      el.textContent = block.text;
      el.dataset.id = block.id;
      return el;
    }
    default:
      console.warn("Unknown block type:", block.type, block);
      return null;
  }
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

  container.replaceChildren(article);
}