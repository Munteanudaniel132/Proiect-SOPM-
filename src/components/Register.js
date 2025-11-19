// src/components/Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

// Importuri Material UI pentru stilizare
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';

export const Register = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Dacă înregistrarea reușește, închide fereastra/modalul
      if (onClose) onClose();
    } catch (err) {
      // Afișează eroarea primită de la Firebase
      setError(err.message.replace('Firebase: Error (auth/', '').replace(/\)\./g, '').replace(/-/g, ' '));
    }
  };

  return (
    <Box
      // Box-ul este elementul rădăcină (în loc de Container)
      sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4, // Padding
          bgcolor: 'background.paper', // Fundal alb
          borderRadius: 2, // Colțuri rotunjite
          boxShadow: 3, // Umbra subtilă
      }}
    >
      <PersonAddAlt1OutlinedIcon color="secondary" sx={{ m: 1 }} />
      <Typography component="h1" variant="h5">
        Creare Cont Nou
      </Typography>
      <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
          {/* Câmp Email */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            type="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {/* Câmp Parolă */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Parolă (min. 6 caractere)"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {/* Buton Creare Cont */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary" // Culoare diferită pentru a distinge de Login
            sx={{ mt: 3, mb: 2 }}
          >
            Creare Cont
          </Button>
          
          {/* Afișare Erori */}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      </Box>
    </Box>
  );
};