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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
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
  // You need to provide the routes in descendant order.
  // This means that if you have nested routes like:
  // users, users/new, users/edit.
  // Then the order should be ['users/add', 'users/edit', 'users'].
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ width: '640px', height: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        <Router>
          <Box sx={{ width: '100%', flex: 1, overflow: 'auto' }}>
            <Box sx={{ p: '0 20px' }}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/bills/:id" element={<Bills />} />
                <Route path="/history" element={<History />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="*" element={<Home />} /> {/* Default route */}
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
