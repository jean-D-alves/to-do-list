import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function opendb() {
  return open({
    filename: "./server/mydb.sqlite",
    driver: sqlite3.Database,
  });
}

export async function initDb() {
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

export async function getTaskId(db,id,userId) {
  const task = await db.get(
    "SELECT * FROM tasks WHERE id = ? AND user = ?",
    [id, userId]
  );
  return task;
}

export async function getAllTask(db, userId, done) {
  let query = "SELECT * FROM tasks WHERE user = ?";
  const params = [userId];

  if (done !== undefined) {
    const doneValue = done === "true" || done === "1" ? 1 : 0;
    query += " AND done = ?";
    params.push(doneValue);
  }
  const tasks = await db.all(query, params);
  return tasks;
}

export async function postTask(db, title, description, userId, date, done) {
  const result = await db.run(
    "INSERT INTO tasks (title, description, user, date, done) VALUES (?, ?, ?, ?, ?)",
    [title, description, userId, date, done ? 1 : 0]
  );
  return result;
}

export async function patchTask(db, id, userId, { done, title, description }) {
  if (done !== undefined) {
    await db.run("UPDATE tasks SET done = ? WHERE id = ? AND user = ?", [
      done,
      id,
      userId,
    ]);
  }
  if (title !== undefined && description !== undefined) {
    await db.run(
      "UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user = ?",
      [title, description, id, userId]
    );
  }
  const updatedTask = await db.get(
    "SELECT * FROM tasks WHERE id = ? AND user = ?",
    [id, userId]
  );

  return updatedTask;
}

export async function deleteTask(db,id,userId) {
      await db.run("DELETE FROM tasks WHERE id = ? AND user = ?", [
      id,
      userId,
    ]);
}