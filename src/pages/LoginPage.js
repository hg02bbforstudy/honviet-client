import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log('Đăng nhập:', form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-3 w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          className="mb-4 w-full border px-3 py-2 rounded"
          value={form.password}
          onChange={handleChange}
        />

        <button
          onClick={handleLogin}
          className="bg-honvietRed text-white w-full py-2 rounded hover:opacity-90 mb-3"
        >
          Đăng nhập
        </button>

        <p className="text-sm text-center mb-2">
          Chưa có tài khoản?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-honvietRed underline"
          >
            Đăng ký
          </button>
        </p>

        <p className="text-sm text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 underline"
          >
            Quay về trang chủ
          </button>
        </p>
      </div>
    </div>
  );
}
