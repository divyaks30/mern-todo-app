
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-todo-app-red.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");

app.get("/db-status", (req, res) => {
  res.json({
    state: mongoose.connection.readyState,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});