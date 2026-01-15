// src/components/TodoForm.js
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Importuri Material UI
import { TextField, Button, Box, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export const TodoForm = ({ addTodo }) => {
  const [valueTask, setValueTask] = useState("");
  const [startDate, setStartDate] = useState(new Date()); // Data de început implicită azi
  const [endDate, setEndDate] = useState(new Date());     // Deadline implicit azi

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!valueTask.trim()) return;

    // Trimit taskText + startDate + endDate la addTodo
    addTodo(valueTask.trim(), startDate, endDate);

    // Resetare stări
    setValueTask("");
    setStartDate(new Date());
    setEndDate(new Date());
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        {/* INPUT TEXT PENTRU SARCINA */}
        <TextField
          sx={{ flexGrow: 1 }}
          variant="outlined"
          label="Adaugă o sarcină nouă"
          value={valueTask}
          onChange={(e) => setValueTask(e.target.value)}
          size="small"
        />

        {/* DATE PICKER PENTRU START DATE */}
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Data început"
          customInput={<TextField size="small" />}
        />

        {/* DATE PICKER PENTRU END DATE */}
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Deadline"
          customInput={<TextField size="small" />}
        />

        {/* BUTON ADAUGĂ */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          sx={{ height: 40 }}
        >
          Adaugă
        </Button>
      </Stack>
    </Box>
  );
};
