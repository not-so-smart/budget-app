import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';

export default function Goals() {
    // State for savings goals
        { id: 1, name: 'Essentials', value: 50, target: 250 },
        { id: 2, name: 'Personal', value: 30, target: 100 },
        { id: 3, name: 'Work', value: 70, target: 200 },
        { id: 4, name: 'Other', value: 20, target: 50 },
    const [savingsGoals, setSavingsGoals] = useState(() => {
        const savedSavings = localStorage.getItem('savingsGoals');
        return savedSavings ? JSON.parse(savedSavings) : [
        ];
    });

    // State for spending goals
        { id: 1, name: 'Entertainment', value: 50, target: 250 },
        { id: 2, name: 'Personal', value: 30, target: 100 },
        { id: 3, name: 'Work', value: 70, target: 200 },
        { id: 4, name: 'Childcare', value: 20, target: 50 },
    const [spendingGoals, setSpendingGoals] = useState(() => {
        const savedSpending = localStorage.getItem('spendingGoals');
        return savedSpending ? JSON.parse(savedSpending) : [
        ];
    });

    // State for dialog and new goal
    const [open, setOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null); // Track the goal being edited
    const [newGoal, setNewGoal] = useState({ name: '', value: 0, target: 0 });
    const [isSavings, setIsSavings] = useState(true); // Track whether editing savings or spending
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Save savingsGoals to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));
    }, [savingsGoals]);

    // Save spendingGoals to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('spendingGoals', JSON.stringify(spendingGoals));
    }, [spendingGoals]);

    // Open dialog for adding or editing
    const handleOpen = (goal = null, isSavingsGoal = true) => {
        setIsSavings(isSavingsGoal);
        if (goal) {
            setEditingGoal(goal);
            setNewGoal(goal);
        } else {
            setEditingGoal(null);
            setNewGoal({ name: '', value: 0, target: 0 });
        }
        setOpen(true);
    };

    // Close dialog
    const handleClose = () => {
        setOpen(false);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGoal((prev) => ({ ...prev, [name]: name === 'value' || name === 'target' ? parseInt(value, 10) || 0 : value }));
    };

    // Add or update goal
    const handleSaveGoal = () => {
        if (newGoal.name && newGoal.target > 0) {
            if (editingGoal) {
                // Update existing goal
                if (isSavings) {
                    setSavingsGoals((prev) =>
                        prev.map((goal) => (goal.id === editingGoal.id ? { ...goal, ...newGoal } : goal))
                    );
                } else {
                    setSpendingGoals((prev) =>
                        prev.map((goal) => (goal.id === editingGoal.id ? { ...goal, ...newGoal } : goal))
                    );
                }
            } else {
                // Add new goal
                const newGoalWithId = { ...newGoal, id: Date.now() };
                if (isSavings) {
                    setSavingsGoals((prev) => [...prev, newGoalWithId]);
                } else {
                    setSpendingGoals((prev) => [...prev, newGoalWithId]);
                }
            }
            setSnackbarOpen(true);
            handleClose();
        }
    };

    // Delete goal
    const handleDeleteGoal = () => {
        if (editingGoal) {
            if (isSavings) {
                setSavingsGoals((prev) => prev.filter((goal) => goal.id !== editingGoal.id));
            } else {
                setSpendingGoals((prev) => prev.filter((goal) => goal.id !== editingGoal.id));
            }
            handleClose();
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Goals
                </Typography>
            </Box>

            {/* Container */}
            <Box
                sx={{
                    height: '700px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Savings */}
                <Box
                    sx={{
                        width: '250px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        Savings
                    </Typography>
                    {/* Top Box */}
                    <Box
                        sx={{
                            height: '150px',
                            width: '100%',
                            backgroundColor: 'black',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '3px solid black',
                            borderRadius: '8px',
                        }}
                    >
                        {/* Current Savings */}
                        <Typography
                            variant="h3"
                            sx={{
                                color: savingsGoals.reduce((sum, goal) => sum + goal.value, 0) >=
                                    savingsGoals.reduce((sum, goal) => sum + goal.target, 0)
                                    ? '#18b87b' // Green if current savings >= target
                                    : '#b81818', // Red otherwise
                            }}
                        >
                            ${savingsGoals.reduce((sum, goal) => sum + goal.value, 0)}
                        </Typography>
                        {/* Horizontal Bar */}
                        <Box
                            sx={{
                                width: '80%',
                                height: '4px',
                                backgroundColor: '#fbfbfb',
                                borderRadius: '2.5px',
                            }}
                        />
                        {/* Target Savings */}
                        <Typography variant="h3" sx={{ color: '#fbfbfb' }}>
                            ${savingsGoals.reduce((sum, goal) => sum + goal.target, 0)}
                        </Typography>
                    </Box>
                    {/* Bottom Box */}
                    <Box
                        sx={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: '#fbfbfb',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '3px solid black',
                            borderRadius: '8px',
                            overflowY: 'auto',
                            padding: '10px',
                            gap: '10px',
                        }}
                    >
                        {/* Scrollable List */}
                        {savingsGoals.map((category) => (
                            <Box
                                key={category.id}
                                onClick={() => handleOpen(category, true)} // Open dialog for editing savings
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: '5px 10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    backgroundColor: '#f0f0f0',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#e0e0e0' },
                                }}
                            >
                                {/* Category Name */}
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {category.name}
                                </Typography>
                                {/* Progress indicator */}
                                <Box
                                    sx={{
                                        backgroundColor: category.value >= category.target ? '#bfe4bf' : '#ffb7b7', // Green if value >= target, red otherwise
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                    }}
                                >
                                    <Typography variant="body2">
                                        {category.value}/{category.target}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    {/* Add Savings Button */}
                    <Fab
                        color="primary"
                        onClick={() => handleOpen(null, true)} // Open dialog for adding savings
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            '&:hover': { backgroundColor: '#333', transform: 'scale(1.1)' },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <AddIcon />
                    </Fab>
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                        Add new savings goal
                    </Typography>
                </Box>

                {/* Expenses */}
                <Box
                    sx={{
                        width: '250px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <Typography variant="h6" sx={{ textAlign: 'center' }}>
                        Expenses
                    </Typography>
                    {/* Top Box */}
                    <Box
                        sx={{
                            height: '150px',
                            width: '100%',
                            backgroundColor: '#e1bee7',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '3px solid black',
                            borderRadius: '8px',
                        }}
                    >
                        {/* Current Spending */}
                        <Typography
                            variant="h3"
                            sx={{
                                color: spendingGoals.reduce((sum, goal) => sum + goal.value, 0) <=
                                    spendingGoals.reduce((sum, goal) => sum + goal.target, 0)
                                    ? '#18b87b' // Green if current spending <= target
                                    : '#b81818', // Red otherwise
                            }}
                        >
                            ${spendingGoals.reduce((sum, goal) => sum + goal.value, 0)}
                        </Typography>
                        {/* Horizontal Bar */}
                        <Box
                            sx={{
                                width: '80%',
                                height: '4px',
                                backgroundColor: '#000',
                                borderRadius: '2.5px',
                            }}
                        />
                        {/* Target Spending */}
                        <Typography variant="h3" sx={{ color: '#000' }}>
                            ${spendingGoals.reduce((sum, goal) => sum + goal.target, 0)}
                        </Typography>
                    </Box>
                    {/* Bottom Box */}
                    <Box
                        sx={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: '#fbfbfb',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '3px solid black',
                            borderRadius: '8px',
                            overflowY: 'auto',
                            padding: '10px',
                            gap: '10px',
                        }}
                    >
                        {/* Scrollable List */}
                        {spendingGoals.map((category) => (
                            <Box
                                key={category.id}
                                onClick={() => handleOpen(category, false)} // Open dialog for editing spending
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: '5px 10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    backgroundColor: '#f0f0f0',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#e0e0e0' },
                                }}
                            >
                                {/* Category Name */}
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {category.name}
                                </Typography>
                                {/* Progress indicator */}
                                <Box
                                    sx={{
                                        backgroundColor: category.value <= category.target ? '#bfe4bf' : '#ffb7b7', // Green if value <= target, red otherwise
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                    }}
                                >
                                    <Typography variant="body2">
                                        {category.value}/{category.target}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    {/* Add Expenses Button */}
                    <Fab
                        color="primary"
                        onClick={() => handleOpen(null, false)} // Open dialog for adding spending
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            '&:hover': { backgroundColor: '#333', transform: 'scale(1.1)' },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <AddIcon />
                    </Fab>
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                        Add new spending limit
                    </Typography>
                </Box>
            </Box>

            {/* Add/Edit Goal Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingGoal ? (isSavings ? 'Edit Savings Goal' : 'Edit Spending Goal') : (isSavings ? 'Add New Savings Goal' : 'Add New Spending Goal')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={newGoal.name}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Current Value"
                            name="value"
                            value={newGoal.value}
                            onChange={handleInputChange}
                            fullWidth
                            type="number"
                        />
                        <TextField
                            label="Target Value"
                            name="target"
                            value={newGoal.target}
                            onChange={handleInputChange}
                            fullWidth
                            type="number"
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    {editingGoal && (
                        <Button
                            onClick={handleDeleteGoal}
                            sx={{ color: 'red', mr: 'auto' }}
                        >
                            Delete
                        </Button>
                    )}
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveGoal}
                        disabled={!newGoal.name || newGoal.target <= 0}
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            '&:hover': { backgroundColor: '#333' },
                        }}
                    >
                        {editingGoal ? 'Save Changes' : 'Add Goal'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={editingGoal ? (isSavings ? 'Savings goal updated!' : 'Spending goal updated!') : (isSavings ? 'Savings goal added!' : 'Spending goal added!')}
            />
        </Box>
    );
}