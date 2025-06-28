// React import removed as it's not needed in React 17+
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import PocusApp from './pages/PocusApp';

// Create a default theme for the app
const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* POCUS Atlas Cardiology Gallery */}
          <Route path="/pocus" element={<PocusApp />} />
          <Route path="/pocus/*" element={<PocusApp />} />
          
          {/* Default route redirects to POCUS app */}
          <Route path="/" element={<Navigate to="/pocus" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/pocus" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 