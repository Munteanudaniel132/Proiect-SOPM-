import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { TodoWrapperFirebase } from "./components/TodoWrapperFirebase";
import { Login } from "./components/Login";
import { Register } from "./components/Register";

function App() {
  const { currentUser } = useAuth();

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
