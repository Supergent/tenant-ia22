"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@jn7ed9ecyrkk0hy21eehbbj6bx7sk268/components";

interface Todo {
  _id: any;
  text: string;
  isCompleted: boolean;
  createdAt: number;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: any) => void;
  onDelete: (id: any) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className="flex items-center gap-3 p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors group"
        >
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => onToggle(todo._id)}
            className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
          />
          <span
            className={`flex-1 cursor-pointer ${
              todo.isCompleted
                ? "line-through text-text-secondary"
                : "text-text-primary"
            }`}
            onClick={() => onToggle(todo._id)}
          >
            {todo.text}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo._id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-danger hover:text-danger hover:bg-danger/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
