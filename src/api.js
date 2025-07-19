// Tự động chọn API_BASE theo môi trường online/offline
const API_BASE =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://honviet-server.onrender.com/api';
export const fetchPosts = async () => {
  const res = await fetch(`${API_BASE}/posts`);
  return res.json();
};

export const registerUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
