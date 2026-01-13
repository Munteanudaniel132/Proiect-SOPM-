// TodoScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

export default function TodoScreen() {
  const { currentUser, logout } = useAuth();

  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("low"); // "low" | "high"
  const [dueDate, setDueDate] = useState(null);    // Date | null
  const [showPicker, setShowPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const tasksRef = collection(db, "tasks");

  // citim taskurile user-ului curent
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      tasksRef,
      where("uid", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTodos(list);
      setLoading(false);
    });

    return unsub;
  }, [currentUser]);

  function getStatusLabel(todo) {
    const now = Date.now();
    if (
      todo.dueDate &&
      todo.dueDate < now &&
      todo.status !== "completed" &&
      todo.status !== "canceled"
    ) {
      return "Overdue";
    }
    if (todo.status === "completed") return "Completed";
    if (todo.status === "canceled") return "Canceled";
    return "Upcoming";
  }

  async function handleSave() {
    if (!text.trim()) return;
    const payload = {
      text: text.trim(),
      uid: currentUser.uid,
      createdAt: Date.now(),
      priority,
      status: "upcoming", // default; se transforma in Overdue automat
      dueDate: dueDate ? dueDate.getTime() : null,
    };

    if (editingId) {
      await updateDoc(doc(db, "tasks", editingId), payload);
    } else {
      await addDoc(tasksRef, payload);
    }

    // reset form
    setText("");
    setPriority("low");
    setDueDate(null);
    setEditingId(null);
  }

  function startEdit(todo) {
    setText(todo.text);
    setPriority(todo.priority || "low");
    setDueDate(todo.dueDate ? new Date(todo.dueDate) : null);
    setEditingId(todo.id);
  }

  async function toggleCompleted(todo) {
    const newStatus =
      todo.status === "completed" ? "upcoming" : "completed";
    await updateDoc(doc(db, "tasks", todo.id), { status: newStatus });
  }

  async function cancelTask(todo) {
    await updateDoc(doc(db, "tasks", todo.id), { status: "canceled" });
  }

  async function deleteTask(id) {
    await deleteDoc(doc(db, "tasks", id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* formular add / edit */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Task..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
        />

        <View style={styles.row}>
          {/* prioritate mică / mare cu steluță */}
          <TouchableOpacity
            style={[
              styles.priorityBtn,
              priority === "low" && styles.prioritySelected,
            ]}
            onPress={() => setPriority("low")}
          >
            <Text style={styles.priorityText}>⭐ mică</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.priorityBtn,
              priority === "high" && styles.prioritySelected,
            ]}
            onPress={() => setPriority("high")}
          >
            <Text style={styles.priorityText}>⭐⭐ mare</Text>
          </TouchableOpacity>
        </View>

        {/* data limită */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>
              {dueDate ? dueDate.toLocaleDateString() : "Alege deadline"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>
              {editingId ? "Salvează" : "Adaugă"}
            </Text>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowPicker(false);
              if (date) setDueDate(date);
            }}
          />
        )}
      </View>

      {loading && <Text style={{ color: "#fff" }}>Se încarcă...</Text>}

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", marginTop: 20 }}
        renderItem={({ item }) => {
          const statusLabel = getStatusLabel(item);
          const isOverdue = statusLabel === "Overdue";
          return (
            <View style={styles.todoItem}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => toggleCompleted(item)}
                onLongPress={() => startEdit(item)}
              >
                <Text
                  style={[
                    styles.todoText,
                    item.status === "completed" && styles.completed,
                    item.status === "canceled" && styles.canceled,
                  ]}
                >
                  {item.text}{" "}
                  {item.priority === "high" ? "⭐⭐" : "⭐"}
                  {"  "}
                  <Text
                    style={[
                      styles.status,
                      isOverdue && styles.overdue,
                    ]}
                  >
                    {statusLabel}
                  </Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => cancelTask(item)}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.actionText}>🗑</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A40",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  logoutBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#2A2A5A",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#1A1A40",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  priorityBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#8758ff",
    marginRight: 8,
  },
  prioritySelected: {
    backgroundColor: "#8758ff",
  },
  priorityText: {
    color: "#fff",
    fontSize: 14,
  },
  dateBtn: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#1A1A40",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dateText: { color: "#fff" },
  saveBtn: {
    backgroundColor: "#8758ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
  todoItem: {
    backgroundColor: "#8758ff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  todoText: {
    color: "#fff",
    fontSize: 15,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#c5aeff",
  },
  canceled: {
    color: "#ffb3b3",
  },
  status: {
    fontSize: 13,
  },
  overdue: {
    color: "#ffcc00",
  },
  actionText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 14,
  },
});
