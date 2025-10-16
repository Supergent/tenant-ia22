"use client";

import { useQuery, useMutation } from "convex/react";
import { useAuthClient } from "@convex-dev/better-auth/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { TodoList } from "./todo-list";
import { TodoInput } from "./todo-input";
import { AuthForm } from "./auth-form";
import { Button } from "@jn7ed9ecyrkk0hy21eehbbj6bx7sk268/components";
import { LogOut, CheckCircle2 } from "lucide-react";

export function TodoApp() {
  const { data: session } = useAuthClient();
  const todos = useQuery(api.endpoints.todos.list);
  const stats = useQuery(api.endpoints.todos.stats);
  const createTodo = useMutation(api.endpoints.todos.create);
  const toggleTodo = useMutation(api.endpoints.todos.toggle);
  const deleteTodo = useMutation(api.endpoints.todos.remove);
  const { signOut } = useAuthClient();

  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const handleCreateTodo = async (text: string) => {
    setIsCreating(true);
    try {
      await createTodo({ text });
    } catch (error) {
      console.error("Failed to create todo:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleTodo = async (id: any) => {
    try {
      await toggleTodo({ id });
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleDeleteTodo = async (id: any) => {
    try {
      await deleteTodo({ id });
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Show auth form if not signed in
  if (!session) {
    return <AuthForm />;
  }

  // Filter todos
  const filteredTodos = todos?.filter((todo) => {
    if (filter === "active") return !todo.isCompleted;
    if (filter === "completed") return todo.isCompleted;
    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-surface rounded-lg shadow-lg p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              My Todos
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-muted rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-text-secondary">Total</div>
            </div>
            <div className="bg-muted rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-success">{stats.active}</div>
              <div className="text-xs text-text-secondary">Active</div>
            </div>
            <div className="bg-muted rounded-md p-3 text-center">
              <div className="text-2xl font-bold text-text-secondary">
                {stats.completed}
              </div>
              <div className="text-xs text-text-secondary">Done</div>
            </div>
          </div>
        )}

        {/* Input */}
        <TodoInput onSubmit={handleCreateTodo} isCreating={isCreating} />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>

        {/* Todo List */}
        <TodoList
          todos={filteredTodos || []}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />

        {filteredTodos?.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-lg">No todos yet!</p>
            <p className="text-sm mt-1">Add one above to get started ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}
