import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; full_name?: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  logout: () => {
    localStorage.removeItem('access_token')
    window.location.href = '/login'
  },
}

// Workspace API
export const workspaceApi = {
  list: () =>
    api.get('/workspaces'),
  
  create: (data: { name: string; description?: string; slug?: string }) =>
    api.post('/workspaces', data),
  
  get: (id: number) =>
    api.get(`/workspaces/${id}`),
  
  update: (id: number, data: { name?: string; description?: string }) =>
    api.patch(`/workspaces/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/workspaces/${id}`),
  
  listMembers: (id: number) =>
    api.get(`/workspaces/${id}/members`),
  
  inviteMember: (id: number, data: { email: string; role: string }) =>
    api.post(`/workspaces/${id}/members`, data),
  
  removeMember: (workspaceId: number, memberId: number) =>
    api.delete(`/workspaces/${workspaceId}/members/${memberId}`),
  
  getUsage: (id: number) =>
    api.get(`/workspaces/${id}/usage`),
}

// Project API
export const projectApi = {
  list: (workspaceId: number) =>
    api.get(`/projects?workspace_id=${workspaceId}`),
  
  create: (workspaceId: number, data: { name: string; description?: string; template_id?: string }) =>
    api.post(`/projects?workspace_id=${workspaceId}`, data),
  
  get: (id: number) =>
    api.get(`/projects/${id}`),
  
  update: (id: number, data: { name?: string; description?: string; is_archived?: boolean }) =>
    api.patch(`/projects/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/projects/${id}`),
}

// Generation API (to be implemented)
export const generationApi = {
  start: (projectId: number, data: { prompt: string; template_id?: string }) =>
    api.post(`/generations`, { project_id: projectId, ...data }),
  
  get: (id: number) =>
    api.get(`/generations/${id}`),
  
  approve: (id: number, spec: any) =>
    api.post(`/generations/${id}/approve`, { spec }),
  
  cancel: (id: number) =>
    api.post(`/generations/${id}/cancel`),
}

// Deployment API (to be implemented)
export const deploymentApi = {
  create: (projectId: number, data: { version_id: number; provider: string; env_vars?: Record<string, string> }) =>
    api.post(`/deployments`, { project_id: projectId, ...data }),
  
  get: (id: number) =>
    api.get(`/deployments/${id}`),
  
  list: (projectId: number) =>
    api.get(`/deployments?project_id=${projectId}`),
}

export default api
