import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function opendb() {
  return open({
    filename: "./server/mydb.sqlite",
    driver: sqlite3.Database,
  });
}
export async function getUser(db, email) {
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  return user;
}
export async function getUserByid(db, id) {
  const user = await db.get("SELECT * FROM users WHERE id = ?", [id]);
  return user;
}
export async function postUser(db,name,email,hashPassword) {
  const user = await db.run(
    "INSERT INTO users (name, email, password) VALUES (?,?,?)",
    [name, email, hashPassword]
  );
  return user
}
