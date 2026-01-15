import React, { useState } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  // MODIFICARE: Verifică dacă dueDate este un șir gol și îl convertește la null
  const addTodo = (task, dueDate) => { 
    // Converteste șirul gol ("") sau nedefinit la null
    const finalDueDate = dueDate && dueDate.trim() !== "" ? dueDate : null; 

    setTodos([
      ...todos,
      { 
        id: uuidv4(), 
        task: task, 
        completed: false, 
        isEditing: false,
        priority: false, 
        dueDate: finalDueDate // <-- SALVEAZĂ VALOAREA CORECTATĂ (data sau null)
      },
    ]);
  }

  const deleteTodo = (id) => setTodos(todos.filter((todo) => todo.id !== id));

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  const togglePriority = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority: !todo.priority } : todo
      )
    );
  }

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  }

  const editTask = (task, id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const handleLogout = () => {
      alert("Te-ai delogat cu succes!"); 
  };

  return (
    <div className="TodoWrapper">
      
      <div className="todo-header">
        <h1>
          📜 Todo-urile lui dani.munt
        </h1>
        
        <button className="delogare-btn" onClick={handleLogout}>
          ➡️ DELOGARE
        </button>
      </div>

      <TodoForm addTodo={addTodo} />
      
      {/* display todos */}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
            togglePriority={togglePriority} 
          />
        )
      )}
    </div>
  );
};