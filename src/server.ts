import express from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello, World!" });
});

app.use("/api", protect, router);

app.post("/signup", createNewUser);
app.post("/login", signIn);

app.use((err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ error: "Unauthorized" });
  } else if (err.type === "input") {
    res.status(400).json({ error: "Invalid input" });
  } else {
    res.status(500).json({ error: "Server error" });
  }
});

export default app;
