import {
  deleteTask,
  getAllTask,
  getTaskId,
  opendb,
  initDb,
  patchTask,
  postTask,
  DashBoard,
} from "../models/tasks.js";

export async function ControltaskId(req, res) {
  const { id } = req.params;
  try {
    const task = await getTaskId(req.db, id, req.user.id);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function controlTask(req, res) {
  const { done } = req.query;

  try {
    const tasks = await getAllTask(req.db, req.user.id, done);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function controlPostTask(req, res) {
  try {
    const { title, description, date, done } = req.body;
    const result = await postTask(
      req.db,
      title,
      description,
      req.user.id,
      date,
      done
    );
    res.status(201).json({
      id: result.lastID,
      title,
      description,
      user: req.userId,
      date,
      done,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function controlPatchTask(req, res) {
  const { id } = req.params;

  try {
    const updatedTask = await patchTask(req.db, id, req.user.id, req.body);
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function controlDeleteTask(req, res) {
  const { id } = req.params;
  try {
    deleteTask(req.db, id, req.user.id);
    res.status(200).json({ message: "Task deletada com sucesso", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function controlDashboard(req,res) {
  try{
    const dashboard = await DashBoard(req.db,req.user.id)
    res.status(200).json(dashboard)
  }catch(err){
    res.status(200).json({erro: err.message})
  }
}