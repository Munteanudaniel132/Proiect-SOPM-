// src/components/EditTodoForm.js
import React, { useState } from "react";
// Importuri Material UI
import { TextField, Button, Box, Paper } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export const EditTodoForm = ({ todo, editTodo, cancel }) => {
  const [value, setValue] = useState(todo.task);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logica ta rămâne neschimbată
    if (!value.trim()) return;
    editTodo(todo.id, value.trim());
  };

  return (
    // Folosim Paper și Box pentru a arăta ca un element din listă
    <Paper elevation={2} sx={{ mb: 1.5, p: 1.5, borderRadius: 1 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          display: 'flex', 
          gap: 1.5, 
          alignItems: 'center',
        }}
      >
        {/* Câmpul de Editare */}
        <TextField
          fullWidth
          variant="outlined"
          label={`Editare sarcină: ${todo.task}`}
          value={value}
          onChange={e => setValue(e.target.value)}
          size="small"
        />

        {/* Buton Salvare */}
        <Button 
          type="submit"
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          size="small"
        >
          Salvează
        </Button>
        
        {/* Buton Anulare */}
        <Button 
          type="button" 
          onClick={cancel}
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          size="small"
        >
          Anulează
        </Button>

      </Box>
    </Paper>
  );
};