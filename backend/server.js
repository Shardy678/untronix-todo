const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

let tasks = [];
let nextId = 1;

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const newTask = { id: nextId++, ...req.body };
  tasks.push(newTask);
  io.emit("taskAdded", newTask);
  res.status(201).json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  io.emit("taskDeleted", taskId);
  res.status(204).send();
});

app.put("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = { id: taskId, ...req.body };
  tasks = tasks.map((task) => (task.id === taskId ? updatedTask : task));
  io.emit("taskToggled", updatedTask);
  res.json(updatedTask);
});

server.listen(3000, () => {
  console.log(`Сервер запущен на порте 3000`);
});
