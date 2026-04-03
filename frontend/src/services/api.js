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
export const getAllUsers = () => api.get('/admin/users')
export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, null, { params: { role } })

export default api
