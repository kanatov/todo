export function getNode({ tag = "div", children = [], attributes = {} }) {
  const el = document.createElement(tag);

  // Children
  if (typeof children === "string" || typeof children === "number")
    el.textContent = children;
  else if (Array.isArray(children)) {
    children.forEach((c) => {
      el.appendChild(
        c instanceof HTMLElement ? c : document.createTextNode(String(c))
      );
    });
  }

  // Attributes
  for (const [key, value] of Object.entries(attributes))
    el.setAttribute(key, value);

  return el;
}
