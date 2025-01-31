export function getNode({
  tag,
  id,
  type,
  className,
  children = [],
  data = {},
}) {
  const el = document.createElement(tag);
  // ID
  if (id) el.setAttribute("id", id);

  // Class
  if (className) el.setAttribute("class", className);

  // Children
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((c) => {
        if (c instanceof HTMLElement) el.appendChild(c);
        else {
          const text = document.createTextNode(String(c));
          el.appendChild(text);
        }
      });
    } else console.error("getNode: children prop needs to be an Array");
  }

  // Data
  for (const [key, value] of Object.entries(data)) {
    el.dataset[key] = value;
  }

  // Type
  if (type) el.setAttribute("type", type);

  return el;
}
