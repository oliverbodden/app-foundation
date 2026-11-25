import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { addTodo, listTodos, makeSupabase, toggleTodo, type Todo } from "@app/shared";

export default function Home() {
  const db = useMemo(
    () =>
      makeSupabase(
        process.env.EXPO_PUBLIC_SUPABASE_URL,
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
        // No sign-in yet. When you add auth, install AsyncStorage and pass it as auth.storage.
        { auth: { persistSession: false } }
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

  async function onAdd() {
    if (!db) return;
    setError(null);
    try {
      await addTodo(db, title);
      setTitle("");
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (!db) {
    return (
      <View style={styles.container}>
        <Text style={styles.muted}>
          Supabase isn't configured yet. Copy apps/mobile/.env.example to .env and fill it in.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.muted}>Mobile · Expo — same data and logic as the web app.</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Add a todo"
          onSubmitEditing={onAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.button} onPress={onAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={todos}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            onPress={async () => {
              await toggleTodo(db, item);
              await refresh();
            }}
          >
            <Text style={item.done ? styles.done : undefined}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f6f7f9" },
  muted: { color: "#666", marginBottom: 16 },
  row: { flexDirection: "row", gap: 8, marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: { backgroundColor: "#111", borderRadius: 8, paddingHorizontal: 16, justifyContent: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  item: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 8 },
  done: { textDecorationLine: "line-through", color: "#999" },
  error: { color: "#b00020", marginBottom: 8 },
});
