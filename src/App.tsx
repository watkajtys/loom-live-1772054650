import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LegacyApp from './LegacyApp';
import LofiLoom from './components/lofi/LofiLoom';
import KeepsakeApp from './components/keepsake/KeepsakeApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LofiLoom />} />
        <Route path="/legacy" element={<LegacyApp />} />
        <Route path="/echo" element={<KeepsakeApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
