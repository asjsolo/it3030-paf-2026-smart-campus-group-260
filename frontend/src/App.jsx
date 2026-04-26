import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import AdminDashboard from './pages/AdminDashboard'
import AdminResourceManagement from './pages/resources/AdminResourceManagement'
import CampusDashboard from './pages/resources/CampusDashboard'
import Unauthorized from './pages/Unauthorized'
import CreateTicket from './pages/CreateTicket'
import TicketDashboard from './pages/TicketDashboard'
import TicketDetails from './pages/TicketDetails'
import StudentDashboard from './pages/StudentDashboard'
import { ResourceProvider } from './pages/resources/ResourceContext'

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

          {/* File a new ticket — students only */}
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

          {/* Admin — User Management */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <WithAdminLayout><AdminDashboard /></WithAdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin — Resource Management */}
          <Route
            path="/admin/resources"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ResourceProvider>
                  <WithAdminLayout><AdminResourceManagement /></WithAdminLayout>
                </ResourceProvider>
              </ProtectedRoute>
            }
          />

          {/* Campus Resource Dashboard — all authenticated users */}
          <Route
            path="/campus"
            element={
              <ProtectedRoute>
                <ResourceProvider>
                  <CampusDashboard />
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
