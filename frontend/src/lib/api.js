const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiError(`Cannot connect to the API at ${API_URL}. Start the backend and check VITE_API_URL.`);
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => '');

  if (!response.ok) {
    const message = typeof payload === 'object' && payload?.message
      ? payload.message
      : `Request failed (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

export const authApi = {
  me: () => apiRequest('/api/auth/me'),
  login: (email, password) => apiRequest('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password }),
  }),
  register: (name, email, password) => apiRequest('/api/auth/register', {
    method: 'POST', body: JSON.stringify({ name, email, password }),
  }),
  logout: () => apiRequest('/api/auth/logout', { method: 'POST' }),
};

export const researchApi = {
  list: (page = 1, limit = 30) => apiRequest(`/api/chat?page=${page}&limit=${limit}`),
  get: (id) => apiRequest(`/api/chat/${encodeURIComponent(id)}`),
  create: (query) => apiRequest('/api/chat', {
    method: 'POST', body: JSON.stringify({ query }),
  }),
  feedback: (id, rating, feedback) => apiRequest(`/api/chat/feedback/${encodeURIComponent(id)}`, {
    method: 'POST', body: JSON.stringify({ rating, feedback }),
  }),
};
