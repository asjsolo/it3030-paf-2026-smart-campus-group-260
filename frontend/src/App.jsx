import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CampusDashboard from "./pages/resources/CampusDashboard"
import AdminResourceManagement from './pages/resources/AdminResourceManagement';
import { ResourceProvider } from './pages/resources/ResourceContext';

function App() {
  return (
    <Router>
      <div>
        {/* Later, you can add your <Navbar /> component here so it shows on every page */}

        {/* ResourceProvider wraps both routes so Admin changes reflect on the Dashboard */}
        <ResourceProvider>
          <Routes>
            {/* Your teammates will add their routes here! */}
            <Route path="/" element={<h1>Smart Campus System</h1>} />
            <Route path="/resource" element={<CampusDashboard />} />
            <Route path="/resource-management" element={<AdminResourceManagement />} />

            {/* Example of how you will add your Module C later: */}
            {/* <Route path="/tickets" element={<TicketPage />} /> */}
          </Routes>
        </ResourceProvider>
      </div>
    </Router>
  );
}

export default App;