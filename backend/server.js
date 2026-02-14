const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// Root Route
app.get('/', (req, res) => {
  res.send("Todo API is running");
});

// Show environment variables (for debugging purposes)
app.get('/env', (req, res) => {
  res.json({
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    MONGO_URL: process.env.MONGO_URL
  });
});

// CRUD Routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save();
  res.json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTodo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

console.log("Hello from the backend!");
console.log("My name is Karan Singh Bhandari");
console.log("I am a software developer with a passion for building scalable applications.");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));