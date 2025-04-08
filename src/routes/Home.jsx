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

// Chart data
const schoolSuppliesData = [
  { month: 'JAN', amount: 50 },
  { month: 'FEB', amount: 80 },
  { month: 'MAR', amount: 30 },
  { month: 'APR', amount: 100 },
  { month: 'MAY', amount: 60 },
];

const tuitionData = [
  { month: 'JAN', amount: 7000 },
  { month: 'FEB', amount: 7000 },
  { month: 'MAR', amount: 6000 },
  { month: 'APR', amount: 8000 },
  { month: 'MAY', amount: 7000 },
];

const workData = [
  { month: 'JAN', amount: 5000 },
  { month: 'FEB', amount: 5000 },
  { month: 'MAR', amount: 5000 },
  { month: 'APR', amount: 5000 },
  { month: 'MAY', amount: 5000 },
];

const personalData = [
  { month: 'JAN', amount: 500 },
  { month: 'FEB', amount: 890 },
  { month: 'MAR', amount: 340 },
  { month: 'APR', amount: 100 },
  { month: 'MAY', amount: 60 },
];

const entertainmentData = [
  { month: 'JAN', amount: 50 },
  { month: 'FEB', amount: 40 },
  { month: 'MAR', amount: 30 },
  { month: 'APR', amount: 100 },
  { month: 'MAY', amount: 60 },
];

const rentData = [
  { month: 'JAN', amount: 2000 },
  { month: 'FEB', amount: 2000 },
  { month: 'MAR', amount: 2000 },
  { month: 'APR', amount: 2000 },
  { month: 'MAY', amount: 2000 },
];

const groceriesData = [
  { month: 'JAN', amount: 300 },
  { month: 'FEB', amount: 200 },
  { month: 'MAR', amount: 300 },
  { month: 'APR', amount: 100 },
  { month: 'MAY', amount: 600 },
];

const mortgageData = [
  { month: 'JAN', amount: 3000 },
  { month: 'FEB', amount: 3000 },
  { month: 'MAR', amount: 3000 },
  { month: 'APR', amount: 3000 },
  { month: 'MAY', amount: 3000 },
];

const familyExpensesData = [
  { month: 'JAN', amount: 500 },
  { month: 'FEB', amount: 800 },
  { month: 'MAR', amount: 320 },
  { month: 'APR', amount: 1300 },
  { month: 'MAY', amount: 690 },
];

const healthcareData = [
  { month: 'JAN', amount: 50 },
  { month: 'FEB', amount: 840 },
  { month: 'MAR', amount: 320 },
  { month: 'APR', amount: 100 },
  { month: 'MAY', amount: 630 },
];

const travelData = [
  { month: 'JAN', amount: 0 },
  { month: 'FEB', amount: 0 },
  { month: 'MAR', amount: 3900 },
  { month: 'APR', amount: 0 },
  { month: 'MAY', amount: 600 },
];

const hobbiesData = [
  { month: 'JAN', amount: 50 },
  { month: 'FEB', amount: 40 },
  { month: 'MAR', amount: 80 },
  { month: 'APR', amount: 100 },
  { month: 'MAY', amount: 60 },
];

const householdData = [
  { month: 'JAN', amount: 400 },
  { month: 'FEB', amount: 300 },
  { month: 'MAR', amount: 780 },
  { month: 'APR', amount: 100 },
  { month: 'MAY', amount: 610 },
];

const defaultChartData = [
  { month: 'JAN', amount: 200 },
  { month: 'FEB', amount: 250 },
  { month: 'MAR', amount: 200 },
  { month: 'APR', amount: 50 },
  { month: 'MAY', amount: 150 },
];

// Persona-based categories
const personaCategories = {
  student: ['school-supplies', 'tuition', 'work', 'personal', 'entertainment'],
  'single-working-adult': ['rent', 'groceries', 'entertainment', 'work', 'personal'],
  'married-working-adult': ['mortgage', 'family-expenses', 'work', 'personal', 'entertainment'],
  'married-stay-at-home-adult': ['household', 'family-expenses', 'groceries', 'work', 'personal', 'entertainment'],
  retired: ['healthcare', 'travel', 'hobbies', 'personal', 'entertainment'],
};

const defaultCategories = ['personal', 'entertainment', 'work'];

