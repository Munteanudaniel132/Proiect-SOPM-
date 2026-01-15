
import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { TodoWrapperFirebase } from "./components/TodoWrapperFirebase";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
// Import Material UI pentru spinner
import { CircularProgress, Box } from '@mui/material'; 

function App() {
  const { currentUser, loading } = useAuth(); // <<< Preluăm și 'loading'

  // 1. Afișează Spinner-ul în timpul verificării Firebase
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Odată ce loading e false, verificăm autentificarea
  return (
    <div className="App">
      {!currentUser ? (
        <div className="auth-page">
          <Login />
          <Register />
        </div>
      ) : (
        <TodoWrapperFirebase />
      )}
    </div>
  ); 
}

export default App;