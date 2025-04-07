import React from 'react';
import { Avatar, Box, Card, CardContent, Typography, Button, Grid2, useTheme, Select, MenuItem, InputLabel, FormControl, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { grey } from '@mui/material/colors';

export const saveToLocalStorage = (key, value) => {
    // Don't stringify strings
    if (typeof value === 'string') {
        localStorage.setItem(key, value);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
export const loadFromLocalStorage = (key, defaultValue) => {
    const savedData = localStorage.getItem(key);
    if (savedData) {
        try {
            // If it looks like JSON, try to parse it
            if (savedData[0] === '{' || savedData[0] === '[' || savedData[0] === '"') {
                return JSON.parse(savedData);
            } else {
                // Not JSON, return as is
                return savedData;
            }
        } catch {
            // If parsing fails, return the raw string
            return savedData;
        }
    }
    return defaultValue;
};
export default function Bills() {
    // Feel free to ignore this, it's just an example of how to use the 
    // useParams hook in case we need to implement deep linking in the future
    const { id } = useParams();
    const defaultBillsForPersona = {
        student: [
          { id: 1, name: 'Tuition Fees', amount: 5000, category: 'Education', dueDate: '2025-08-01' },
          { id: 2, name: 'Textbooks', amount: 300, category: 'Education', dueDate: '2025-08-10' },
          { id: 3, name: 'Living Expenses', amount: 800, category: 'Living', dueDate: '2025-04-05' },
          { id: 4, name: 'Student Loan Payment', amount: 200, category: 'Loans', dueDate: '2025-05-15' },
        ],
        'single-working-adult': [
          { id: 1, name: 'Rent', amount: 1200, category: 'Housing', dueDate: '2025-04-01' },
          { id: 2, name: 'Groceries', amount: 250, category: 'Living', dueDate: '2025-04-03' },
          { id: 3, name: 'Bar/Date Night', amount: 80, category: 'Entertainment', dueDate: '2025-04-07' },
          { id: 4, name: 'Gym Membership', amount: 50, category: 'Fitness', dueDate: '2025-04-15' },
          { id: 5, name: 'Eating Out', amount: 100, category: 'Entertainment', dueDate: '2025-04-12' },
        ],
        'married-working-adult': [
          { id: 1, name: 'Rent/Mortgage', amount: 1500, category: 'Housing', dueDate: '2025-04-01' },
          { id: 2, name: 'Utilities', amount: 300, category: 'Utilities', dueDate: '2025-04-05' },
          { id: 3, name: 'Internet Bill', amount: 80, category: 'Utilities', dueDate: '2025-04-10' },
          { id: 4, name: 'Honeymoon Fund', amount: 500, category: 'Leisure', dueDate: '2025-05-01' },
          { id: 5, name: 'Health Insurance', amount: 200, category: 'Insurance', dueDate: '2025-04-07' },
        ],
        'married-stay-at-home-adult': [
          { id: 1, name: 'Groceries', amount: 300, category: 'Living', dueDate: '2025-04-03' },
          { id: 2, name: 'Utilities', amount: 100, category: 'Utilities', dueDate: '2025-04-05' },
          { id: 3, name: 'Home Maintenance', amount: 150, category: 'Home', dueDate: '2025-04-10' },
          { id: 4, name: 'Childcare', amount: 400, category: 'Family', dueDate: '2025-04-01' },
          { id: 5, name: 'Insurance', amount: 150, category: 'Insurance', dueDate: '2025-04-07' },
        ],
        retired: [
          { id: 1, name: 'Hospital Bills', amount: 200, category: 'Health', dueDate: '2025-04-01' },
          { id: 2, name: 'Medicine Costs', amount: 100, category: 'Health', dueDate: '2025-04-05' },
          { id: 3, name: 'Pension Fund', amount: 1200, category: 'Retirement', dueDate: '2025-04-10' },
          { id: 4, name: 'Utility Bills', amount: 150, category: 'Utilities', dueDate: '2025-04-15' },
          { id: 5, name: 'Entertainment (Senior Discounts)', amount: 50, category: 'Leisure', dueDate: '2025-04-20' },
        ],
    };
    //this may need to be changed. i need to dynamically check when persona changes in the submit on profile page
    const [bills, setBills] = useState(() => {
        const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        const persona = profileData.persona || 'student';
      
        const personaChanged = localStorage.getItem('personaChanged') === 'true';
      
        const savedBills = JSON.parse(localStorage.getItem('billData') || 'null');
      
        if (personaChanged) {
          console.log("persona changed")
          const defaultBills = defaultBillsForPersona[persona] || defaultBillsForPersona['student'];
          localStorage.setItem('billData', JSON.stringify(defaultBills));
          localStorage.setItem('lastPersona', persona); // update current as new "last"
          localStorage.setItem('personaChanged', 'false'); // reset flag
          return defaultBills;
        }
      
        return savedBills || (defaultBillsForPersona[persona] || {});
      });

      useEffect(() => {
        localStorage.setItem('billData', JSON.stringify(bills));
      }, [bills]);

      
      

    const [sortOption, setSortOption] = useState(() => {
        const initial = loadFromLocalStorage('sortOption', 'category');
        console.log('Initial sortOption value:', initial);
        return initial;
      });
    // const [bills, setBills] = useState(loadFromLocalStorage('bills', [
    //     { id: 1, name: 'Electricity Bill', amount: 120, category: 'Utilities', dueDate: '2025-04-05' },
    //     { id: 2, name: 'Rent', amount: 800, category: 'Housing', dueDate: '2025-04-01' },
    //     { id: 3, name: 'Internet Bill', amount: 60, category: 'Utilities', dueDate: '2025-04-10' },
    //     { id: 4, name: 'Phone Bill', amount: 45, category: 'Utilities', dueDate: '2025-04-07' },
    //     { id: 5, name: 'Gym Membership', amount: 40, category: 'Fitness', dueDate: '2025-04-03' },
    // ]));
    const [paidBills, setPaidBills] = useState(loadFromLocalStorage('paidBills', {}));
    const [categoryColors, setCategoryColors] = useState(loadFromLocalStorage('categoryColors', {
        Utilities: '#64b5f6',
        Fitness: '#81c784',
        Housing: '#f48fb1',
    }));

    const paidBillsCount = Object.values(paidBills).filter(Boolean).length;
    const unpaidBillsCount = bills.length - paidBillsCount;

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [newBill, setNewBill] = useState({
        name: '',
        category: '',
        amount: '',
        dueDate: '',
    });
    const [editBill, setEditBill] = useState(null);
    const isFormValid = newBill.name && newBill.amount && newBill.dueDate && (
        newBill.category !== 'Other' ? newBill.category : newBill.customCategory
      );   

    const handleDeleteBill = (id) => {
        setBills(prevBills => prevBills.filter(bill => bill.id !== id));
        setPaidBills(prev => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });
    };

    const handleEditClick = (bill) => {
        setEditBill(bill);  // Set the bill to be edited
        setNewBill({
            name: bill.name,
            category: bill.category,
            amount: bill.amount.toString(),
            dueDate: bill.dueDate,
        });
        setEditOpen(true);  // Open edit dialog
    };

    const getRandomPastelColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 80%)`; // Soft pastel
    };
    useEffect(() => {
        setCategoryColors(prevColors => {
            const updatedColors = { ...prevColors };
            bills.forEach(bill => {
                if (!updatedColors[bill.category]) {
                    // Assign a random pastel color if the category is new
                    updatedColors[bill.category] = getRandomPastelColor();
                }
            });
            return updatedColors;
        });
    }, [bills]);
    

    const sortedBills = [...bills].sort((a, b) => {
        if (sortOption === 'category') {
            return a.category.localeCompare(b.category);
        } else if (sortOption === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortOption === 'paidStatus') {
            // Sorting by paid status (paid bills come first)
            const paidA = paidBills[a.id] ? 1 : 0;
            const paidB = paidBills[b.id] ? 1 : 0;
            return paidA - paidB; // Unpaid bills come first
        }
        return 0;
    });

    const togglePaidStatus = (id) => {
        setPaidBills(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        const savedBills = loadFromLocalStorage('bills', []);
        const savedPaidBills = loadFromLocalStorage('paidBills', {});
        const savedSortOption = loadFromLocalStorage('sortOption', 'category');
        const savedCategoryColors = loadFromLocalStorage('categoryColors', {});

        if (savedBills.length > 0) setBills(savedBills);
        if (Object.keys(savedPaidBills).length > 0) setPaidBills(savedPaidBills);
        setSortOption(savedSortOption);
        setCategoryColors(savedCategoryColors);
    }, []);

    useEffect(() => {
        saveToLocalStorage('bills', bills);
        saveToLocalStorage('paidBills', paidBills);
        saveToLocalStorage('sortOption', sortOption);
        saveToLocalStorage('categoryColors', categoryColors);
    }, [bills, paidBills, sortOption, categoryColors]);


    
    return (
        <Box sx={{ padding: 2}}>
            <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold' }}>
                Bills Overview
            </Typography>

            <Grid2 container spacing={4} justifyContent="center" sx={{ marginTop: 4 }}>
                {/* Paid Circle */}
                <Grid2 item>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                backgroundColor: '#4CAF50',
                                border: '2px dashed #388E3C',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h5" color="white">
                                {paidBillsCount}
                            </Typography>
                        </Avatar>
                        <Typography variant='subtitle1' color='textSecondary'>
                            Paid
                        </Typography>
                    </Box>
                </Grid2>
                {/* Unpaid Circle */}
                <Grid2 item>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                backgroundColor: '#F44336',
                                border: '2px dashed #D32F2F',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h5" color="white">
                                {unpaidBillsCount}
                            </Typography>
                        </Avatar>
                        <Typography variant="subtitle1" color="textSecondary">
                            Unpaid
                        </Typography>
                    </Box>
                </Grid2>
            </Grid2>
            {/* Sorting Options */}
            <Box display="flex" justifyContent="space-between" mb={2}>
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        label="Sort By"
                    >
                        <MenuItem value="category">Category</MenuItem>
                        <MenuItem value="dueDate">Due Date</MenuItem>
                        <MenuItem value="paidStatus">Unpaid</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {/* Scrollable List of Bills */}
            <Box sx={{ 
                maxHeight: 400, 
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: 8, // Make the scrollbar wider
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'black', 
                    borderRadius: 4,
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f0f0f0', // Light color for the track
                    borderRadius: 4,
                }
            }}>
                {/* Use a Box with column direction to stack the cards vertically */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {sortedBills.map((bill) => (
                        <Card key={bill.id} sx={{ 
                            position: 'relative',
                            display: 'flex',
                            padding: 2,
                            paddingLeft: 6,
                            opacity: paidBills[bill.id] ? 0.5 : 1,
                            backgroundColor: paidBills[bill.id] ? grey[200] : 'white',
                        }}>
                            {/* Floating Checkbox in Top-Left */}
                            <Checkbox
                                checked={!!paidBills[bill.id]}
                                onChange={() => togglePaidStatus(bill.id)}
                                color="success"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    borderRadius: '8px',
                                    padding: '4px',
                                }}
                            />
                            {/* Delete Icon */}
                            <DeleteIcon
                                onClick={() => handleDeleteBill(bill.id)}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    color: 'error.main',
                                }}
                            />
                            <EditIcon 
                                onClick={() => handleEditClick(bill)} 
                                sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 40, 
                                    color: 'primary.main' 
                                }} 
                            />
                            {/* Left section: Name and Amount */}
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{
                                    textDecoration: paidBills[bill.id] ? 'line-through' : 'none'
                                }}>{bill.name}</Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ textDecoration: paidBills[bill.id] ? 'line-through' : 'none' }}>
                                    Amount: ${bill.amount}
                                </Typography>
                            </Box>
                            
                            {/* Right section: Category and Due Date */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' , paddingRight: 10}}>
                            {/* Category with Oval Background */}
                            <Box
                                sx={{
                                    backgroundColor: categoryColors[bill.category] || '#cfcfcf', // Default to gray if no category match
                                    color: 'white',
                                    padding: '4px 12px', // Padding to make the text inside spacious
                                    borderRadius: '20px', // This makes the background oval/pill-shaped
                                    display: 'inline-block', // Ensures the background wraps the text only
                                    marginBottom: 1, // Optional: Adds some space between the category and due date
                                }}
                            >
                                <Typography variant="body2">{bill.category}</Typography>
                            </Box>
                            
                            {/* Due Date */}
                            <Typography variant="body2" color="textSecondary">
                                Due: {bill.dueDate}
                            </Typography>
                        </Box>
                        </Card>
                    ))}
                </Box>
            </Box>
            {/*add button*/}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginTop: 4 // Adds some space above the button
            }}>
                <Button
                    onClick={() => setOpen(true)}
                    sx={{
                        backgroundColor: '#ab47bc',
                        borderRadius: '50%',
                        width: 60, // Adjust size
                        height: 60, // Adjust size
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: 3, // Optional: Adds some shadow for effect
                        '&:hover': {
                            backgroundColor: 'primary.dark', // Darken on hover
                        },
                    }}
                    aria-label="add bill"
                >
                    <AddIcon sx={{ color: 'white' }} />
                </Button>
                <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                    Add a Bill
                </Typography>
            </Box>
            <Dialog open={open || editOpen} onClose={() => setOpen(false)}>
                <DialogTitle>{editOpen ? 'Edit Bill' : 'Add a New Bill'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                    label="Name"
                    value={newBill.name}
                    onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                    required
                    fullWidth
                    sx={{
                        mt:2,
                        '& label.Mui-focused': {
                          color: 'primary.main',
                        },
                        '& label .MuiFormLabel-asterisk': {
                          color: 'red',
                        },
                      }}
                    />
                    <TextField
                        label="Category"
                        value={newBill.category}
                        onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                        select
                        required
                        fullWidth
                        sx={{
                            '& label.Mui-focused': {
                            color: 'primary.main',
                            },
                            '& label .MuiFormLabel-asterisk': {
                            color: 'red',
                            },
                        }}
                        >
                        {['Other', ...[...new Set(bills.map(b => b.category))]].map((option) => (
                            <MenuItem key={option} value={option}>
                            {option}
                            </MenuItem>
                        ))}
                        </TextField>

                        {newBill.category === 'Other' && (
                        <TextField
                            label="New Category"
                            value={newBill.customCategory || ''}
                            onChange={(e) =>
                            setNewBill({ ...newBill, customCategory: e.target.value })
                            }
                            required
                            fullWidth
                            sx={{
                            '& label.Mui-focused': {
                                color: 'primary.main',
                            },
                            '& label .MuiFormLabel-asterisk': {
                                color: 'red',
                            },
                            }}
                        />
                    )}
                    <TextField
                    label="Amount"
                    type="number"
                    value={newBill.amount}
                    onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                    required
                    fullWidth
                    sx={{
                        '& label.Mui-focused': {
                          color: 'primary.main',
                        },
                        '& label .MuiFormLabel-asterisk': {
                          color: 'red',
                        },
                      }}
                    />
                    <TextField
                    label="Due Date"
                    type="date"
                    fullWidth
                    required
                    value={newBill.dueDate}
                    onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                    sx={{
                        '& .MuiInputBase-input::-webkit-datetime-edit': {
                        color: newBill.dueDate ? 'inherit' : 'transparent',
                        },
                        '& .MuiInputBase-input:focus::-webkit-datetime-edit': {
                        color: 'inherit',
                        },
                        '& label.Mui-focused': {
                        color: 'primary.main',
                        },
                        '& label .MuiFormLabel-asterisk': {
                        color: 'red',
                        },
                    }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                    variant="contained"
                    disabled={!isFormValid}
                    onClick={() => {
                        if (editOpen) {
                            // Edit existing bill
                            setBills(prevBills => prevBills.map(bill => bill.id === editBill.id ? { ...editBill, ...newBill } : bill));
                        } else {
                            const id = Date.now();
                            const newEntry = {
                                 ...newBill, 
                                 id, 
                                 amount: parseFloat(newBill.amount),
                                 category: newBill.category === 'Other' ? newBill.customCategory : newBill.category 
                            };
                            setBills([...bills, newEntry]);
                        }
                        setNewBill({ name: '', category: '', amount: '', dueDate: '' });
                        setOpen(false);
                        setEditOpen(false);
                    }}
                    >
                        {editOpen ? 'Save Changes' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};