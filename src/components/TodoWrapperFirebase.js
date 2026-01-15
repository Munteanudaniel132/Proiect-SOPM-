// src/components/TodoWrapperFirebase.js
import React, { useEffect, useState } from "react";
import { TodoForm } from "./TodoForm";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
import { useAuth } from "../contexts/AuthContext";
import { auth, db } from "../firebase"; 
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
import { Container, Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
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
      setLoading(false); 
    }, err => {
      console.error("--- EROARE CRITICĂ FIRESTORE (Real):", err);
      setError("Eroare la încărcarea sarcinilor.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ==================== FUNCȚII TODO ====================
  const addTodo = async (taskText, startDate, endDate) => {
    if (!currentUser || !taskText.trim() || !startDate || !endDate) return;

    const todosColRef = collection(db, "users", currentUser.uid, "todos");

    try {
      await addDoc(todosColRef, {
        task: taskText,
        completed: false,
        priority: false,
        startDate,
        endDate,
        completedAt: null,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Add todo failed:", err);
      setError("Eroare la adăugarea sarcinii.");
    }
  };

  const toggleComplete = async (id) => {
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid, "todos", id);
    const target = todos.find(t => t.id === id);
    if (!target) return;

    try {
      await updateDoc(docRef, {
        completed: !target.completed,
        completedAt: !target.completed ? new Date() : null
      });
    } catch (err) {
      console.error("Toggle complete failed:", err);
      setError("Eroare la marcarea sarcinii.");
    }
  };

  const deleteTodo = async (id) => {
    if (!currentUser) return;
    const docRef = doc(db, "users", currentUser.uid, "todos", id);
    try {
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Eroare la ștergerea sarcinii.");
    }
  };

  const togglePriority = async (id) => {
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

  const startEdit = (id) => setEditingId(id);

  // SCHIMBARE AICI: Acum acceptă updatedFields (inclusiv task, startDate, endDate)
  const editTodo = async (id, updatedFields) => {
    if (!currentUser || !updatedFields.task.trim()) return;
    const docRef = doc(db, "users", currentUser.uid, "todos", id);
    try {
      await updateDoc(docRef, updatedFields); // Trimite tot obiectul de actualizare
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

  // Loading și eroare
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Încărcare sarcini...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Interfața principală
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF8A65, #FFB74D, #4DD0E1, #BA68C8)',
        paddingTop: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: 700,
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#fff' }}>
          📋 Todo-urile lui {currentUser?.email?.split('@')[0] || 'Utilizator'}
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          onClick={logout}
          startIcon={<LogoutIcon />}
          sx={{
            borderColor: '#fff',
            color: '#fff',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
          }}
        >
          Delogare
        </Button>
      </Box>

      {/* Formularul de adăugare taskuri */}
      <Box sx={{ width: '90%', maxWidth: 700, mb: 4 }}>
        <TodoForm addTodo={addTodo} />
      </Box>

      {/* Lista taskuri */}
      <Box sx={{ width: '90%', maxWidth: 700 }}>
        {todos.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            🎉 Felicitări! Nu ai sarcini active. Adaugă una mai sus!
          </Alert>
        )}
        {todos.map(todo =>
          editingId === todo.id ? (
            <EditTodoForm 
                key={todo.id} 
                todo={todo} 
                editTodo={editTodo} 
                cancel={() => setEditingId(null)} 
            />
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
    </Box>
  );
};