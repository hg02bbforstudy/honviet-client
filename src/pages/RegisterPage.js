import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import ServerWakeOverlay from '../components/ServerWakeOverlay';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function checkServer() {
      setServerReady(false);
      while (!cancelled) {
        try {
          const res = await fetch('https://honviet-server.onrender.com/api/products');
          if (res.ok) {
            setServerReady(true);
            break;
          }
        } catch { }
        await new Promise(r => setTimeout(r, 1200));
      }
    }
    checkServer();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const res = await registerUser(form);
    if (res.message === 'Đăng ký thành công') {
      navigate('/login');
    } else {
      setError(res.message || 'Đăng ký thất bại');
    }
  };

  return (
    <>
      <ServerWakeOverlay show={!serverReady} />
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
          {error && <p className="text-red-500 mb-3">{error}</p>}
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
    </>
  );
}
