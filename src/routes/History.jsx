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

// circle display at top
function CircleDisplay({ value, label }) {
  return (
    <Box sx={{
      width: 100, 
      height: 100, 
      borderRadius: '50%',
      bgcolor: label === 'Saved' ? '#cebef2' : '#e1bee7',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        ${value.toFixed(2)}
      </Typography>
      <Typography variant="body2">
        {label}
      </Typography>
    </Box>
  );
}

const getInitialData = () => {
  const savedData = localStorage.getItem('spendingData');
  if (savedData) return JSON.parse(savedData);
  
  return {
    activities: [
      {
        title: 'AMC Movie Ticket',
        description: 'Received From Anna for Spiderman',
        amount: 17.80,
        date: '10/27/2025',
        category: 'entertainment',
        type: 'expense',
        timestamp: new Date('2025-10-27').getTime()
      },
      {
        title: 'Coach Handbag',
        description: 'Nolita 19 in Signature Canvas',
        amount: 119.00,
        date: '10/27/2025',
        category: 'personal',
        type: 'expense',
        timestamp: new Date('2025-10-27').getTime()
      },
      {
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
  const [editIndex, setEditIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [view, setView] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState(defaultCategories);
  const [activeButton, setActiveButton] = useState('recent');

  // persona categories
  useEffect(() => {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      const { persona } = JSON.parse(savedProfile);
      setCategories(personaCategories[persona] || defaultCategories);
    }
  }, []);

  // calculate totals
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

  // form state
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

  // dave to localStorage
  useEffect(() => {
    localStorage.setItem('spendingData', JSON.stringify(data));
  }, [data]);

  // dialog handlers
  const handleOpen = () => {
    setNewBill({
      title: '',
      description: '',
      amount: '',
      date: new Date().toLocaleDateString(),
      category: 'personal',
      type: 'expense'
    });
    setEditIndex(null);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleEditOpen = (index) => {
    const activity = data.activities[index];
    setNewBill({
      ...activity,
      amount: activity.amount.toString()
    });
    setEditIndex(index);
    setOpen(true);
  };

  // sorting
  const sortOptions = [
    { id: 'recent', label: 'Recent' },
    { id: 'past', label: 'Past' },
    { id: 'low-high', label: '$ -> $$$' },
    { id: 'high-low', label: '$$$ -> $' },
  ];

  const sortActivities = () => {
    let sorted = [...data.activities];
    
    // filter by view (spend/receive)
    if (view === 'spend') {
      sorted = sorted.filter(a => a.type === 'expense');
    } else if (view === 'receive') {
      sorted = sorted.filter(a => a.type === 'saving');
    }
    // if view is null (both unselected), show all
    
    // filter by category if selected
    if (selectedCategory) {
      sorted = sorted.filter(a => a.category === selectedCategory);
    }
    
    // apply sorting
    switch (activeButton) {
      case 'recent': return sorted.sort((a, b) => b.timestamp - a.timestamp);
      case 'past': return sorted.sort((a, b) => a.timestamp - b.timestamp);
      case 'low-high': return sorted.sort((a, b) => a.amount - b.amount);
      case 'high-low': return sorted.sort((a, b) => b.amount - a.amount);
      default: return sorted;
    }
  };

  // add/edit transaction
  const handleAddBill = () => {
    if (newBill.title && newBill.amount) {
      const amount = parseFloat(newBill.amount);
      if (isNaN(amount)) return;
      
      const activity = {
        ...newBill,
        amount,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().getTime()
      };
      
      setData(prev => {
        const newActivities = editIndex !== null
          ? prev.activities.map((a, i) => i === editIndex ? activity : a)
          : [...prev.activities, activity];
        
        const { spent, saved } = calculateTotals(newActivities);
        
        return {
          activities: newActivities,
          savedTotal: saved,
          spentTotal: spent,
          history: [...prev.history, JSON.parse(JSON.stringify(prev))].slice(-10)
        };
      });
      
      setSnackbarMessage(editIndex !== null ? 'Transaction updated!' : 'Transaction added!');
      setSnackbarOpen(true);
      handleClose();
    }
  };

  // delete transaction
  const handleDeleteBill = (index) => {
    setData(prev => {
      const newActivities = prev.activities.filter((_, i) => i !== index);
      const { spent, saved } = calculateTotals(newActivities);
      
      return {
        activities: newActivities,
        spentTotal: spent,
        savedTotal: saved,
        history: [...prev.history, JSON.parse(JSON.stringify(prev))].slice(-10)
      };
    });
    
    setSnackbarMessage('Transaction deleted!');
    setSnackbarOpen(true);
  };

  // undo
  const handleUndo = () => {
    if (data.history.length > 0) {
      setData(data.history[data.history.length - 1]);
      setSnackbarMessage('Undo successful!');
      setSnackbarOpen(true);
    }
  };

  // view toggle (spend/receive)
  const handleViewChange = (event, newView) => {
    setView(newView);
  };

  // category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // get card color based on category (matches home page)
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

      {/* circles*/}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
        <CircleDisplay value={data.savedTotal} label="Saved" />
        <CircleDisplay value={data.spentTotal} label="Spent" />
      </Box>

      {/* Toggle between spending and receiving - now allows both to be unselected */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={view}
          onChange={handleViewChange}
          sx={{ mb: 2, width: '100%', justifyContent: 'center' }}
        >
          <ToggleButton
            value="spend"
            sx={{
              flex: 1,
              bgcolor: view === 'spend' ? '#ff4081' : '#f5f5f5',
              color: view === 'spend' ? '#ffffff' : '#9e9e9e',
              '&:hover': {
                bgcolor: view === 'spend' ? '#ff80ab' : '#eeeeee',
              },
            }}
          >
            SPEND
          </ToggleButton>
          <ToggleButton
            value="receive"
            sx={{
              flex: 1,
              bgcolor: view === 'receive' ? '#ff4081' : '#f5f5f5',
              color: view === 'receive' ? '#ffffff' : '#9e9e9e',
              '&:hover': {
                bgcolor: view === 'receive' ? '#ff80ab' : '#eeeeee',
              },
            }}
          >
            RECEIVE
          </ToggleButton>
        </ToggleButtonGroup>

        {/* category dropdown */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Filter by category</InputLabel>
          <Select
            value={selectedCategory}
            label="Filter by category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {getCategoryDisplayName(cat)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* sort buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            SORT:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {sortOptions.map((option) => (
              <Button
                key={option.id}
                variant={activeButton === option.id ? 'contained' : 'outlined'}
                onClick={() => setActiveButton(option.id)}
                sx={{
                  minWidth: '100px',
                  color: activeButton === option.id ? 'white' : 'black',
                  backgroundColor: activeButton === option.id ? 'black' : 'white',
                  borderColor: 'black',
                  '&:hover': {
                    backgroundColor: activeButton === option.id ? '#333' : '#f5f5f5',
                    borderColor: 'black'
                  }
                }}
              >
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        <Fab
          color="primary"
          onClick={handleOpen}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': { backgroundColor: '#333', transform: 'scale(1.1)' },
            transition: 'all 0.2s ease'
          }}
        >
          <Add />
        </Fab>
        <Fab
          color="secondary"
          onClick={handleUndo}
          disabled={data.history.length === 0}
          sx={{
            backgroundColor: data.history.length === 0 ? '#e0e0e0' : '#424242',
            color: 'white',
            '&:hover': {
              backgroundColor: data.history.length === 0 ? '#e0e0e0' : '#616161',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <Undo />
        </Fab>
      </Box>

      {/* activity list */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Your Activity
      </Typography>
      
      {sortActivities().length === 0 ? (
        <Typography sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
          No transactions found for the selected filters
        </Typography>
      ) : (
        sortActivities().map((activity, index) => (
          <Card 
            key={index} 
            sx={{ 
              mb: 2, 
              bgcolor: activity.type === 'saving' ? '#cebef2' : '#e1bee7',
              borderRadius: '10px'
            }}
          >
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {activity.title}
                </Typography>
                {activity.description && (
                  <Typography variant="body2" color="textSecondary">
                    {activity.description}
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  DATE: {activity.date}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  ${activity.amount.toFixed(2)}
                </Typography>
                <Chip
                  label={getCategoryDisplayName(activity.category)}
                  sx={{ 
                    mt: 1, 
                    bgcolor: getCategoryColor(activity.category),
                    color: '#000000'
                  }}
                />
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    onClick={() => handleEditOpen(
                      data.activities.findIndex(a => a.timestamp === activity.timestamp)
                    )}
                    size="small"
                    sx={{
                      color: 'primary.main',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteBill(
                      data.activities.findIndex(a => a.timestamp === activity.timestamp)
                    )}
                    size="small"
                    sx={{
                      color: 'error.main',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {/* add/edit dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Edit Transaction' : 'Add New Transaction'}
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
            />
            
            <TextField
              label="Description"
              name="description"
              value={newBill.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
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
            disabled={!newBill.title || !newBill.amount}
            startIcon={<Add />}
            sx={{ 
              backgroundColor: 'black', 
              color: 'white', 
              '&:hover': { backgroundColor: '#333' } 
            }}
          >
            {editIndex !== null ? 'Update' : 'Add'} Transaction
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