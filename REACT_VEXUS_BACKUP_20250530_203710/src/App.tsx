import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import About from './pages/About';
import Calculator from './pages/Calculator';
import ImageAtlas from './pages/ImageAtlas';
import ImageAtlasDebug from './pages/ImageAtlasDebug';
import Waveform from './pages/Waveform';
import Team from './pages/Team';
import Publications from './pages/Publications';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/image-atlas" element={<ImageAtlas />} />
          <Route path="/image-atlas-debug" element={<ImageAtlasDebug />} />
          <Route path="/waveform" element={<Waveform />} />
          <Route path="/team" element={<Team />} />
          <Route path="/publications" element={<Publications />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