// Sample recent activity
const baseRecentActivity = [
  {
    title: 'Money For iPhone16',
    type: 'SAVINGS',
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

// Map category values to display names
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

// Map categories to their data
const categoryDataMap = {
  'school-supplies': schoolSuppliesData,
  tuition: tuitionData,
  work: workData,
  personal: personalData,
  entertainment: entertainmentData,
  rent: rentData,
  groceries: groceriesData,
  mortgage: mortgageData,
  'family-expenses': familyExpensesData,
  healthcare: healthcareData,
  travel: travelData,
  hobbies: hobbiesData,
  household: householdData,
};

// Define category-specific goals for "spend" and "save"
const categoryGoals = {
  'school-supplies': { spend: 200, save: 300 },
  tuition: { spend: 1, save: 12000 },
  work: { spend: 1, save: 8000 },
  personal: { spend: 1000, save: 1500 },
  entertainment: { spend: 200, save: 300 },
  rent: { spend: 1, save: 3000 },
  groceries: { spend: 800, save: 1000 },
  mortgage: { spend: 1, save: 4000 },
  'family-expenses': { spend: 1500, save: 2000 },
  healthcare: { spend: 1000, save: 1500 },
  travel: { spend: 4000, save: 5000 },
  hobbies: { spend: 200, save: 300 },
  household: { spend: 1000, save: 1500 },
  default: { spend: 600, save: 800 },
};

// Add getCategoryColor function from the first code
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

export default function Home() {
  const [view, setView] = React.useState('spend');
  const [category, setCategory] = React.useState('');
  const [categories, setCategories] = React.useState(defaultCategories);
  const [recentActivity] = React.useState(baseRecentActivity);
  const [userName, setUserName] = useState('');
  const [chartDataState, setChartDataState] = React.useState(defaultChartData);

  useEffect(() => {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      const { persona, name } = JSON.parse(savedProfile);
      const newCategories = personaCategories[persona] || defaultCategories;
      setCategories(newCategories);
      setUserName(name);
    }
  }, []);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    if (selectedCategory && categoryDataMap[selectedCategory]) {
      setChartDataState(categoryDataMap[selectedCategory]);
    } else {
      setChartDataState(defaultChartData);
    }
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

  const progressTitle = userName ? `${userName}'s Progress` : 'Your Progress';
  const goalLineValue = category && categoryGoals[category]
    ? categoryGoals[category][view]
    : categoryGoals.default[view];
  const maxDataValue = Math.max(...chartDataState.map((data) => data.amount));
  const yAxisMax = Math.max(maxDataValue * 1.2, goalLineValue * 1.2);

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {progressTitle}
        </Typography>
      </Box>

      {/* Chart section (exactly as in the original second code) */}
      <Box sx={{ mb: 3 }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartDataState} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#000000" />
            <YAxis stroke="#000000" domain={[0, yAxisMax]} />
            <Tooltip />
            <ReferenceLine y={goalLineValue} label={{ position: 'left', fill: '#ff0000' }} stroke="#ff0000" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="amount" stroke="#000000" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            <ReferenceLine x="APR" label={{ position: 'right', fill: '#0000ff' }} stroke="#0000ff" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
        <ChartKey />
      </Box>

      {/* Toggle between spending and saving */}
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
            value="save"
            sx={{
              flex: 1,
              bgcolor: view === 'save' ? '#e0e0e0' : '#ce93d8',
              color: view === 'save' ? '#ffffff' : '#000000',
              '&:hover': {
                bgcolor: view === 'save' ? '#ab47bc' : '#ce93d8',
              },
            }}
          >
            SAVE
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Category dropdown */}
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

      {/* Recent activity with unified card design */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Your Recent Activity
      </Typography>
      {recentActivity.map((activity, index) => {
        const isSaving = activity.type === 'SAVINGS';
        const amountValue = parseFloat(activity.amount.replace('$', ''));

        return (
          <Card
            key={index}
            sx={{
              mb: 2,
              bgcolor: isSaving ? '#e1bee7' : '#000000',
              color: isSaving ? '#000000' : '#ffffff',
              borderRadius: '10px',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    wordBreak: 'break-word',
                    maxWidth: '70%',
                    color: isSaving ? '#000000' : '#ffffff',
                  }}
                >
                  {activity.title.length > 30
                    ? `${activity.title.substring(0, 30)}...`
                    : activity.title}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                <Typography
                  variant="body1"
                  sx={{
                    flex: 1,
                    pr: 2,
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    color: isSaving ? '#000000' : '#ffffff',
                  }}
                >
                  {activity.description || (activity.status ? `${activity.status} YOU'RE AT ${activity.amount}` : activity.type || '')}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    minWidth: '80px',
                    textAlign: 'right',
                    color: isSaving ? '#000000' : '#ffffff',
                  }}
                >
                  ${amountValue.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
                <Typography
                  variant="body1"
                  sx={{ color: isSaving ? '#000000' : '#ffffff' }}
                >
                  DATE: {activity.date}
                </Typography>
                <Chip
                  label={getCategoryDisplayName(activity.category)}
                  size="small"
                  sx={{
                    bgcolor: getCategoryColor(activity.category),
                    color: '#000000',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}