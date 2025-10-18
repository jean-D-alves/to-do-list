import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { getUser, getUserByid, postUser } from "../models/users.js";

dotenv.config()

const SECRET = process.env.SECRETJWT

export async function controlLoginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await getUser(req.db, email);
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
}

export async function controlUserData(req, res) {
  try {
    const user = await getUserByid(req.db, req.user.id);
    const { password: _, ...UserData } = user;
    res.status(200).json(UserData);
  } catch (erro) {
    return res.status(500).json({ error: erro.message });
  }
}

export async function controlRegistedUser(req, res) {
  const { name, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await postUser(req.db, name, email, hashPassword);
    if (!user) {
      return res
        .status(401)
        .json({ error: "erro in registration please try again" });
    }
    const token = jwt.sign({ id: user.lastID, name, email }, SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });
    res.status(201).json({
      id: user.lastID,
      name,
      email,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
export async function controlCheckToken(req, res) {
  try {
    const user = await getUserByid(req.db, req.user.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const { password, ...userData } = user;
    res.status(200).json({ user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
