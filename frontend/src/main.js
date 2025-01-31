import "./style.css";
import { Todo } from "./Todo";
document.getElementById("app").innerHTML =
  "<h1>Todo</h1><main id='todo'></main>";
new Todo({
  apiUrl: "http://localhost:3100/api/todo",
  rootNode: document.getElementById("todo"),
});
