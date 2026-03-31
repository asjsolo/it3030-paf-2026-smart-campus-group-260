import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        {/* Later, you can add your <Navbar /> component here so it shows on every page */}
        
        <Routes>
          {/* Your teammates will add their routes here! */}
          <Route path="/" element={<h1>Smart Campus System</h1>} />
          
          {/* Example of how you will add your Module C later: */}
          {/* <Route path="/tickets" element={<TicketPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;