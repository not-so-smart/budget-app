import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import FlagIcon from '@mui/icons-material/Flag';
import { MemoryRouter, Route, Routes, Link, matchPath, useLocation, StaticRouter } from 'react-router';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Home from './routes/Home';
import Bills from './routes/Bills';
import History from './routes/History';
import Goals from './routes/Goals';

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
          height: '80px'
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
            fontSize: '2.6rem', // Larger icon size (default is 1.5rem)
          },
        },
      },
    },
  },
});

function Router(props) {
  const { children } = props;
  if (typeof window === 'undefined') {
    return <StaticRouter location="/home">{children}</StaticRouter>;
  }

  return (
    <MemoryRouter initialEntries={['/home']} initialIndex={0}>
      {children}
    </MemoryRouter>
  );
}

Router.propTypes = {
  children: PropTypes.node,
};

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

function MyBottomNavigation() {
  const routeMatch = useRouteMatch(['/home', '/bills/:id', '/history', '/goals']);
  const currentTab = routeMatch?.pattern?.path;

  return (
    <BottomNavigation value={currentTab}>
      <BottomNavigationAction label="Home" value="/home" to="/home" component={Link} icon={<HomeIcon />} />
      <BottomNavigationAction label="Bills" value="/bills/:id" to="/bills/1" component={Link} icon={<ReceiptIcon />} />
      <BottomNavigationAction label="History" value="/history" to="/history" component={Link} icon={<HistoryIcon />} />
      <BottomNavigationAction label="Goals" value="/goals" to="/goals" component={Link} icon={<FlagIcon />} />
    </BottomNavigation>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={purpleTheme}>
      <CssBaseline />
      <Box sx={{ width: '640px', height: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', bgcolor: '#f3e5f5' }}>
        <Router>
          <Box sx={{ width: '100%', flex: 1, overflow: 'auto' }}>
            <Box sx={{ p: '0 20px' }}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/bills/:id" element={<Bills />} />
                <Route path="/history" element={<History />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Box>
          </Box>
          <Box sx={{ width: '100%' }}>
            <MyBottomNavigation />
          </Box>
        </Router>
      </Box>
    </ThemeProvider>
  );
}