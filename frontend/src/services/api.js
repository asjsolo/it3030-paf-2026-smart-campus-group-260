import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally: clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const getMe = () => api.get('/auth/me')
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)

// Admin user management
export const getAllUsers = () => api.get('/admin/users')
export const getUser = (id) => api.get(`/admin/users/${id}`)
export const createUser = (data) => api.post('/admin/users', data)
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data)
export const toggleUserActive = (id) => api.patch(`/admin/users/${id}/active`)
export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, null, { params: { role } })

// Tickets
export const getTickets = () => api.get('/tickets')
export const getTicket = (id) => api.get(`/tickets/${id}`)
export const createTicket = (formData) => api.post('/tickets', formData)
export const updateTicketStatus = (id, status, notes) =>
  api.put(`/tickets/${id}/status`, null, { params: { status, notes } })
export const assignTechnician = (id, technician) =>
  api.put(`/tickets/${id}/assign`, null, { params: { technician } })
export const rejectTicket = (id, reason) =>
  api.put(`/tickets/${id}/reject`, null, { params: { reason } })

// Attachments
export const uploadAttachment = (ticketId, file) => {
  const fd = new FormData()
  fd.append('file', file)
  return api.post(`/tickets/${ticketId}/attachments`, fd)
}
export const attachmentUrl = (id) => `/api/attachments/${id}`

// Comments
export const addComment = (ticketId, data) =>
  api.post(`/tickets/${ticketId}/comments`, data)
export const editComment = (id, content) =>
  api.put(`/comments/${id}`, { content })
export const deleteComment = (id) => api.delete(`/comments/${id}`)

export default api
