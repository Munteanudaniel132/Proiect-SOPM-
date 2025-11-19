// src/components/TodoForm.js
import React, { useState } from "react";
// Importuri Material UI
import { TextField, Button, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logica ta rămâne neschimbată
    if (!value.trim()) return;
    addTodo(value.trim());
    setValue("");
  };

  return (
    // Box înlocuiește forma cu stiluri flex
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
        display: 'flex', 
        gap: 2, // Spațiu între input și buton
        alignItems: 'center',
        p: 1
      }}
    >
      <TextField
        // TextField înlocuiește <input type="text">
        fullWidth // Ocupă tot spațiul rămas
        variant="outlined"
        label="Adaugă o sarcină nouă"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="small"
      />
      <Button 
        // Button înlocuiește <button type="submit">
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutlineIcon />}
      >
        Adaugă
      </Button>
    </Box>
  );
};