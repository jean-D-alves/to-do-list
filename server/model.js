import sqlite3 from "sqlite3";
import { open } from "sqlite";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

async function opendb() {
  return open({
    filename: "./server/mydb.sqlite",
    driver: sqlite3.Database,
  });
}

async function initDb() {
  const db = await opendb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      user TEXT NOT NULL,
      date TEXT,
      done INTEGER DEFAULT 0
    )`);
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);

  return db;
}

app.use(async (req, res, next) => {
  req.db = await opendb();
  next();
});

app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await req.db.get("SELECT * FROM tasks WHERE id = ?", [id]);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  const { user, done } = req.query;

  try {
    let query = "SELECT * FROM tasks WHERE 1=1 ";
    const params = [];

    if (user) {
      query += "AND user = ? ";
      params.push(user);
    }
    if (done !== undefined) {
      const doneValue = done === "true" || done === "1" ? 1 : 0;
      query += "AND done = ? ";
      params.push(doneValue);
    }

    const tasks = await req.db.all(query, params);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title, description, user, date, done } = req.body;
    const result = await req.db.run(
      "INSERT INTO tasks (title, description, user, date, done) VALUES (?, ?, ?, ?, ?)",
      [title, description, user, date, done ? 1 : 0]
    );
    res.status(201).json({ id: result.lastID, title, description, user, date, done });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { done, title, description } = req.body;

  try {
    if (done !== undefined) {
      await req.db.run("UPDATE tasks SET done = ? WHERE id = ?", [done, id]);
    }
    if (title !== undefined && description !== undefined) {
      await req.db.run("UPDATE tasks SET title = ?, description = ? WHERE id = ?", [title, description, id]);
    }
    const updatedTask = await req.db.get("SELECT * FROM tasks WHERE id = ?", [id]);
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.run("DELETE FROM tasks WHERE id = ?", [id]);
    res.status(200).json({ message: "Task deletada com sucesso", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await req.db.get(
      "SELECT * FROM users WHERE password = ? AND email = ?",
      [password, email]
    );
    if (!user) {
      return res.status(401).json({ error: "password or email invalid" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initDb().then(() => {
  app.listen(5000, () =>
    console.log(`Servidor rodando em http://localhost:5000`)
  );
});
