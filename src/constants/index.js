// Các hằng số chung cho client

// API Base URL
export const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://honviet-server.onrender.com/api' 
  : 'http://localhost:5000/api';

// Danh sách email admin
export const ADMIN_EMAILS = [
  'adminhonviet@email.com',
  'admin@honviet.com',
  'honviet.admin@gmail.com',
  'admin@example.com'
];
