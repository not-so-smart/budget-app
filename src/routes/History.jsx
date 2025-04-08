import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Chip,
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, TextField,
  Select, MenuItem, InputLabel, FormControl, Snackbar, Fab,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { Add, Close, Delete, Edit, Undo } from '@mui/icons-material';

const personaCategories = {
  student: ['school-supplies', 'tuition', 'work', 'personal', 'entertainment'],
  'single-working-adult': ['rent', 'groceries', 'entertainment', 'work', 'personal'],
  'married-working-adult': ['mortgage', 'family-expenses', 'work', 'personal', 'entertainment'],
  'married-stay-at-home-adult': ['household', 'family-expenses', 'groceries', 'work', 'personal', 'entertainment'],
  retired: ['healthcare', 'travel', 'hobbies', 'personal', 'entertainment'],
};

const defaultCategories = ['personal', 'entertainment', 'work'];

const getCategoryDisplayName = (category) => {
  switch (category) {
    case 'school-supplies': return 'School Supplies';
    case 'tuition': return 'Tuition';
    case 'work': return 'Work';
    case 'rent': return 'Rent';
    case 'groceries': return 'Groceries';
    case 'entertainment': return 'Entertainment';
    case 'mortgage': return 'Mortgage';
    case 'family-expenses': return 'Family Expenses';
    case 'household': return 'Household';
    case 'healthcare': return 'Healthcare';
    case 'travel': return 'Travel';
    case 'hobbies': return 'Hobbies';
    case 'personal': return 'Personal';
    default: return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

function CircleDisplay({ value, label }) {
  const isSaved = label === 'Saved';

  return (
    <Box sx={{
      width: 100,
      height: 100,
      borderRadius: '50%',
      bgcolor: isSaved ? '#000000' : '#e1bee7',
      color: isSaved ? '#ffffff' : 'inherit',  // Add this line
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        ${value.toFixed(2)}
      </Typography>
      {/* <Typography variant="body2">
        {label}
      </Typography> */}
    </Box>
  );
}

const getInitialData = () => {
  try {
    const savedData = localStorage.getItem('spendingData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return {
        activities: parsed.activities || [],
        savedTotal: parsed.savedTotal || 0,
        spentTotal: parsed.spentTotal || 0,
        history: []
      };
    }
  } catch (e) {
    console.error("Failed to load saved data", e);
  }

  return {
    activities: [
      {
        id: 1,
        title: 'AMC Movie Ticket',
        description: 'Received From Anna for Spiderman',
        amount: 17.80,
        date: '10/27/2025',
        category: 'entertainment',
        type: 'expense',
        timestamp: new Date('2025-10-27').getTime()
      },
      {
        id: 2,
        title: 'Coach Handbag',
        description: 'Nolita 19 in Signature Canvas',
        amount: 119.00,
        date: '10/27/2025',
        category: 'personal',
        type: 'expense',
        timestamp: new Date('2025-10-27').getTime()
      },
      {
        id: 3,
        title: 'Paycheck Deposit',
        description: 'Monthly salary',
        amount: 2500.00,
        date: '10/01/2025',
        category: 'work',
        type: 'saving',
        timestamp: new Date('2025-10-01').getTime()
      },
    ],
    savedTotal: 2500.00,
    spentTotal: 136.80,
    history: []
  };
};

export default function Categories() {
  const [data, setData] = useState(getInitialData());
  const [open, setOpen] = useState(false);
  const [editingID, setEditingID] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [view, setView] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const [activeButton, setActiveButton] = useState('recent');

  useEffect(() => {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      const { persona } = JSON.parse(savedProfile);
      setCategories(personaCategories[persona] || defaultCategories);
    }
  }, []);

  const calculateTotals = (activities) => {
    return activities.reduce((acc, activity) => {
      if (activity.type === 'saving') {
        acc.saved += activity.amount;
      } else {
        acc.spent += activity.amount;
      }
      return acc;
    }, { spent: 0, saved: 0 });
  };

  const [newBill, setNewBill] = useState({
    title: '',
    description: '',
    amount: '',
    date: new Date().toLocaleDateString(),
    category: 'personal',
    type: 'expense'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    localStorage.setItem('spendingData', JSON.stringify(data));
  }, [data]);

  const handleOpen = () => {
    setNewBill({
      title: '',
      description: '',
      amount: '',
      date: new Date().toLocaleDateString(),
      category: 'personal',
      type: 'expense'
    });
    setEditingID(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEditOpen = (id) => {
    const activity = data.activities.find(a => a.id === id);
    if (activity) {
      setNewBill({
        ...activity,
        amount: activity.amount.toString()
      });
      setEditingID(id);
      setOpen(true);
    }
  };
  const sortOptions = [
    { id: 'recent', label: 'Recent' },
    { id: 'past', label: 'Past' },
    { id: 'low-high', label: '$ -> $$$' },
    { id: 'high-low', label: '$$$ -> $' },
  ];

  const sortActivities = () => {
    let sorted = [...data.activities];
    if (view && view.length > 0) {
      sorted = sorted.filter(a =>
        (view.includes('spent') && a.type === 'expense') ||
        (view.includes('saved') && a.type === 'saving')
      );
    }

    if (selectedCategory) {
      sorted = sorted.filter(a => a.category === selectedCategory);
    }

    switch (activeButton) {
      case 'recent': return sorted.sort((a, b) => b.timestamp - a.timestamp);
      case 'past': return sorted.sort((a, b) => a.timestamp - b.timestamp);
      case 'low-high': return sorted.sort((a, b) => a.amount - b.amount);
      case 'high-low': return sorted.sort((a, b) => b.amount - a.amount);
      default: return sorted;
    }
  };

  const handleAddBill = () => {
    if (newBill.title && newBill.amount) {
      const amount = parseFloat(newBill.amount);
      if (isNaN(amount)) return;

      const activity = {
        ...newBill,
        id: editingID || Date.now().toString(),
        amount,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().getTime()
      };

      setData(prev => {
        const newActivities = editingID
          ? prev.activities.map(a => a.id === editingID ? activity : a)
          : [...prev.activities, activity];

        const { spent, saved } = calculateTotals(newActivities);

        return {
          activities: newActivities,
          savedTotal: saved,
          spentTotal: spent,
          history: [...prev.history, JSON.parse(JSON.stringify(prev))]
        };
      });

      setSnackbarMessage(editingID ? 'Transaction updated!' : 'Transaction added!');
      setSnackbarOpen(true);
      handleClose();
    }
  };

  const handleDeleteBill = (id) => {
    setData(prev => {
      const newActivities = prev.activities.filter(a => a.id !== id);
      const { spent, saved } = calculateTotals(newActivities);

      return {
        activities: newActivities,
        spentTotal: spent,
        savedTotal: saved,
        history: [...prev.history, JSON.parse(JSON.stringify(prev))]
      };
    });

    setSnackbarMessage('Transaction deleted!');
    setSnackbarOpen(true);
  };

  const handleUndo = () => {
    if (data.history.length > 0) {
      setData(data.history[data.history.length - 1]);
      setSnackbarMessage('Undo successful!');
      setSnackbarOpen(true);
    }
  };

  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'school-supplies':
      case 'personal':
        return '#b2dfdb';
      case 'tuition':
      case 'entertainment':
        return '#f8bbd0';
      case 'work':
      case 'rent':
      case 'mortgage':
      case 'household':
      case 'healthcare':
        return '#c5cae9';
      case 'groceries':
      case 'family-expenses':
        return '#ffccbc';
      case 'travel':
      case 'hobbies':
        return '#dcedc8';
      default:
        return '#e0e0e0';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Categories
        </Typography>
      </Box>

      {/* overview circles */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircleDisplay value={data.savedTotal} label="Saved" />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>Saved</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircleDisplay value={data.spentTotal} label="Spent" />
          <Typography variant="subtitle1" sx={{ mt: 1 }}>Spent</Typography>
        </Box>
      </Box>


      {/* spent and saved toggle */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={view || []}
          onChange={handleViewChange}
          sx={{
            mb: 2,
            width: '100%',
            border: '2px solid #000',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <ToggleButton
            value="spent"
            sx={{
              flex: 1,
              borderRight: '2px solid #000', // inner divider, always visible
              borderRadius: 0,
              bgcolor: view?.includes('spent') ? '#000000' : '#ffffff',
              color: view?.includes('spent') ? '#ffffff' : '#000000',
              '&:hover': {
                bgcolor: view?.includes('spent') ? '#333333' : '#f0f0f0',
              },
            }}
          >
            SPENT
          </ToggleButton>

          <ToggleButton
            value="saved"
            sx={{
              flex: 1,
              borderRadius: 0,
              bgcolor: view?.includes('saved') ? '#000000' : '#ffffff',
              color: view?.includes('saved') ? '#ffffff' : '#000000',
              '&:hover': {
                bgcolor: view?.includes('saved') ? '#333333' : '#f0f0f0',
              },
            }}
          >
            SAVED
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>


      {/* sort by and categories */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={activeButton}
            label="Sort By"
            onChange={(e) => setActiveButton(e.target.value)}
            sx={{
              '& .MuiSelect-select': {
                py: 1.2,
              }
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.id} value={option.id} sx={{ py: 1 }}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={handleCategoryChange}
            sx={{
              '& .MuiSelect-select': {
                py: 1.2,
              }
            }}
          >
            <MenuItem value="" sx={{ py: 1 }}>All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ py: 1 }}>
                {getCategoryDisplayName(cat)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* scrolling through the cards*/}
      <Box sx={{ 
        maxHeight: 'calc(100vh - 550px)', 
        overflowY: 'auto', 
        mb: 2,
        mt: 2,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '3px',
        }
      }}>
        {sortActivities().length === 0 ? (
          <Typography sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
            No transactions found for the selected filters
          </Typography>
        ) : (
          sortActivities().map((activity) => (
          <Card 
            key={activity.id}
            sx={{ 
              mb: 1.5, 
              bgcolor: activity.type === 'saving' ? '#e1bee7' : '#000000',
              color: activity.type === 'saving' ? '#000000' : '#ffffff',
              borderRadius: '8px'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold',
                  wordBreak: 'break-word',
                  maxWidth: '70%',
                  color: activity.type === 'saving' ? '#000000' : '#ffffff'
                }}>
                  {activity.title.length > 30 
                    ? `${activity.title.substring(0, 30)}...` 
                    : activity.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton 
                    onClick={() => handleEditOpen(activity.id)} 
                    size="small"
                    sx={{ color: activity.type === 'saving' ? '#000000' : '#e1bee7' }}
                  >
                    <Edit fontSize="small"/>
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteBill(activity.id)} 
                    size="small"
                    sx={{ color: activity.type === 'saving' ? '#000000' : '#e1bee7' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      flex: 1,
                      pr: 2,
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap',
                      color: activity.type === 'saving' ? '#000000' : '#ffffff'
                    }}
                  >
                    {activity.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      minWidth: '80px',
                      textAlign: 'right',
                      color: activity.type === 'saving' ? '#000000' : '#ffffff'
                    }}
                  >
                    ${activity.amount.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                  <Typography
                    variant="body1"
                    sx={{ color: activity.type === 'saving' ? '#000000' : '#ffffff' }}
                  >
                    DATE: {activity.date}
                  </Typography>
                  <Chip
                    label={getCategoryDisplayName(activity.category)}
                    size="small"
                    sx={{
                      bgcolor: getCategoryColor(activity.category),
                      color: '#000000'
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

          ))
        )}
      </Box>

      {/* undo and add at bottom of scroll*/}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        position: 'relative',
        bottom: 20,
        padding: 2,
        zIndex: 10
      }}>
        {/* Add Button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Fab
            color="primary"
            onClick={handleOpen}
            sx={{
              backgroundColor: 'black',
              borderRadius: '50%',
              width: 60,
              height: 60,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: '#333',
              },
              mb: 1,
            }}
          >
            <Add sx={{ fontSize: 24 }} />
          </Fab>
          <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 500 }}>
            Add a Transaction
          </Typography>
        </Box>

        {/* Undo Button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Fab
            onClick={handleUndo}
            sx={{
              width: 60,
              height: 60,
              backgroundColor: '#e0e0e0',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: '#f44336',
              },
              '&:active': {
                backgroundColor: '#f44336',
              },
              mb: 1,
            }}
          >
            <Undo sx={{ fontSize: 22 }} />
          </Fab>
          <Typography variant="subtitle1" sx={{ color: 'black', fontWeight: 500 }}>
            Undo Delete
          </Typography>
        </Box>
      </Box>


      {/* add and edit a bill*/}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingID !== null ? 'Edit Transaction' : 'Add New Transaction'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={newBill.type}
                label="Type"
                onChange={handleInputChange}
                required
              >
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="saving">Saving</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Title"
              name="title"
              value={newBill.title}
              onChange={handleInputChange}
              fullWidth
              required
              error={newBill.title.length > 25}
              helperText={
                newBill.title.length > 25
                  ? 'Title must be 25 characters or fewer'
                  : `${newBill.title.length}/25`
              }
            />

            <TextField
              label="Description"
              name="description"
              value={newBill.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              error={newBill.description.length > 80}
              helperText={
                newBill.description.length > 80
                  ? 'Description must be 80 characters or fewer'
                  : `${newBill.description.length}/80`
              }
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Amount"
                name="amount"
                value={newBill.amount}
                onChange={handleInputChange}
                fullWidth
                required
                type="number"
              />

              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={newBill.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {getCategoryDisplayName(cat)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddBill}
            disabled={
              !newBill.title ||
              !newBill.amount ||
              newBill.title.length > 25 ||
              newBill.description.length > 80
            }
            startIcon={<Add />}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': { backgroundColor: '#333' }
            }}
          >
            {editingID !== null ? 'Update' : 'Add'} Transaction
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}