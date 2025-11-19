// src/components/Todo.js
import React from "react";
// Importuri Material UI
import { ListItem, ListItemText, IconButton, Checkbox, Box, Paper, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Notă: Nu mai avem nevoie de importurile Font Awesome!

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete, togglePriority }) => {

    const listItemStyles = {
        // Stil de bază pentru fiecare element de listă
        mb: 1.5,
        p: 1.5,
        borderRadius: 1,
        borderLeft: task.priority ? '6px solid #FFC107' : '1px solid #e0e0e0', // Bandă laterală pentru prioritate
        
        // Culoarea și stilul textului dacă este completat
        textDecoration: task.completed ? 'line-through' : 'none',
        color: task.completed ? '#757575' : 'inherit',
        bgcolor: task.completed ? '#f5f5f5' : 'white',
        
        // Efect la hover
        '&:hover': {
            bgcolor: task.completed ? '#e0e0e0' : '#f0f0f0',
        },
    };

    return (
        // Paper oferă un efect de card/elevare
        <Paper elevation={1}>
            <ListItem
                secondaryAction={
                    // Box-ul grupează butoanele de acțiune (dreapta)
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        
                        {/* Buton Priority */}
                        <Tooltip title={task.priority ? "Marchează ca normal" : "Marchează ca prioritar"}>
                            <IconButton 
                                onClick={() => togglePriority(task.id)}
                                aria-label="toggle-priority"
                                color={task.priority ? "warning" : "default"} // Culoare galbenă pentru prioritate
                                size="small"
                            >
                                {task.priority ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                        </Tooltip>

                        {/* Buton Edit */}
                        <Tooltip title="Editează sarcina">
                            <IconButton 
                                edge="end" 
                                aria-label="edit" 
                                onClick={() => editTodo(task.id)}
                                size="small"
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        
                        {/* Buton Delete */}
                        <Tooltip title="Șterge sarcina">
                            <IconButton 
                                edge="end" 
                                aria-label="delete" 
                                onClick={() => deleteTodo(task.id)} 
                                color="error" // Culoare roșie
                                size="small"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>

                    </Box>
                }
                sx={listItemStyles}
            >
                {/* Checkbox pentru completare */}
                <Checkbox
                    edge="start"
                    checked={task.completed}
                    tabIndex={-1}
                    disableRipple
                    onClick={() => toggleComplete(task.id)}
                />

                {/* Textul sarcinii */}
                <ListItemText 
                    primary={task.task} 
                    onClick={() => toggleComplete(task.id)}
                    sx={{ cursor: 'pointer', mr: 2 }} 
                />
            </ListItem>
        </Paper>
    );
};