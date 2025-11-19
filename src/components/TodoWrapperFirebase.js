// src/components/TodoWrapperFirebase.js
import React, { useEffect, useState } from "react";
import { TodoForm } from "./TodoForm";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
import { useAuth } from "../contexts/AuthContext";
import { auth, db } from "../firebase"; // Asigură-te că db este exportat din firebase.js
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

// Importuri Material UI
import { Container, Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export const TodoWrapperFirebase = () => {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setTodos([]);
      setLoading(false);
      return;
    }

    const todosColRef = collection(db, "users", currentUser.uid, "todos");
    const q = query(todosColRef, orderBy("priority", "desc"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setTodos(items);
      setLoading(false); // S-a terminat încărcarea
    }, err => {
      console.error("onSnapshot error:", err);
      setError("Eroare la încărcarea sarcinilor.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addTodo = async (taskText) => {
    // Logica ta de adăugare rămâne neschimbată...
    if (!currentUser || !taskText.trim()) return; // Adăugat verificare taskText
    const todosColRef = collection(db, "users", currentUser.uid, "todos");
    try {
      await addDoc(todosColRef, {
        task: taskText,
        completed: false,
        priority: false,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Add todo failed:", err);
      setError("Eroare la adăugarea sarcinii.");
    }
  };

  const deleteTodo = async (id) => {
    // Logica ta de ștergere rămâne neschimbată...
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid, "todos", id);
    try {
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Eroare la ștergerea sarcinii.");
    }
  };

  const toggleComplete = async (id) => {
    // Logica ta de toggle complete rămâne neschimbată...
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid, "todos", id);
    const target = todos.find(t => t.id === id);
    if (!target) return;
    try {
      await updateDoc(docRef, { completed: !target.completed });
    } catch (err) {
      console.error("Toggle complete failed:", err);
      setError("Eroare la marcarea sarcinii.");
    }
  };

  const togglePriority = async (id) => {
    // Logica ta de toggle priority rămâne neschimbată...
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid, "todos", id);
    const target = todos.find(t => t.id === id);
    if (!target) return;
    try {
      await updateDoc(docRef, { priority: !target.priority });
    } catch (err) {
      console.error("Toggle priority failed:", err);
      setError("Eroare la marcarea priorității.");
    }
  };

  const startEdit = (id) => {
    setEditingId(id);
  };

  const editTodo = async (id, newTask) => {
    // Logica ta de editare rămâne neschimbată...
    if (!currentUser || !newTask.trim()) return;
    const docRef = doc(db, "users", currentUser.uid, "todos", id);
    try {
      await updateDoc(docRef, { task: newTask });
      setEditingId(null);
    } catch (err) {
      console.error("Edit failed:", err);
      setError("Eroare la editarea sarcinii.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
      alert("Eroare la delogare.");
    }
  };

  // Starea de încărcare (Loading)
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Încărcare sarcini...</Typography>
      </Container>
    );
  }
  
  // Mesaj de eroare
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Interfața principală a listei de sarcini
  return (
    <Container component="main" maxWidth="md" sx={{ mt: 5 }}>
      {/* Header și buton Logout */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          📋 Todo-urile lui {currentUser.email.split('@')[0]}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={logout}
          startIcon={<LogoutIcon />}
        >
          Delogare
        </Button>
      </Box>

      {/* Formularul de Adăugare Task */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <TodoForm addTodo={addTodo} />
      </Paper>

      {/* Lista de Task-uri */}
      <Box className="todo-list">
        {todos.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            🎉 Felicitări! Nu ai sarcini active. Adaugă una mai sus!
          </Alert>
        )}
        {todos.map(todo =>
          editingId === todo.id ? (
            <EditTodoForm key={todo.id} todo={todo} editTodo={editTodo} cancel={() => setEditingId(null)} />
          ) : (
            <Todo
              key={todo.id}
              task={todo}
              deleteTodo={deleteTodo}
              editTodo={startEdit}
              toggleComplete={toggleComplete}
              togglePriority={togglePriority}
            />
          )
        )}
      </Box>
    </Container>
  );
};