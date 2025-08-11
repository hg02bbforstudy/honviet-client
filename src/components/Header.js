import React, { useEffect, useState, useRef } from 'react';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from './ProductCarousel';
import { localAccessories } from './AccessoriesSection';
import { ADMIN_EMAILS } from '../constants';

export default function Header() {
  const [showTopBar, setShowTopBar] = useState(true);
  const [showMainBar, setShowMainBar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQueryMobile, setSearchQueryMobile] = useState('');
  const [showDropdownMobile, setShowDropdownMobile] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const searchRefMobile = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Kết hợp tất cả sản phẩm
  const allProducts = [...products, ...localAccessories];

  // Kiểm tra xem user có phải admin không
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Hàm chuyển đổi tiếng Việt có dấu sang không dấu
  const removeVietnameseTones = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  // Lọc sản phẩm theo search query (hỗ trợ tìm kiếm không dấu)
  const filteredProducts = searchQuery.trim() 
    ? allProducts.filter(product => {
        const searchLower = removeVietnameseTones(searchQuery.toLowerCase());
        const nameLower = removeVietnameseTones(product.name.toLowerCase());
        const brandLower = removeVietnameseTones(product.brand.toLowerCase());
        return nameLower.includes(searchLower) || brandLower.includes(searchLower);
      })
    : allProducts;

  const filteredProductsMobile = searchQueryMobile.trim() 
    ? allProducts.filter(product => {
        const searchLower = removeVietnameseTones(searchQueryMobile.toLowerCase());
        const nameLower = removeVietnameseTones(product.name.toLowerCase());
        const brandLower = removeVietnameseTones(product.brand.toLowerCase());
        return nameLower.includes(searchLower) || brandLower.includes(searchLower);
      })
    : allProducts;

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Đóng dropdown khi click bên ngoài
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchRefMobile.current && !searchRefMobile.current.contains(event.target)) {
        setShowDropdownMobile(false);
      }
      // Đóng menu mobile khi click bên ngoài, nhưng không đóng khi click vào nút menu
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
          menuButtonRef.current && !menuButtonRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleProductClick = (productId) => {
    setShowDropdown(false);
    setShowDropdownMobile(false);
    setSearchQuery('');
    setSearchQueryMobile('');
    setMenuOpen(false);
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => price.toLocaleString('vi-VN') + '₫';

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
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Quản lý đơn hàng
              </button>
            )}
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
            <button ref={menuButtonRef} onClick={() => setMenuOpen(!menuOpen)}>
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

          {/* Search Box Desktop */}
          <div ref={searchRef} className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="px-3 py-1 border border-gray-300 rounded focus:outline-none w-48 bg-transparent text-white placeholder-white"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
            </div>
            
            {/* Dropdown */}
            {showDropdown && searchQuery.trim() && (
              <div className="absolute top-full right-0 w-80 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 10).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img 
                        src={product.image[0]} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.brand}
                        </div>
                        <div className="text-sm font-bold text-honvietRed">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="text-honvietRed hover:scale-110 bg-transparent rounded transition-colors duration-200" onClick={() => navigate('/cart')}>
            <ShoppingCart />
          </button>
        </div>

        {/* Hàng 3 - Mobile Dropdown */}
        {menuOpen && (
          <div ref={mobileMenuRef} className="sm:hidden flex flex-col gap-2 px-4 py-3 bg-white shadow-md border-t border-b border-gray-300 text-sm">
            <button
              className="text-left px-3 py-2 bg-transparent rounded transition-colors duration-200 hover:underline font-bold"
              onClick={() => {
                scrollToSection('section-products');
                setMenuOpen(false);
              }}
            >
              Sản phẩm
            </button>
            <button
              className="text-left px-3 py-2 bg-transparent rounded transition-colors duration-200 hover:underline font-bold"
              onClick={() => {
                scrollToSection('section-accessories');
                setMenuOpen(false);
              }}
            >
              Phụ kiện & Khác
            </button>
            <button
              className="text-left px-3 py-2 bg-transparent rounded transition-colors duration-200 hover:underline font-bold"
              onClick={() => {
                scrollToSection('section-blog');
                setMenuOpen(false);
              }}
            >
              Blog
            </button>
            
            {/* Search Box Mobile */}
            <div ref={searchRefMobile} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="px-3 py-2 pl-10 border border-gray-300 rounded-lg w-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-honvietRed"
                  value={searchQueryMobile}
                  onChange={(e) => {
                    setSearchQueryMobile(e.target.value);
                    setShowDropdownMobile(true);
                  }}
                  onFocus={() => setShowDropdownMobile(true)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>
              
              {/* Dropdown Mobile */}
              {showDropdownMobile && searchQueryMobile.trim() && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 overflow-y-auto z-50">
                  {filteredProductsMobile.length > 0 ? (
                    filteredProductsMobile.slice(0, 8).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <img 
                          src={product.image[0]} 
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg bg-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.brand}
                          </div>
                          <div className="text-xs font-bold text-honvietRed">
                            {formatPrice(product.price)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      Không tìm thấy sản phẩm nào
                    </div>
                  )}
                </div>
              )}
            </div>

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
            {isAdmin && (
              <button
                onClick={() => {
                  navigate('/admin');
                  setMenuOpen(false);
                }}
                className="text-left px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Quản lý đơn hàng
              </button>
            )}
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
