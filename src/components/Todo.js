// src/components/Todo.js
import React from "react"; 
import { ListItem, ListItemText, IconButton, Checkbox, Box, Paper, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

// Functie pentru gradient taskuri
const getTaskGradient = (task) => {
    const now = new Date();
    const start = task.startDate?.toDate ? task.startDate.toDate() : new Date(task.startDate);
    const end = task.endDate?.toDate ? task.endDate.toDate() : new Date(task.endDate);
    const completedAt = task.completedAt?.toDate ? task.completedAt.toDate() : task.completedAt;

    if (task.completed && completedAt && completedAt <= end) {
        return 'linear-gradient(135deg, #66BB6A, #388E3C)'; // verde intens
    }

    if (!task.completed && now > end) {
        return 'linear-gradient(135deg, #EF5350, #C62828)'; // roșu intens
    }

    if (!task.completed && now >= start && now <= end) {
        return 'linear-gradient(135deg, #FFEB3B, #FBC02D)'; // galben vibrant
    }

    return 'linear-gradient(135deg, #E0E0E0, #BDBDBD)'; // gri
};

export const Todo = ({ task, deleteTodo, editTodo, toggleComplete, togglePriority }) => {
    const bgGradient = getTaskGradient(task);

    return (
        <Paper
            elevation={4}
            sx={{
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                background: bgGradient,
                color: '#fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
        >
            <ListItem
                secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title={task.priority ? "Marchează ca normal" : "Marchează ca prioritar"}>
                            <IconButton 
                                onClick={() => togglePriority(task.id)}
                                aria-label="toggle-priority"
                                color="inherit" 
                                size="small"
                            >
                                {task.priority ? <StarIcon /> : <StarBorderIcon />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Editează sarcina">
                            <IconButton 
                                edge="end" 
                                aria-label="edit" 
                                onClick={() => editTodo(task.id)}
                                color="inherit"
                                size="small"
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Șterge sarcina">
                            <IconButton 
                                edge="end" 
                                aria-label="delete" 
                                onClick={() => deleteTodo(task.id)} 
                                color="inherit"
                                size="small"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
            >
                <Checkbox
                    edge="start"
                    checked={task.completed}
                    tabIndex={-1}
                    disableRipple
                    onClick={() => toggleComplete(task.id)}
                    sx={{ color: '#fff' }}
                />

                <ListItemText 
                    primary={
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                textDecoration: task.completed ? 'line-through' : 'none',
                                fontWeight: 600,
                                color: '#fff'
                            }}
                        >
                            {task.task}
                        </Typography>
                    }
                    secondary={
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                            <Typography variant="caption">
                                Start: {new Date(task.startDate?.toDate ? task.startDate.toDate() : task.startDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption">
                                – Deadline: {new Date(task.endDate?.toDate ? task.endDate.toDate() : task.endDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                    }
                />
            </ListItem>
        </Paper>
    );
};
