import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CreateTicket from './pages/CreateTicket';
import TicketDashboard from './pages/TicketDashboard'; 
import TicketDetails from './pages/TicketDetails';
import MockLogin from './pages/MockLogin'; // <-- IMPORT THE MOCK LOGIN
import StudentDashboard from './pages/StudentDashboard';
import BookingRequestForm from './pages/BookingRequestForm';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';

function App() {
  // Read from local storage on startup
  const [role, setRole] = useState(localStorage.getItem('userRole'));

  // Quick logout function for your navbar (optional, but helpful for testing)
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setRole(null);
  };

  return (
    <Router>
      <Layout role={role} onLogout={handleLogout}>
        <Routes>
          {/* If no role, force them to the login screen */}
          {!role ? (
            <Route path="*" element={<MockLogin setRole={setRole} />} />
          ) : (
            <>
              {/* Authenticated Routes */}
              <Route path="/" element={<Navigate to={role === 'TECHNICIAN' ? "/dashboard" : "/create-ticket"} />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/my-tickets" element={<StudentDashboard />} /> {/* THE NEW ROUTE */}
              <Route path="/dashboard" element={<TicketDashboard />} />
              <Route path="/ticket/:id" element={<TicketDetails />} />
              
              {/* Booking Module Routes */}
              <Route path="/bookings/request" element={<BookingRequestForm />} />
              <Route path="/bookings/my" element={<MyBookings />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;