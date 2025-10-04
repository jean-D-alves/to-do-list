import sqlite3 from "sqlite3";
import { open } from "sqlite";
import jwt from "jsonwebtoken";
import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const SECRET = "chave";

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
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);

  return db;
}

app.use(async (req, res, next) => {
  req.db = await opendb();
  next();
});

app.get("/tasks/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await req.db.get(
      "SELECT * FROM tasks WHERE id = ? AND user = ?",
      [id, req.user.id]
    );
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", auth, async (req, res) => {
  const { done } = req.query;

  try {
    let query = "SELECT * FROM tasks WHERE user = ?";
    const params = [req.user.id];

    if (done !== undefined) {
      const doneValue = done === "true" || done === "1" ? 1 : 0;
      query += " AND done = ?";
      params.push(doneValue);
    }

    const tasks = await req.db.all(query, params);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/tasks", auth, async (req, res) => {
  try {
    const { title, description, date, done } = req.body;
    const result = await req.db.run(
      "INSERT INTO tasks (title, description, user, date, done) VALUES (?, ?, ?, ?, ?)",
      [title, description, req.user.id, date, done ? 1 : 0]
    );
    res.status(201).json({
      id: result.lastID,
      title,
      description,
      user: req.user.id,
      date,
      done,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/tasks/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { done, title, description } = req.body;

  try {
    if (done !== undefined) {
      await req.db.run("UPDATE tasks SET done = ? WHERE id = ? AND user = ?", [
        done,
        id,
        req.user.id,
      ]);
    }
    if (title !== undefined && description !== undefined) {
      await req.db.run(
        "UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user = ?",
        [title, description, id, req.user.id]
      );
    }
    const updatedTask = await req.db.get(
      "SELECT * FROM tasks WHERE id = ? AND user = ?",
      [id, req.user.id]
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/tasks/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    await req.db.run("DELETE FROM tasks WHERE id = ? AND user = ?", [
      id,
      req.user.id,
    ]);
    res.status(200).json({ message: "Task deletada com sucesso", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "token not exited" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "token not autentication" });
    }

    req.user = user;
    next();
  });
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await req.db.get("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    const parcePassword = await bcrypt.compare(password, user.password);
    if (!parcePassword) {
      return res.status(400).json({ error: "password or email invalid" });
    }
    const { password: _, ...userData } = user;
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/userData", auth, async (req, res) => {
  try {
    const user = await req.db.get(
      "SELECT * FROM users WHERE id = ?",[req.user.id]
    );
    const {password:_,...UserData} = user
    res.status(200).json(UserData);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
});
app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await req.db.run(
      "INSERT INTO users (name, email, password) VALUES (?,?,?)",
      [name, email, hashPassword]
    );
    if (!user) {
      return res
        .status(401)
        .json({ error: "erro in registration please try again" });
    }
    res.status(201).json({
      id: user.lastID,
      name,
      email,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

initDb().then(() => {
  app.listen(5000, () =>
    console.log(`Servidor rodando em http://localhost:5000`)
  );
});
