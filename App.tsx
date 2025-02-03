import React, { useState, useEffect, Suspense } from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Layout from './Layout';
import { BrowserRouter } from 'react-router-dom';
import './App.css'; // Import the CSS file

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e1e1e',
    },
    secondary: {
      main: '#f44336',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

const App: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<div>Loading application...</div>}>
          <Layout role={role} setRole={setRole} />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
