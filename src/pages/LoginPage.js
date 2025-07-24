import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import ServerWakeOverlay from '../components/ServerWakeOverlay';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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

  const handleLogin = async () => {
    const res = await loginUser(form);
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.setItem("currentUser", res.user.email);
      navigate('/'); // hoặc trang khác
    } else {
      setError(res.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <>
      <ServerWakeOverlay show={!serverReady} />
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
          {error && <p className="text-red-500 mb-3">{error}</p>}
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
    </>
  );
}
