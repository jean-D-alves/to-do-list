import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("server run in http://localhost:3000/template/index.html");
});
