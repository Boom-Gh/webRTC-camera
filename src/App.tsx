import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Live from './views/Live'
import Client from './views/Client'
function Home() {
  return (
    <div>
      <Link to="/client">client</Link>
      <br />
      <Link to="/live">live</Link>
    </div>
  )
  // return 
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client" element={<Client />} />
        <Route path="/live" element={<Live />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App