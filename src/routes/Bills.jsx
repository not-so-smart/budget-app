import React from 'react';
import { Avatar, Box, Card, CardContent, Typography, Button, Grid2, useTheme, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router';
import { useState } from 'react';
import { grey } from '@mui/material/colors';

export default function Bills() {
    // Feel free to ignore this, it's just an example of how to use the 
    // useParams hook in case we need to implement deep linking in the future
    const { id } = useParams();
    const paidBillsCount = 5;
    const unpaidBillsCount = 3;
    const [sortOption, setSortOption] = useState('category');
    const bills = [
        { id: 1, name: 'Electricity Bill', amount: 120, category: 'Utilities', dueDate: '2025-04-05' },
        { id: 2, name: 'Rent', amount: 800, category: 'Housing', dueDate: '2025-04-01' },
        { id: 3, name: 'Internet Bill', amount: 60, category: 'Utilities', dueDate: '2025-04-10' },
        { id: 4, name: 'Phone Bill', amount: 45, category: 'Utilities', dueDate: '2025-04-07' },
        { id: 5, name: 'Gym Membership', amount: 40, category: 'Fitness', dueDate: '2025-04-03' },
    ];

    const sortedBills = [...bills].sort((a, b) => {
        if (sortOption === 'category') {
            return a.category.localeCompare(b.category);
        } else if (sortOption === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
    });

    const categoryColors = {
        Utilities: '#64b5f6', // Light blue for Utilities
        Fitness: '#81c784',  // Light green for Internet
        Housing: '#f48fb1',      // Light pink for Rent
    };
    
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
                        <Card key={bill.id} sx={{ display: 'flex', padding: 2 }}>
                            {/* Left section: Name and Amount */}
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{bill.name}</Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Amount: ${bill.amount}
                                </Typography>
                            </Box>
                            
                            {/* Right section: Category and Due Date */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
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
        </Box>
    );
};