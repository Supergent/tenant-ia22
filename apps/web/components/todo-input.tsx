"use client";

import { useState } from "react";
import { Input, Button } from "@jn7ed9ecyrkk0hy21eehbbj6bx7sk268/components";
import { Plus } from "lucide-react";

interface TodoInputProps {
  onSubmit: (text: string) => void;
  isCreating: boolean;
}

export function TodoInput({ onSubmit, isCreating }: TodoInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isCreating}
        className="flex-1"
      />
      <Button type="submit" disabled={isCreating || !text.trim()} className="gap-2">
        <Plus className="w-4 h-4" />
        Add
      </Button>
    </form>
  );
}
