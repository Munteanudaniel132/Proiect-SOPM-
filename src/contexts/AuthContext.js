// src/contexts/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // S-a terminat verificarea inițială
    });
    
    // Functia de curățare (cleanup)
    return unsubscribe;
  }, []); // Rulare doar o singură dată la montare

  // Trebuie să expui loading și currentUser
  const value = { currentUser, loading }; 

  return (
    <AuthContext.Provider value={value}>
      {/* Mutăm logica de loading în App.js pentru control centralizat, 
          deci lăsăm 'children' să se randeze întotdeauna aici. */}
      {children} 
    </AuthContext.Provider>
  );
};