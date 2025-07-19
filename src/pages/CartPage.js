import React, { useEffect, useState } from "react";
import {
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
} from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [showTopBar, setShowTopBar] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setCartItems(getCart());
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        const handleScroll = () => {
            setShowTopBar(window.scrollY < 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const handleRemove = (id) => {
        removeFromCart(id);
        setCartItems(getCart());
    };

    const handleQuantityChange = (id, quantity) => {
        updateCartItemQuantity(id, parseInt(quantity));
        setCartItems(getCart());
    };

    const handleClearCart = () => {
        clearCart();
        setCartItems([]);
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-white">
            {/* Hàng 1 – Dòng đỏ */}
            <div
                className={`bg-honvietRed text-white text-sm font-semibold transition-all duration-300 ease-in-out flex items-center justify-center ${showTopBar ? 'h-8 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}
            >
                Giao hàng miễn phí cho thành viên của Hồn Việt
            </div>
            {/* Hàng 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-black/30 backdrop-blur-md shadow-md ">
        <div className="flex items-center gap-3 w-full">
          <div className="w-16 h-16 bg-gray-300 rounded-md">
            <img src="https://res.cloudinary.com/dhhljyybq/image/upload/**f_auto,q_auto/**v1752597473/Avatar_2_h5gtk9.png" alt="Hồn Việt Logo" className="w-full h-full object-cover" />
          </div>
          {user ? (
            <span className="text-gray-800 font-semibold">Xin chào {user.name} 👋</span>
          ) : (
            <span className="text-gray-800 font-semibold"></span>
          )}
        </div>
        {/* ...nút đăng ký thành viên... */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center mt-2 sm:mt-0">
          {!user && (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-honvietGold text-white rounded hover:opacity-90 w-full sm:w-auto"
            >
              Đăng Nhập
            </button>
          )}
        </div>
      </div>

            {/* Nội dung giỏ hàng */}
            <div className="px-2 py-4 sm:p-6 max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <h2 className="text-2xl font-bold text-honvietRed">🛒 Giỏ hàng</h2>
                    <button
                        className="px-4 py-2 bg-honvietGold text-black rounded font-semibold shadow hover:bg-honvietGold/80 transition"
                        onClick={() => navigate("/")}
                    >
                        ← Quay lại trang chủ
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
                        <button
                            className="px-6 py-2 bg-honvietRed text-white rounded font-semibold shadow hover:bg-honvietRed/80"
                            onClick={() => navigate("/")}
                        >
                            Về trang chủ để mua hàng
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg shadow mb-6">
                            <table className="w-full min-w-[340px] border-collapse text-sm">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="p-2">Sản phẩm</th>
                                        <th className="p-2">Đơn giá</th>
                                        <th className="p-2">Số lượng</th>
                                        <th className="p-2">Tổng</th>
                                        <th className="p-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="p-2 flex items-center gap-3 min-w-[120px]">
                                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                                <div>
                                                    <div className="font-medium text-base text-honvietRed line-clamp-2">{item.name}</div>
                                                    <div className="text-xs text-gray-500">{item.brand}</div>
                                                </div>
                                            </td>
                                            <td className="p-2 whitespace-nowrap">{item.price.toLocaleString()}₫</td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-14 border rounded p-1 text-center focus:outline-honvietGold"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2 whitespace-nowrap">{(item.price * item.quantity).toLocaleString()}₫</td>
                                            <td className="p-2">
                                                <button
                                                    className="text-honvietRed hover:underline text-xs"
                                                    onClick={() => handleRemove(item.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <button
                                className="px-4 py-2 bg-honvietRed text-white rounded font-semibold shadow hover:bg-honvietRed/80"
                                onClick={handleClearCart}
                            >
                                Xóa toàn bộ
                            </button>
                            <div className="text-xl font-bold text-honvietGold">
                                Tổng cộng: {total.toLocaleString()}₫
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
