import { getNode } from "./tools/getNode";

export class Todo {
  API_URL = "";
  ROOT_NODE = null;
  LIST = null;
  data = {};
  constructor({ apiUrl, rootNode }) {
    this.API_URL = apiUrl;
    this.ROOT_NODE = rootNode;
    this.init();
  }
  async fetchAll() {
    try {
      const response = await fetch(this.API_URL);
      const data = await response.json();
      this.setData(data.result);
    } catch (e) {
      console.error("# Failed: getAll()\n", e);
    }
  }
  setData(data) {
    this.data = data;
    this.refreshList();
  }
  init() {
    this.fetchAll();
    this.render();
  }
  refreshList() {
    let list = [getNode({ tag: "p", children: ["No tasks"] })];
    let tasks = Object.entries(this.data).map(([key, value]) =>
      getNode({ tag: "div", id: key, children: [value] })
    );

    tasks.length ? (list = tasks) : null;
    this.LIST.replaceChildren(...list);
  }
  render() {
    let todo = JSON.stringify(this.data);
    this.LIST = getNode({ tag: "section", id: "list" });
    this.refreshList();
    this.ROOT_NODE.appendChild(this.LIST);
  }
}
