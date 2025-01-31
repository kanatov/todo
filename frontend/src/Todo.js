import { getNode } from "./tools/getNode";

export class Todo {
  API_URL = "";
  ROOT_NODE = null;
  LIST = null;
  data = {};

  // Constructor
  constructor({ apiUrl, rootNode }) {
    this.API_URL = apiUrl;
    this.ROOT_NODE = rootNode;
    this.init();
  }
  async fetchAll() {
    const setData = (data) => {
      this.data = data;
      this.refreshList();
    };
    try {
      await fetch(this.API_URL)
        .then((response) => response.json())
        .then((d) => setData(d.result));
    } catch (e) {
      console.error("# Failed: fetchAll()\n", e);
    }
  }

  // Create TODO Item
  createItem(params) {
    const text = getNode({ tag: "p", children: [params.text] });
    const edit = getNode({
      tag: "button",
      type: "button",
      children: ["Edit"],
      data: { action: "edit" },
    });
    params.children = [text, edit];
    return getNode(params);
  }
  edit(id) {
    console.log("edit", id);
  }

  // Refresh TODO list
  refreshList() {
    let list = [getNode({ tag: "p", children: ["No tasks"] })];
    const tasks = Object.entries(this.data).map(([key, value]) =>
      this.createItem({
        tag: "li",
        id: `list-item-${key}`,
        text: value,
        data: { id: key },
      })
    );
    const ul = getNode({ tag: "ul", children: tasks });

    tasks.length && (list = [ul]);
    this.LIST.replaceChildren(...list);
  }

  // Init TODO app
  init() {
    this.LIST = getNode({ tag: "section", id: "list" });

    // Click event
    const listClickHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target?.dataset?.action === "edit")
        this.edit.bind(this)(e.target?.parentElement?.dataset?.id);
    };
    this.LIST.addEventListener("click", listClickHandler);

    // Fetch data and publish node
    this.fetchAll();
    this.ROOT_NODE.appendChild(this.LIST);
  }
}
