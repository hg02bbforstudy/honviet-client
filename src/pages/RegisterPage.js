import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    // Gửi dữ liệu đăng ký ở đây
    console.log('Đăng ký:', form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Đăng ký thành viên</h2>

        <input
          type="text"
          name="name"
          placeholder="Tên"
          className="mb-3 w-full border px-3 py-2 rounded"
          value={form.name}
          onChange={handleChange}
        />
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
          onClick={handleRegister}
          className="bg-honvietRed text-white w-full py-2 rounded hover:opacity-90 mb-3"
        >
          Đăng ký
        </button>

        <p className="text-sm text-center mb-2">
          Đã có tài khoản?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-honvietRed underline"
          >
            Đăng nhập
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
