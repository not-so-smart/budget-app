import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import FlagIcon from '@mui/icons-material/Flag';
import PersonIcon from '@mui/icons-material/Person';
import { MemoryRouter, Route, Routes, Link, matchPath, useLocation } from 'react-router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import Home from './routes/Home';
import Bills from './routes/Bills';
import History from './routes/History';
import Goals from './routes/Goals';
import Profile from './routes/Profile'; 

// theme
const purpleTheme = createTheme({
  palette: {
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: '#47008F',
    },
  },
  components: {
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#A980B8',
          height: '80px',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: 'black',
          '&.Mui-selected': {
            color: 'black',
            '& .MuiBottomNavigationAction-label': {
              color: 'black',
            },
          },
          '& .MuiSvgIcon-root': {
            fontSize: '2.6rem',
          },
        },
      },
    },
  },
});

function useRouteMatch(patterns) {
  const { pathname } = useLocation();

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i];
    const possibleMatch = matchPath(pattern, pathname);
    if (possibleMatch !== null) {
      return possibleMatch;
    }
  }

  return null;
}

// navbar + routing
function MyBottomNavigation() {
  const routeMatch = useRouteMatch(['/home', '/bills/:id', '/history', '/goals', '/profile']);
  const currentTab = routeMatch?.pattern?.path;

  return (
    <BottomNavigation value={currentTab}>
      <BottomNavigationAction label="Home" value="/home" to="/home" component={Link} icon={<HomeIcon />} />
      <BottomNavigationAction label="Bills" value="/bills/:id" to="/bills/1" component={Link} icon={<ReceiptIcon />} />
      <BottomNavigationAction label="History" value="/history" to="/history" component={Link} icon={<HistoryIcon />} />
      <BottomNavigationAction label="Goals" value="/goals" to="/goals" component={Link} icon={<FlagIcon />} />
      <BottomNavigationAction label="Profile" value="/profile" to="/profile" component={Link} icon={<PersonIcon />} />
    </BottomNavigation>
  );
}


function AppContent() {
  // don't show top profile button on profile page
  const location = useLocation(); 
  const showProfileIcon = location.pathname !== '/profile';

  return (
    <>
      {showProfileIcon && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <Tooltip title="Profile">
            <IconButton component={Link} to="/profile" sx={{ bgcolor: '#ffffff', '&:hover': { bgcolor: '#e0e0e0' } }}>
              <PersonIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* routing */}
      <Box sx={{ width: '100%', flex: 1, overflow: 'auto' }}>
        <Box sx={{ p: '0 20px' }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/bills/:id" element={<Bills />} />
            <Route path="/history" element={<History />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <MyBottomNavigation />
      </Box>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={purpleTheme}>
      <CssBaseline />
      <Box sx={{ width: '640px', height: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', bgcolor: '#f3e5f5' }}>
        <MemoryRouter initialEntries={['/home']} initialIndex={0}>
          <AppContent />
        </MemoryRouter>
      </Box>
    </ThemeProvider>
  );
}