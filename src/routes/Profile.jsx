import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { Snackbar } from '@mui/material';

export default function Profile() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // saving data functions
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('profileData');
    return savedData
      ? JSON.parse(savedData)
      : {
          name: '',
          habits: '',
          literacy: '',
          persona: '',
        };
  });

  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      setSavedData(JSON.parse(savedData));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    //for bills stuff
    const oldData = JSON.parse(localStorage.getItem('profileData') || '{}');
    const oldPersona = oldData.persona;
    localStorage.setItem('profileData', JSON.stringify(formData));
    if (oldPersona && oldPersona !== formData.persona) {
      localStorage.setItem('personaChanged', 'true');
      localStorage.setItem('lastPersona', oldPersona); // store what it was before
    } else {
      localStorage.setItem('personaChanged', 'false');
    }
    setSavedData(formData);
  

    setSnackbarMessage('User profile successfully saved!');
    setSnackbarOpen(true);
  };

  // Handle button click for showing "Implementation coming soon"
  const handleInfoClick = () => {
    setSnackbarMessage('Implementation coming soon');
    setSnackbarOpen(true);
  };

  // handle closing the snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        Profile
      </Typography>
      {/* form fields */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />

        <FormControl fullWidth required>
          <InputLabel>Persona</InputLabel>
          <Select
            name="persona"
            value={formData.persona}
            onChange={handleChange}
            label="Persona"
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="single-working-adult">Single Working Adult</MenuItem>
            <MenuItem value="married-working-adult">Married Working Adult</MenuItem>
            <MenuItem value="married-stay-at-home-adult">Married Stay-at-Home Adult</MenuItem>
            <MenuItem value="retired">Retired</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Spending Habits</InputLabel>
            <Select
              name="habits"
              value={formData.habits}
              onChange={handleChange}
              label="Spending Habits"
            >
              <MenuItem value="save">I save most of it</MenuItem>
              <MenuItem value="balanced">I save and spend equally</MenuItem>
              <MenuItem value="lavish">I spend more than I save</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={handleInfoClick} size="small" title="More Info">
            <InfoIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Financial Literacy</InputLabel>
            <Select
              name="literacy"
              value={formData.literacy}
              onChange={handleChange}
              label="Financial Literacy"
            >
              <MenuItem value="beginner">I'm new to this</MenuItem>
              <MenuItem value="intermediate">I know the basics</MenuItem>
              <MenuItem value="advanced">I'm very financially literate</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={handleInfoClick} size="small" title="More Info">
            <InfoIcon />
          </IconButton>
        </Box>

        

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: '#A980B8',
            color: '#ffffff',
            '&:hover': { bgcolor: '#8e24aa' },
            mt: 2,
          }}
        >
          Save Profile
        </Button>
      </Box>

      {/* snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}