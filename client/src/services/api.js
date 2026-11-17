const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function api(path, options = {}) {
  const token = localStorage.getItem('luma_token');
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Cannot reach the API. Check that the server is running on port 5000.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const isPublicAuth = path.startsWith('/auth/login') || path.startsWith('/auth/register');
    if (response.status === 401 && token && !isPublicAuth) {
      localStorage.removeItem('luma_token');
      window.dispatchEvent(new Event('luma:unauthorized'));
    }
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}
