import { Router } from "express";
import { Todo } from "../models/todo";
const router = Router();

let todos: Todo[] = [];
type RequestBody = { text: string };
type RequestParams = { todoId: string };

router.get("/", (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };
  todos.push(newTodo);
  return res.status(201).json({ message: "Created Todo", todos: todos });
});

router.put("/todo/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;
  const body = req.body as RequestBody;
  const todoIndex = todos.findIndex(
    (todoItem) => todoItem.id === params.todoId
  );
  if (todoIndex >= 0) {
    todos[todoIndex] = { ...todos[todoIndex], text: body.text };
    return res.status(200).json({ message: "Updated Todo", todos: todos });
  }

  res.status(404).json({ message: "Invalid todoId" });
});

router.delete("/todo/:todoId", (req, res, next) => {
  const todoId = req.params.todoId;
  todos = todos.filter((todoItem) => todoItem.id !== todoId);
  return res.status(200).json({ message: "Deleted Todo", todos: todos });
});

export default router;
