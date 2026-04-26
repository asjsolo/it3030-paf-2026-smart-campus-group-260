import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CampusDashboard from "./pages/resources/CampusDashboard"
import AdminResourceManagement from './pages/resources/AdminResourceManagement';
import { ResourceProvider } from './pages/resources/ResourceContext';

function App() {
  // Read from local storage on startup
  const [role, setRole] = useState(localStorage.getItem('userRole'));

  // Quick logout function for your navbar (optional, but helpful for testing)
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    setRole(null);
  };

function WithLayout({ children }) {
  return <Layout>{children}</Layout>
}

function WithAdminLayout({ children }) {
  return <AdminLayout>{children}</AdminLayout>
}

function RoleHome() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user.role === 'TECHNICIAN') return <Navigate to="/dashboard" replace />
  return <Navigate to="/my-tickets" replace />
}

export default function App() {
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
