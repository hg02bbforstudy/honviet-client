import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [showMainBar, setShowMainBar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
  };
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBar(window.scrollY < 10);
      // Ẩn main bar khi scroll đến section-products
      const section = document.getElementById('section-products');
      if (section) {
        const rect = section.getBoundingClientRect();
        setShowMainBar(rect.top - (document.querySelector('header')?.offsetHeight || 140) > 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const headerHeight = document.querySelector('header')?.offsetHeight || 140;
      const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out">
      {/* Hàng 1 – Dòng đỏ */}
      <div
        className={`bg-honvietRed text-white text-sm font-semibold transition-all duration-300 ease-in-out flex items-center justify-center ${showTopBar ? 'h-8 opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}
      >
        Giao hàng miễn phí cho thành viên của Hồn Việt
      </div>

      {/* Hàng 2 + 3 */}
      <div className={`transition-all duration-300 ease-in-out ${showMainBar ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
        {/* Hàng 2 */}
        <div className="flex justify-between items-center px-4 py-3 bg-black/30 backdrop-blur-md shadow-md">
          <div className="w-16 h-16 bg-gray-300 rounded-md">
            <img src="https://res.cloudinary.com/dhhljyybq/image/upload/v1752597473/Avatar_2_h5gtk9.png" alt="Hồn Việt Logo" className="w-full h-full object-cover" />
          </div> {/* Logo */}

          <div className="hidden sm:flex gap-3 items-center">
            {user ? (
              <span className="text-white font-bold flex items-center h-16">Xin chào {user.name} 👋</span>
            ) : (
              //không hiện gì cả
              <span className="text-gray-800 font-semibold h-16"></span>
            )}
            <button className="px-4 py-2 bg-honvietRed text-white rounded hover:opacity-90" onClick={() => navigate('/cart')}>
              Theo dõi đơn hàng
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-honvietGold text-white rounded hover:opacity-90"
              >
                Đăng ký thành viên
              </button>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="text-white" />
            </button>
          </div>
        </div>

        {/* Hàng 3 - Desktop */}
        <div className="hidden sm:flex items-center justify-around px-4 py-3 border-t border-b border-gray-500 bg-black/30 backdrop-blur-md">

          <button
            className="hover:underline px-4 py-2 bg-transparent rounded transition-colors duration-200 text-white font-bold"
            onClick={() => scrollToSection('section-products')}
          >
            Sản phẩm
          </button>

          <button
            className="hover:underline px-4 py-2 bg-transparent rounded transition-colors duration-200 text-white font-bold"
            onClick={() => scrollToSection('section-accessories')}
          >
            Phụ kiện & Khác
          </button>

          <button
            className="hover:underline px-4 py-2 bg-transparent rounded transition-colors duration-200 text-white font-bold"
            onClick={() => scrollToSection('section-blog')}
          >
            Blog
          </button>

          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="px-3 py-1 border border-gray-300 rounded focus:outline-none w-48 bg-transparent transition-colors duration-200 text-white placeholder-white"
          />
          <button className="text-honvietRed hover:scale-110 bg-transparent rounded transition-colors duration-200" onClick={() => navigate('/cart')}>
            <ShoppingCart />
          </button>
        </div>

        {/* Hàng 3 - Mobile Dropdown */}
        {menuOpen && (
          <div className="sm:hidden flex flex-col gap-2 px-4 py-3 bg-white shadow-md border-t border-b border-gray-300 text-sm">
            <button
              className="text-left px-3 py-2 bg-transparent rounded transition-colors duration-200 hover:underline"
              onClick={() => {
                scrollToSection('section-products');
                setMenuOpen(false);
              }}
            >
              Sản phẩm
            </button>
            <button
              className="text-left px-3 py-2 bg-transparent rounded transition-colors duration-200 hover:underline"
              onClick={() => {
                scrollToSection('section-accessories');
                setMenuOpen(false);
              }}
            >
              Phụ kiện & Khác
            </button>
            <button
              className="text-left px-3 py-2 bg-transparent rounded transition-colors duration-200 hover:underline"
              onClick={() => {
                scrollToSection('section-blog');
                setMenuOpen(false);
              }}
            >
              Blog
            </button>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="px-3 py-1 border border-gray-300 rounded w-full bg-transparent transition-colors duration-200"
            />
            <button className="text-honvietRed hover:scale-110 self-start bg-transparent rounded transition-colors duration-200" onClick={() => navigate('/cart')}>
              <ShoppingCart />
            </button>
            <hr />

            {user ? (
              <span className="text-gray-800 font-semibold">Xin chào {user.name} 👋</span>
            ) : (
              //không hiện gì cả
              <span className="text-gray-800 font-semibold"></span>
            )}

            <button className="text-left px-3 py-2 bg-honvietRed text-white rounded hover:opacity-90" onClick={() => navigate('/cart')}>
              Theo dõi đơn hàng
            </button>
            {user ? (
              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Đăng xuất
              </button>
            ) : (
              // Nút đăng ký thành viên chỉ hiển thị khi chưa đăng nhập
              <button
                onClick={() => navigate('/register')}
                className="text-left px-3 py-2 bg-honvietGold text-white rounded hover:opacity-90"
              >
                Đăng ký thành viên
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
