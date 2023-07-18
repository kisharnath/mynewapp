import CK from "./pages/CK";
import Usage from "./pages/Usage";
import { Routes,Route } from 'react-router-dom'
function App() {
  return (
    <Routes>
        <Route path="/" element={<CK/>} />
        <Route path="/Usage" element={<Usage/>} />
    </Routes>
    
  );
}

export default App;
