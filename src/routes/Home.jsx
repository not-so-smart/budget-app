import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

// sample data for the chart
const chartData = [
  { month: 'JAN', amount: 200 },
  { month: 'FEB', amount: 250 },
  { month: 'MAR', amount: 200 },
  { month: 'APR', amount: 50 },
  { month: 'MAY', amount: 150 },
];

// persona-based categories
const personaCategories = {
  student: ['school-supplies', 'tuition', 'work', 'personal', 'entertainment'],
  'single-working-adult': ['rent', 'groceries', 'entertainment', 'work', 'personal'],
  'married-working-adult': ['mortgage', 'family-expenses', 'work', 'personal', 'entertainment'],
  'married-stay-at-home-adult': ['household', 'family-expenses', 'groceries', 'work', 'personal', 'entertainment'],
  retired: ['healthcare', 'travel', 'hobbies', 'personal', 'entertainment'],
};

// default categories
const defaultCategories = ['personal', 'entertainment', 'work'];

// sample recent activity
const baseRecentActivity = [
  {
    title: 'Money For iPhone16',
    status: 'IN PROGRESS',
    amount: '$235.00',
    goal: '$799.00',
    date: '10/27/2025',
    category: 'personal',
  },
  {
    title: 'Movie Ticket @ AMC',
    type: 'SPENDINGS',
    amount: '$17.89',
    description: 'Spider with Anna',
    date: '10/20/2025',
    category: 'entertainment',
  },
  {
    title: 'Income -> ACS',
    type: 'SAVINGS',
    amount: '$2000.00',
    date: '10/15/2025',
    category: 'work',
  },
];

// map category values to display names
const getCategoryDisplayName = (category) => {
  switch (category) {
    case 'school-supplies':
      return 'School Supplies';
    case 'tuition':
      return 'Tuition';
    case 'work':
      return 'Work';
    case 'rent':
      return 'Rent';
    case 'groceries':
      return 'Groceries';
    case 'entertainment':
      return 'Entertainment';
    case 'mortgage':
      return 'Mortgage';
    case 'family-expenses':
      return 'Family Expenses';
    case 'household':
      return 'Household';
    case 'healthcare':
      return 'Healthcare';
    case 'travel':
      return 'Travel';
    case 'hobbies':
      return 'Hobbies';
    case 'personal':
      return 'Personal';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

export default function Home() {
  const [view, setView] = React.useState('spend');
  const [category, setCategory] = React.useState('');
  const [categories, setCategories] = React.useState(defaultCategories);
  const [recentActivity] = React.useState(baseRecentActivity);
  const [userName, setUserName] = useState(''); // State to hold the user's name

  // Load persona and name from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      const { persona, name } = JSON.parse(savedProfile);
      const newCategories = personaCategories[persona] || defaultCategories;
      setCategories(newCategories);
      setUserName(name); // Set the user's name from localStorage
    }
  }, []);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Chart legend component
  const ChartKey = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
        <Box sx={{ width: 20, height: 0, borderTop: '2px dashed #ff0000', mr: 1 }} />
        <Typography variant="body2" sx={{ color: 'black' }}>
          GOAL
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: 20, height: 0, borderTop: '2px dashed #0000ff', mr: 1 }} />
        <Typography variant="body2" sx={{ color: 'black' }}>
          YOU ARE HERE
        </Typography>
      </Box>
    </Box>
  );

  // Determine the progress title based on whether a name is set
  const progressTitle = userName ? `${userName}'s Progress` : 'Your Progress';

  return (
    <Box sx={{ p: 2 }}>
      {/* header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {progressTitle}
        </Typography>
      </Box>

      {/* chart section */}
      <Box sx={{ mb: 3 }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#000000" />
            <YAxis stroke="#000000" domain={[0, 300]} />
            <Tooltip />
            <ReferenceLine y={200} label={{ position: 'left', fill: '#ff0000' }} stroke="#ff0000" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="amount" stroke="#000000" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            <ReferenceLine x="MAR" label={{ position: 'right', fill: '#0000ff' }} stroke="#0000ff" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
        <ChartKey />
      </Box>

      {/* toggle between spending and receiving */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          sx={{ mb: 2, width: '100%', justifyContent: 'center' }}
        >
          <ToggleButton
            value="spend"
            sx={{
              flex: 1,
              bgcolor: view === 'spend' ? '#e0e0e0' : '#ce93d8',
              color: view === 'spend' ? '#ffffff' : '#000000',
              '&:hover': {
                bgcolor: view === 'spend' ? '#ab47bc' : '#ce93d8',
              },
            }}
          >
            SPEND
          </ToggleButton>
          <ToggleButton
            value="receive"
            sx={{
              flex: 1,
              bgcolor: view === 'receive' ? '#e0e0e0' : '#ce93d8',
              color: view === 'receive' ? '#ffffff' : '#000000',
              '&:hover': {
                bgcolor: view === 'receive' ? '#ab47bc' : '#ce93d8',
              },
            }}
          >
            RECEIVE
          </ToggleButton>
        </ToggleButtonGroup>

        {/* category dropdown */}
        <FormControl fullWidth>
          <InputLabel>Choose a category to see its chart</InputLabel>
          <Select
            value={category}
            label="Choose a category to see its chart"
            onChange={handleCategoryChange}
          >
            <MenuItem value="">SELECT</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {getCategoryDisplayName(cat)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* recent activity */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Your Recent Activity
      </Typography>
      {recentActivity.map((activity, index) => (
        <Card key={index} sx={{ mb: 2, bgcolor: '#e1bee7', borderRadius: '10px' }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {activity.title}
              </Typography>
              {activity.description && (
                <Typography variant="body2" color="textSecondary">
                  {activity.description}
                </Typography>
              )}
              {activity.status && (
                <Typography variant="body2" color="textSecondary">
                  {activity.status} YOU'RE AT {activity.amount}
                </Typography>
              )}
              {activity.type && (
                <Typography variant="body2" color="textSecondary">
                  {activity.type}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                DATE: {activity.date}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              {activity.amount && (
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {activity.amount}
                </Typography>
              )}
              {activity.goal && (
                <Typography variant="body2" color="textSecondary">
                  GOAL: {activity.goal}
                </Typography>
              )}
              <Chip
                label={getCategoryDisplayName(activity.category)}
                sx={{
                  mt: 1,
                  bgcolor:
                    activity.category === 'school-supplies' || activity.category === 'personal'
                      ? '#b2dfdb'
                      : activity.category === 'tuition' || activity.category === 'entertainment'
                      ? '#f8bbd0'
                      : activity.category === 'work' || activity.category === 'rent' || activity.category === 'mortgage' || activity.category === 'household' || activity.category === 'healthcare'
                      ? '#c5cae9'
                      : activity.category === 'groceries' || activity.category === 'family-expenses'
                      ? '#ffccbc'
                      : activity.category === 'travel' || activity.category === 'hobbies'
                      ? '#dcedc8'
                      : '#e0e0e0',
                  color: '#000000',
                }}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}