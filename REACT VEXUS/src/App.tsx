import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { fontFamily } from './config/fonts';
import FontLoader from './components/FontLoader';

// Import pages
import Home from './pages/Home';
import Waveform from './pages/Waveform';
import Education from './pages/Education';
import Acquisition from './pages/Acquisition';
import Literature from './pages/Literature';
import Publications from './pages/Publications';
import About from './pages/About';
import ImageAtlas from './pages/ImageAtlas';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Calculator from './pages/Calculator';

// Create MUI theme with Europa font
const theme = createTheme({
  typography: {
    fontFamily: fontFamily,
    h1: {
      fontFamily: fontFamily,
      fontWeight: 800,
    },
    h2: {
      fontFamily: fontFamily,
      fontWeight: 700,
    },
    h3: {
      fontFamily: fontFamily,
      fontWeight: 600,
    },
    h4: {
      fontFamily: fontFamily,
      fontWeight: 600,
    },
    h5: {
      fontFamily: fontFamily,
      fontWeight: 500,
    },
    h6: {
      fontFamily: fontFamily,
      fontWeight: 500,
    },
    body1: {
      fontFamily: fontFamily,
    },
    body2: {
      fontFamily: fontFamily,
    },
    button: {
      fontFamily: fontFamily,
      textTransform: 'none',
    },
  },
  palette: {
    background: {
      default: '#f5f7fa',
    },
    text: {
      primary: '#212121',
      secondary: '#424242',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: fontFamily,
        },
        '*': {
          fontFamily: fontFamily,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: fontFamily,
          textTransform: 'none',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: fontFamily,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FontLoader showLoadingScreen={false}>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/waveform" element={<Waveform />} />
            <Route path="/education" element={<Education />} />
            <Route path="/acquisition" element={<Acquisition />} />
            <Route path="/literature" element={<Literature />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/about" element={<About />} />
            <Route path="/image-atlas" element={<ImageAtlas />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </Router>
      </FontLoader>
    </ThemeProvider>
  );
};

export default App;
