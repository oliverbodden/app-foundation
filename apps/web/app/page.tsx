"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { addTodo, listTodos, makeSupabase, toggleTodo, type Todo } from "@app/shared";

export default function Home() {
  const db = useMemo(
    () =>
      makeSupabase(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
    []
  );
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    if (!db) return;
    try {
      setTodos(await listTodos(db));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!db) return;
    setError(null);
    try {
      await addTodo(db, title);
      setTitle("");
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main>
      <h1>App Foundation</h1>
      <p className="muted">Web · Next.js — same data and logic as the mobile app.</p>

      {!db ? (
        <p className="muted">
          Supabase isn&apos;t configured yet. Copy <code>apps/web/.env.example</code> to{" "}
          <code>.env.local</code> and fill it in.
        </p>
      ) : (
        <>
          <form onSubmit={onSubmit}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a todo"
            />
            <button type="submit">Add</button>
          </form>
          {error && <p className="error">{error}</p>}
          <ul>
            {todos.map((t) => (
              <li
                key={t.id}
                className={t.done ? "done" : ""}
                onClick={async () => {
                  await toggleTodo(db, t);
                  await refresh();
                }}
              >
                {t.title}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
