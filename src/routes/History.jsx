import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Chip,
  Button, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, TextField,
  Select, MenuItem, InputLabel, FormControl, Snackbar, Fab
} from '@mui/material';
import { Add, Close, Delete, Edit, Undo } from '@mui/icons-material';


//Two circles at the top of the page will display the total saved, and total spent.
function CircleDisplay({ value, maxValue, label }) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  return (
    <Box sx={{
      width: 100,                   
      height: 100,                  
      borderRadius: '50%',          
      bgcolor: '#f5f5f5',          
      display: 'flex',              
      flexDirection: 'column',      
      justifyContent: 'center',     
      alignItems: 'center',         
      position: 'relative',        
        
      '&::before': {
        content: '""',              
        position: 'absolute',       
        borderRadius: '50%',        
        width: `${percentage}%`,    
        height: `${percentage}%`,  
        bgcolor: label === 'Saved' ? '#cebef2' : '#e1bee7',         
      }
    }}>
      <Box position="relative" zIndex={1} textAlign="center">      
        <div>${value.toFixed(2)}</div>          
        <div>{label}</div>          
      </Box>
    </Box>
  );
}

// Used local storage for saved spending data. If found, it's parsed, otherwise default cards returned
const getInitialData = () => {
  const savedData = localStorage.getItem('spendingData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    return {
      ...parsedData,
      history: parsedData.history || []
    };
  }
  
  {/* default cards */}
  const initialActivities = [
    {
      title: 'AMC Movie Ticket',
      description: 'Received From Anna for Spiderman',
      amount: 17.80,
      date: '10/27/2025',
      category: 'personal',
      type: 'expense',
      timestamp: new Date('2025-10-27').getTime()
    },
    {
      title: 'Coach',
      description: 'Nolita 19 in Signature Canvas Handbag',
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
  ];

  return {
    activities: initialActivities,
    savedTotal: initialActivities
      .filter(a => a.type === 'saving')
      .reduce((sum, activity) => sum + activity.amount, 0),
    spentTotal: initialActivities
      .filter(a => a.type === 'expense')
      .reduce((sum, activity) => sum + activity.amount, 0),
    history: [] 
  };
};

