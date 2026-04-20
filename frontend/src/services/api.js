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

export const getMe = () => api.get('/auth/me')
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getAllUsers = () => api.get('/admin/users')
export const getUser = (id) => api.get(`/admin/users/${id}`)
export const createUser = (data) => api.post('/admin/users', data)
export const updateUser = (id, data) => api.put(`/admin/users/${id}`, data)
export const toggleUserActive = (id) => api.patch(`/admin/users/${id}/active`)
export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, null, { params: { role } })

export default api
