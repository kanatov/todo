export function getNode({ tag, id, className, children = [] }) {
  const node = document.createElement(tag);
  if (id) node.setAttribute("id", id);
  if (className) node.setAttribute("class", className);
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((c) => {
        if (c instanceof HTMLElement) node.appendChild(c);
        else {
          const text = document.createTextNode(String(c));
          node.appendChild(text);
        }
      });
    } else console.error("getNode: children prop needs to be an Array");
  }
  return node;
}
