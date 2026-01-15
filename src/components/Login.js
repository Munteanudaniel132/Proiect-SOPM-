// src/components/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

// Importuri Material UI pentru stilizare
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Dacă autentificarea reușește, închide fereastra/modalul
      if (onClose) onClose();
    } catch (err) {
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
      <LockOutlinedIcon color="primary" sx={{ m: 1 }} />
      <Typography component="h1" variant="h5">
        Autentificare
      </Typography>
      <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          {/* Câmp Email */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Adresă Email"
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
            label="Parolă"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {/* Buton Login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          
          {/* Afișare Erori */}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      </Box>
    </Box>
  );
};