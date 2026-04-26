import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import AdminDashboard from './pages/AdminDashboard'
import AdminResourceManagement from './pages/resources/AdminResourceManagement'
import Unauthorized from './pages/Unauthorized'
import CreateTicket from './pages/CreateTicket'
import TicketDashboard from './pages/TicketDashboard'
import TicketDetails from './pages/TicketDetails'
import StudentDashboard from './pages/StudentDashboard'
import { ResourceProvider } from './pages/resources/ResourceContext'

// Wrap a page in the Module-C sidebar Layout
function WithLayout({ children }) {
  return <Layout>{children}</Layout>
}

// Sends users to the right home based on role
function RoleHome() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user.role === 'TECHNICIAN') return <Navigate to="/dashboard" replace />
  return <Navigate to="/my-tickets" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Technician master ticket dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="TECHNICIAN">
                <WithLayout><TicketDashboard /></WithLayout>
              </ProtectedRoute>
            }
          />

          {/* Student personal dashboard */}
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute requiredRole="USER">
                <WithLayout><StudentDashboard /></WithLayout>
              </ProtectedRoute>
            }
          />

          {/* File a new ticket — students only (technicians don't file tickets) */}
          <Route
            path="/create-ticket"
            element={
              <ProtectedRoute requiredRole="USER">
                <WithLayout><CreateTicket /></WithLayout>
              </ProtectedRoute>
            }
          />

          {/* Ticket detail — both roles */}
          <Route
            path="/ticket/:id"
            element={
              <ProtectedRoute>
                <WithLayout><TicketDetails /></WithLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Resource Management */}
          <Route
            path="/admin/resources"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ResourceProvider>
                  <AdminResourceManagement />
                </ResourceProvider>
              </ProtectedRoute>
            }
          />

          {/* Default — route by role */}
          <Route path="/" element={<RoleHome />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
