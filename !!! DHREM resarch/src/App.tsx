import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FacultyPage from './pages/FacultyPage';
import ResearchPage from './pages/ResearchPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/research" element={<ResearchPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App; 