import dynamic from "next/dynamic";

const TodoApp = dynamic(() => import("@/components/todo-app").then(mod => mod.TodoApp), { ssr: false });

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <TodoApp />
    </main>
  );
}
