process.title = "backend";
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const counterNameValidation = require("./tools/counterNameValidation");
const app = express();
const PORT = 3100;

app.use(cors());
app.use(express.json());

// GET counters
const todo = new Map();
todo.set("1", "First task to do");
todo.set("2", "Dishwashing");

app.get("/api/todo", async (req, res) => {
  res.status(200).json({ message: "ok", result: Object.fromEntries(todo) });
});

// GET counter ID
app.get("/api/todo/:id", async (req, res) => {
  const id = req.params.id;
  if (counterNameValidation(id) && todo.has(id))
    res.status(200).json({ message: "ok", result: todo.get(id) });
  else res.status(404).json({ error: `No counters with ID: ${id}` });
});

// POST new counter
app.post("/api/todo", async (req, res) => {
  // const id = crypto.randomBytes(16).toString("hex");
  const { id } = req.body;
  if (!counterNameValidation(id)) {
    res.status(400).json({ error: `Invalid ID name: ${id}` });
    return;
  }
  if (todo.has(id)) {
    res.status(409).json({ error: `Existing counter with ID: ${id}` });
    return;
  }
  todo.set(id, 1);
  res.status(201).json({ message: "ok", result: id });
});

// PUT update to counter
app.put("/api/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { val } = req.body;
  if (!counterNameValidation(id)) {
    res.status(400).json({ error: `Invalid ID name: ${id}` });
    return;
  }
  if (!todo.has(id)) {
    res.status(400).json({ error: `No counters with ID: ${id}` });
    return;
  }
  if (val < 0 || val > 10) {
    res.status(400).json({ error: `Value out of range: ${val}` });
    return;
  }
  todo.set(id, val);
  res.status(202).json({ message: "ok", result: val });
});

// DELETE a counter
app.delete("/api/todo/:id", async (req, res) => {
  const { id } = req.params;
  if (!counterNameValidation(id)) {
    res.status(400).json({ error: `Invalid ID name: ${id}` });
    return;
  }
  if (!todo.has(id)) {
    res.status(400).json({ error: `No counters with ID: ${id}` });
    return;
  }
  todo.delete(id);
  res.status(202).json({ message: "ok", result: id });
});

app.post("/api/exit", async (req, res) => {
  res.send("Bye!");
  server.close(() => {
    console.log("Server terminated.\n");
    process.exit(0);
  });
});

// Bad request handling
app.all("*", function (req, res) {
  res.status(500).json({ error: "Bad request" });
});

const server = app.listen(PORT, async () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
// Exit function for Jest tests
const exit = () => {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server terminated.\n");
    process.exit(0);
  });
});

module.exports = { app, exit };
