import jwt from "jsonwebtoken";

const SECRET = "chave";

export function auth(req, res, next) {
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