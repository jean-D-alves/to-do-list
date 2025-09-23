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
            date text,
            done INTEGER DEFAULT 0
        )`);
  return db;
}
app.use(async (req, res, next) => {
  req.db = await opendb();
  next();
});
app.get("/get-tasks/:id", async (req,res)=>{
  const {id} = req.params
  try{
    const task = await req.db.get("SELECT * FROM tasks WHERE id = ?",[id])
    res.status(200).json(task)
  }catch(err){
    res.status(500).json({eroor : err.message})
  }
})
app.get("/get-task", async (req, res) => {
  const { user, done } = req.query;

  try {
    let query = "SELECT * FROM tasks WHERE 1=1 ";
    const params = [];

    if (user) {
      query += "AND user = ? ";
      params.push(user);
    }
    let doneValue = null;
    if (done !== undefined) {
      doneValue = done === "true" || done === "1" ? 1 : 0;
      query += "AND done = ? ";
      params.push(doneValue);
    }
    const task = await req.db.all(query, params);
    res.status(200).json(task);
    return task;
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, user, date, done } = req.body;
    const result = await req.db.run(
      "INSERT INTO tasks (title,description, user,date, done) VALUES (?,?,?,?,?)",
      [title, description, user, date || null, done ? 1 : 0]
    );
    res.status(201).json({ id: result.lastID, title, description, user, done });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { done, title, description } = req.body;

  if (done !== undefined) {
    try {
      const db = await opendb();
      await db.run("UPDATE tasks SET done = ? WHERE id = ?", [done, id]);
      const updateDoneTask = await db.get("SELECT * FROM tasks WHERE id = ?", [id]);
      res.status(200).json(updateDoneTask);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  }
  if(title !== undefined && description !== undefined){
    const db = await opendb()
    await db.run("UPDATE tasks SET title = ?, description = ? WHERE id = ?",[title,description,id])
    const updateTask = await db.get("SELECT * FROM tasks WHERE id = ?",[id])
    res.status(200).json(updateTask)
  } 
});
app.delete("/tasks/:id",async (req,res)=>{
  const {id} = req.params
  try{
    const db = await opendb()
    await db.run("DELETE FROM tasks WHERE id = ?",[id])
    const deleteTask = await db.get("SELECT * FROM tasks WHERE id = ?",[id])
    res.status(200).json(deleteTask)
    console.log("deu bom")
  }catch(err){
    res.status(500).json({erro: err.message})
  }
})
initDb().then(() => {
  app.listen(5000, () =>
    console.log(`Servidor rodando em http://localhost:5000`)
  );
});