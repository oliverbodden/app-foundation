import type { SupabaseClient } from "@supabase/supabase-js";
import type { Todo } from "./types";

export function validateTitle(title: string): string | null {
  const t = title.trim();
  if (!t) return "Title can't be empty";
  if (t.length > 200) return "Keep it under 200 characters";
  return null;
}

export async function listTodos(db: SupabaseClient): Promise<Todo[]> {
  const { data, error } = await db
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Todo[];
}

export async function addTodo(db: SupabaseClient, title: string): Promise<Todo> {
  const problem = validateTitle(title);
  if (problem) throw new Error(problem);
  const { data, error } = await db
    .from("todos")
    .insert({ title: title.trim() })
    .select()
    .single();
  if (error) throw error;
  return data as Todo;
}

export async function toggleTodo(db: SupabaseClient, todo: Todo): Promise<void> {
  const { error } = await db.from("todos").update({ done: !todo.done }).eq("id", todo.id);
  if (error) throw error;
}
