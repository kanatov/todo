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
    this.initNewTaskInput();
    this.initList();
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

  // Add item
  async add(text) {
    await fetch(this.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ val: text }),
    }).then(() => this.fetchAll());
  }

  // Edit item
  async edit(id) {
    console.log("edit", id);
  }

  // Delete item
  async delete(id) {
    await fetch(`${this.API_URL}/${id}`, { method: "DELETE" }).then(() =>
      this.fetchAll()
    );
  }

  // Create TODO Item
  createItem(params) {
    const text = getNode({ tag: "p", children: params.text });
    const edit = getNode({
      tag: "button",
      attributes: { type: "button", "data-action": "edit" },
      children: "Edit",
    });
    const del = getNode({
      tag: "button",
      children: "Delete",
      attributes: { type: "button", "data-action": "delete" },
    });
    params.children = [text, edit, del];
    return getNode(params);
  }

  // Refresh TODO list
  refreshList() {
    let list = [getNode({ tag: "p", children: "No tasks" })];
    const tasks = Object.entries(this.data).map(([key, value]) =>
      this.createItem({
        tag: "li",
        attributes: {
          id: `list-item-${key}`,
          "data-id": key,
          class: "todo-item",
        },
        text: value,
      })
    );
    const ul = getNode({ tag: "ul", children: tasks });

    tasks.length && (list = [ul]);
    this.LIST.replaceChildren(...list);
  }

  // New task input
  initNewTaskInput() {
    // Text input
    const input = getNode({
      tag: "input",
      attributes: {
        type: "text",
        placeholder: "Enter new task",
        id: "newTask",
      },
    });
    const inputHandler = (e) => {
      e.preventDefault();
      const newValue = e.target.value.slice(0, 20);
      e.target.value = newValue.replace(/[^a-z ]/gi, "");
    };
    input.addEventListener("input", inputHandler);

    // Button input
    const inputButton = getNode({
      tag: "button",
      attributes: { type: "button" },
      children: "Add",
    });
    const inputButtonHandler = (e) => {
      e.preventDefault();
      const val = document.getElementById("newTask").value.trim();
      if (val.length) this.add(val);
    };
    inputButton.addEventListener("click", inputButtonHandler);

    const newTaskInput = getNode({
      tag: "div",
      children: [input, inputButton],
    });
    this.ROOT_NODE.appendChild(newTaskInput);
  }

  // Init TODO app
  initList() {
    this.LIST = getNode({ tag: "section", attributes: { id: "list" } });

    // Click event
    const listClickHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target?.dataset?.action === "edit")
        this.edit.bind(this)(e.target?.parentElement?.dataset?.id);
      if (e.target?.dataset?.action === "delete")
        this.delete.bind(this)(e.target?.parentElement?.dataset?.id);
    };
    this.LIST.addEventListener("click", listClickHandler);

    // Fetch data and publish node
    this.fetchAll();

    // Making list public
    this.ROOT_NODE.appendChild(this.LIST);
  }
}
