import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PomodoroTimer from './components/PomodoroTimer';

const theme = createTheme({
  palette: {
    error: {
      main: '#d32f2f',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 50%, #ef9a9a 100%)',
        padding: '20px',
      }}>
        <PomodoroTimer />
      </div>
    </ThemeProvider>
  );
}

export default App;
