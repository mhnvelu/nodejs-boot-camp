"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
let todos = [];
router.get("/", (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post("/todo", (req, res, next) => {
    const body = req.body;
    const newTodo = {
        id: new Date().toISOString(),
        text: body.text,
    };
    todos.push(newTodo);
    return res.status(201).json({ message: "Created Todo", todos: todos });
});
router.put("/todo/:todoId", (req, res, next) => {
    const params = req.params;
    const body = req.body;
    const todoIndex = todos.findIndex((todoItem) => todoItem.id === params.todoId);
    if (todoIndex >= 0) {
        todos[todoIndex] = Object.assign(Object.assign({}, todos[todoIndex]), { text: body.text });
        return res.status(200).json({ message: "Updated Todo", todos: todos });
    }
    res.status(404).json({ message: "Invalid todoId" });
});
router.delete("/todo/:todoId", (req, res, next) => {
    const todoId = req.params.todoId;
    todos = todos.filter((todoItem) => todoItem.id !== todoId);
    return res.status(200).json({ message: "Deleted Todo", todos: todos });
});
exports.default = router;
