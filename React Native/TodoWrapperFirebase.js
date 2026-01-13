import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet 
} from "react-native";
import { 
  collection, addDoc, deleteDoc, updateDoc, 
  onSnapshot, query, where, orderBy, doc 
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

export default function TodoWrapperFirebase() {
  const { currentUser, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // 🔵 Calendar state
  const [dueDate, setDueDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // 🔵 Prioritate
  const [priority, setPriority] = useState("LOW");

  const [loading, setLoading] = useState(true);

  const todosRef = collection(db, "tasks");

    useEffect(() => {
        // Verificăm dacă avem user ȘI dacă acesta are un UID valid
        if (!currentUser?.uid) return;

        const q = query(
            todosRef,
            where("uid", "==", currentUser.uid)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const items = [];
            snapshot.forEach((d) => items.push({ id: d.id, ...d.data() }));
            setTodos(items);
            setLoading(false);
        }, (error) => {
            // ADAUGĂ ASTA: te va ajuta să vezi exact de ce plânge Firebase
            console.log("Eroare detaliată Firestore:", error.message);
        });

        return unsub;
    }, [currentUser]);

  // 🔵 Formatăm data pentru firestore
  function formatDate(d) {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  async function handleAdd() {
    if (!newTodo.trim()) return;

    await addDoc(todosRef, {
      text: newTodo.trim(),
      completed: false,
      uid: currentUser.uid,
      createdAt: Date.now(),
      priority: priority,
      dueDate: dueDate ? formatDate(dueDate) : null,
      status: "Pending",
    });

    // Reset
    setNewTodo("");
    setDueDate(null);
    setPriority("LOW");
  }

  function getStatus(todo) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!todo.dueDate) return "Pending";

    const due = new Date(todo.dueDate + "T00:00:00"); // timezone fix

    if (todo.status === "Cancelled") return "Cancelled";
    if (todo.completed) return "Completed";
    if (due < today) return "Overdue";
    if (due > today) return "Upcoming";
    return "Pending";
  }

  async function markDone(todo) {
    await updateDoc(doc(db, "tasks", todo.id), {
      completed: true,
      status: "Completed",
    });
  }

  async function cancelTask(todo) {
    await updateDoc(doc(db, "tasks", todo.id), {
      status: "Cancelled",
    });
  }

  async function resetTask(todo) {
    await updateDoc(doc(db, "tasks", todo.id), {
      completed: false,
      status: "Pending",
    });
  }

  async function deleteTodo(id) {
    await deleteDoc(doc(db, "tasks", id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* 🔵 ADĂUGĂ UN TASK */}
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Adaugă un task</Text>

        <TextInput
          style={styles.input}
          placeholder="Nume task"
          placeholderTextColor="#aaa"
          value={newTodo}
          onChangeText={setNewTodo}
        />

        {/* 🔵 Selectare dată */}
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={styles.input}
        >
          <Text style={{ color: dueDate ? "#fff" : "#aaa" }}>
            {dueDate ? formatDate(dueDate) : "Alege deadline din calendar"}
          </Text>
        </TouchableOpacity>

        {showCalendar && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selected) => {
              setShowCalendar(false);
              if (selected) setDueDate(selected);
            }}
          />
        )}

        {/* 🔵 Prioritate */}
        <Text style={styles.label}>Prioritate</Text>
        <View style={styles.priorityRow}>
          {["LOW", "MEDIUM", "HIGH"].map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPriority(p)}
              style={[
                styles.priorityBtn,
                priority === p && styles.prioritySelected,
              ]}
            >
              <Text
                style={{
                  color: priority === p ? "#000" : "#fff",
                  fontWeight: "600",
                }}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add task</Text>
        </TouchableOpacity>
      </View>

      {/* 🔵 LISTA DE TASKURI */}
      <Text style={styles.subtitle}>Task-urile tale</Text>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
        renderItem={({ item }) => {
          const status = getStatus(item);

          return (
            <View style={styles.todoItem}>
              <Text style={styles.todoText}>{item.text}</Text>
              <Text style={styles.smallText}>Due: {item.dueDate || "-"}</Text>
              <Text style={styles.smallText}>Priority: {item.priority}</Text>
              <Text style={styles.smallText}>Status: {status}</Text>

              {/* ACTION BUTTONS */}
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => markDone(item)}
                >
                  <Text style={styles.btnText}>Done</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => cancelTask(item)}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => resetTask(item)}
                >
                  <Text style={styles.btnText}>Reset</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteTodo(item.id)}
                >
                  <Text style={styles.btnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#1A1A40",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  logoutBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  box: {
    marginTop: 20,
    backgroundColor: "#2A2A5A",
    padding: 20,
    borderRadius: 12,
  },
  boxTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1A1A40",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#8758ff",
  },
  label: {
    color: "#aaa",
    marginBottom: 5,
  },
  priorityRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 10,
  },
  priorityBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#444",
  },
  prioritySelected: {
    backgroundColor: "#FFD700",
  },
  addBtn: {
    backgroundColor: "#8758ff",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  addBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  subtitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 25,
  },
  todoItem: {
    backgroundColor: "#8758ff",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  todoText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  smallText: {
    color: "#f1f1f1",
    fontSize: 14,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  doneBtn: { backgroundColor: "green", padding: 6, borderRadius: 6 },
  cancelBtn: { backgroundColor: "orange", padding: 6, borderRadius: 6 },
  resetBtn: { backgroundColor: "skyblue", padding: 6, borderRadius: 6 },
  deleteBtn: { backgroundColor: "red", padding: 6, borderRadius: 6 },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
