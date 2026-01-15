// src/components/EditTodoForm.js
import React, { useState } from "react";
// Importuri Material UI
import { TextField, Button, Box, Paper, Grid } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export const EditTodoForm = ({ todo, editTodo, cancel }) => {
  // Starea pentru task text
  const [taskText, setTaskText] = useState(todo.task);
  
  // Starea pentru date. Folosim formatul string YYYY-MM-DD.
  const [startDate, setStartDate] = useState(todo.startDate); 
  const [endDate, setEndDate] = useState(todo.endDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificări de bază (textul sarcinii este obligatoriu)
    if (!taskText.trim()) return;

    // Creăm obiectul complet de actualizare
    const updatedFields = {
      task: taskText.trim(),
      // Trimitem datele ca string, direct din TextField
      startDate: startDate, 
      endDate: endDate,
    };
    
    // Apelăm funcția editTodo, care acum așteaptă un obiect
    editTodo(todo.id, updatedFields);
  };

  return (
    <Paper elevation={2} sx={{ mb: 1.5, p: 2, borderRadius: 1, borderLeft: '5px solid orange' }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        {/* 1. Câmpul de Editare Text */}
        <TextField
          fullWidth
          variant="outlined"
          label="Editează Sarcina"
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />

        {/* 2. Câmpurile de Editare Date (folosind type="date") */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Data Start"
              type="date" // Schimbare: Folosim tipul date HTML5
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
              // Asigurăm că eticheta nu se suprapune cu data
              InputLabelProps={{ shrink: true }} 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Data Final"
              type="date" // Schimbare: Folosim tipul date HTML5
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        {/* 3. Butoanele Salvare / Anulare (Estetice) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
          <Button 
            type="submit"
            variant="contained"
            color="primary" 
            startIcon={<SaveIcon />}
            size="small"
          >
            Salvează
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};