const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body, token, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const error = new Error(payload?.message || 'Something went wrong');
    error.status = response.status;
    error.errors = payload?.errors || [];
    throw error;
  }

  return payload;
}

export const api = {
  login: (credentials) => request('/api/auth/login', { method: 'POST', body: credentials }),
  me: (token) => request('/api/auth/me', { token }),

  getPlaces: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== '' && value != null)
    ).toString();
    return request(`/api/places${query ? `?${query}` : ''}`);
  },
  getPlace: (slug) => request(`/api/places/${slug}`),
  getCategories: () => request('/api/categories'),

  adminStats: (token) => request('/api/admin/stats', { token }),
  adminPlaces: (token) => request('/api/admin/places', { token }),
  adminPlace: (id, token) => request(`/api/admin/places/${id}`, { token }),
  createPlace: (data, token) => request('/api/admin/places', { method: 'POST', body: data, token }),
  updatePlace: (id, data, token) =>
    request(`/api/admin/places/${id}`, { method: 'PUT', body: data, token }),
  deletePlace: (id, token) => request(`/api/admin/places/${id}`, { method: 'DELETE', token }),
  uploadImage: (file, token) => {
    const form = new FormData();
    form.append('image', file);
    return request('/api/admin/upload', { method: 'POST', body: form, token, isForm: true });
  },
  createCategory: (data, token) =>
    request('/api/admin/categories', { method: 'POST', body: data, token }),
  updateCategory: (id, data, token) =>
    request(`/api/admin/categories/${id}`, { method: 'PUT', body: data, token }),
  deleteCategory: (id, token) =>
    request(`/api/admin/categories/${id}`, { method: 'DELETE', token }),
};

export function resolveImage(url) {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
  return url;
}