export default function History() {
  const [data, setData] = useState(getInitialData()); 
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null); 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // in order to update the circles, we need the sum of spent/saved for each bill
  const calculateTotals = (activities) => {
    let spent = 0;
    let saved = 0;
    
    activities.forEach(activity => {
      if (activity.type === 'saving') {
        saved += parseFloat(activity.amount.toFixed(2));
      } else {
        spent += parseFloat(activity.amount.toFixed(2));
      }
    });
    
    return { spent, saved };
  };

  // Form functionality: 
  // intialize a new/editing bill form 
  const [newBill, setNewBill] = useState({
    title: '',
    description: '',
    amount: '',
    date: new Date().toLocaleDateString(),
    category: 'personal',
    type: 'expense'
  });

    // updates newBill typed into form
    const handleInputChange = (e) => {
      const {name, value} = e.target;
      setNewBill(prev => ({ ...prev, [name]: value}));
    };

  // autosaves data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('spendingData', JSON.stringify(data));
  }, [data]);

  // resets form to blank values when opening another time
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

  // prepares the form for editing an existing transaciton
  const handleEditOpen = (index) => {
    const activity = data.activities[index];
    setNewBill({
      ...activity,
      amount: activity.amount.toString()
    });
    setEditIndex(index);
    setOpen(true);
  };

  // Sorting funcitonality:
  const [activeButton, setActiveButton] = useState('recent'); 
  const sortOptions = [
    {id: 'recent', label: 'Recent'},
    {id: 'past', label: 'Past'},
    {id: 'low-high', label: '$ -> $$$'},
    {id: 'high-low', label: '$$$ -> $'},
  ];
  const sortActivities = () => {
    let sortedActivities = [...data.activities];
    
    switch (activeButton) {
      case 'recent':
        sortedActivities.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'past':
        sortedActivities.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'low-high':
        sortedActivities.sort((a, b) => a.amount - b.amount);
        break;
      case 'high-low':
        sortedActivities.sort((a, b) => b.amount - a.amount);
        break;
      default:
        break;
    }
    
    return sortedActivities;
  };

  const handleAddBill = () => {
    if (newBill.title && newBill.amount) {
      const amount = parseFloat(newBill.amount).toFixed(2);
      if (isNaN(amount)) return;
      
      const now = new Date();
      const activity = {
        ...newBill,
        amount: parseFloat(amount),
        date: now.toLocaleDateString(),
        timestamp: now.getTime()
      };
      
      setData(prev => {
        const newHistory = [...prev.history, JSON.parse(JSON.stringify(prev))];
        let newActivities;
        
        if (editIndex !== null) {
          newActivities = [...prev.activities];
          newActivities[editIndex] = activity;
        } else {
          newActivities = [...prev.activities, activity];
        }
        
        const { spent, saved } = calculateTotals(newActivities);
        
        return {
          activities: newActivities,
          savedTotal: saved,
          spentTotal: spent,
          history: newHistory.slice(-10)
        };
      });
      
      setSnackbarMessage(editIndex !== null ? 'Transaction updated!' : 'Transaction added!');
      setSnackbarOpen(true);
      handleClose();
    }
  };

  {/*Deleting a bill*/}
  const handleDeleteBill = (index) => {
    setData(prev => {
      const newHistory = [...prev.history, JSON.parse(JSON.stringify(prev))];
      const newActivities = prev.activities.filter((_, i) => i !== index);
      const { spent, saved } = calculateTotals(newActivities);
      
      return {
        activities: newActivities,
        spentTotal: spent,
        savedTotal: saved,
        history: newHistory.slice(-10)
      };
    });
    
    setSnackbarMessage('Transaction deleted!');
    setSnackbarOpen(true);
  };

  const handleUndo = () => {
    if (data.history && data.history.length > 0) {
      setData(data.history[data.history.length - 1]);
      setSnackbarMessage('Undo successful!');
      setSnackbarOpen(true);
    } 
  };
  
  const getCardColor = (type) => {
    return type === 'saving' ? '#cebef2' : '#e1bee7';
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h1>History</h1>
      <p>Overview</p>
      
      {/* Circles */}
      <Box sx= {{justifyContent: 'center', display: 'flex'}}>
        <div style={{ display: 'flex', gap: '20px' }}> 
          <CircleDisplay value={data.savedTotal} maxValue={1000} label="Saved" />
          <CircleDisplay value={data.spentTotal} maxValue={1000} label="Spent" />
        </div>
      </Box>
      
      
      {/* SORT: */}
      <Box sx= {{alignItems: 'center', display: 'flex', gap: 2, marginTop: 4}}>
        <Box component="span" sx={{ fontWeight: 'bold'}}>
          SORT:
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}> 
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
        
      {/* Actions: */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Fab
          color="primary"
          onClick={handleOpen}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          <Add />
        </Fab>

      {/* Undo FAB */}
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

      {/* Bills List */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Your Activity
      </Typography>
      {/*The color of the card is determined by if it's a saving or an expense*/}
      {sortActivities().map((activity, index) => (
        <Card key={index} sx={{ 
          mb: 2, 
          bgcolor: getCardColor(activity.type),
          borderRadius: '10px', 
          position: 'relative' 
        }}>
          <Box sx={{ position: 'absolute', right: 4, top: 4, display: 'flex', gap: 1 }}>
        {/*Edit icon*/}       
           <IconButton
              onClick={() => handleEditOpen(index)}
              size="small"
              sx={{
                color: 'primary.main',
                backgroundColor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                },
                width: 24,
                height: 24
              }}
            >
              <Edit fontSize="small" />
            </IconButton>

        {/*Delete Icon*/}            
          <IconButton
              onClick={() => handleDeleteBill(index)}
              size="small"
              sx={{
                color: 'error.main',
                backgroundColor: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)'
                },
                width: 24,
                height: 24
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
          
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {activity.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {activity.description}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                DATE: {activity.date}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', marginTop: '15px' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ${activity.amount.toFixed(2)}
              </Typography>
              <Chip
                label={activity.category.toUpperCase()}
                sx={{ mt: 1, bgcolor: '#b2dfdb', color: '#000000' }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
      
      {/*Bill Dialog (Edit Transaction when edit chosen, else Add New transaction)*/}
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
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="entertainment">Entertainment</MenuItem>
                  <MenuItem value="work">Work</MenuItem>
                  <MenuItem value="household">Household</MenuItem>
                  <MenuItem value="healthcare">Healthcare</MenuItem>
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
            sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
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