// Tiny text splitter. Keeps nested elements (e.g. <em>) intact, wraps every
// character (or word) in a mask so it can slide up from below.

const span = (cls: string) => {
  const s = document.createElement("span");
  s.className = cls;
  return s;
};

function walk(node: Node, out: HTMLElement[], mode: "chars" | "words"): Node {
  if (node.nodeType === Node.TEXT_NODE) {
    const frag = document.createDocumentFragment();
    (node.textContent || "").split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(" "));
        return;
      }
      const word = span("w");
      if (mode === "words") {
        const inner = span("sw");
        inner.textContent = part;
        word.appendChild(inner);
        out.push(inner);
      } else {
        [...part].forEach((ch) => {
          const mask = span("c-mask");
          const c = span("c");
          c.textContent = ch;
          mask.appendChild(c);
          word.appendChild(mask);
          out.push(c);
        });
      }
      frag.appendChild(word);
    });
    return frag;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const clone = (node as Element).cloneNode(false) as Element;
    node.childNodes.forEach((child) => clone.appendChild(walk(child, out, mode)));
    return clone;
  }
  return node.cloneNode(true);
}

export function split(el: HTMLElement, mode: "chars" | "words" = "chars"): HTMLElement[] {
  if (el.dataset.orig === undefined) el.dataset.orig = el.innerHTML;
  const label = el.textContent || "";
  const out: HTMLElement[] = [];
  const frag = document.createDocumentFragment();
  el.childNodes.forEach((n) => frag.appendChild(walk(n, out, mode)));
  el.innerHTML = "";
  el.appendChild(frag);
  el.setAttribute("aria-label", label);
  el.querySelectorAll(".w").forEach((w) => w.setAttribute("aria-hidden", "true"));
  return out;
}

export function restoreSplit(el: HTMLElement) {
  if (el.dataset.orig !== undefined) {
    el.innerHTML = el.dataset.orig;
    delete el.dataset.orig;
    el.removeAttribute("aria-label");
  }
}
