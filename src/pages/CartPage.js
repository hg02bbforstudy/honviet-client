import React, { useEffect, useState } from "react";
import {
    getCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
} from "../utils/cartUtils";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import Footer from "../components/Footer";
import APIAddressSelector from "../components/APIAddressSelector";

export default function CartPage() {
    React.useEffect(() => {
        window.scrollTo({ top: 0 });
    });

    const handleCloseOrderForm = () => {
        setShowOrderForm(false);
        setOrderError('');
        setAddressData({});
        setOrderInfo({ name: '', phone: '', email: '', address: '' });
    };

    // Validation số điện thoại Việt Nam
    const validateVietnamesePhone = (phone) => {
        // Remove all spaces and special characters
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
        
        // Vietnamese phone patterns
        const patterns = [
            /^(\+84|84|0)(3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])[0-9]{7}$/, // Mobile
            /^(\+84|84|0)(2[0-9])[0-9]{8}$/, // Landline
        ];
        
        return patterns.some(pattern => pattern.test(cleanPhone));
    };

    const [cartItems, setCartItems] = useState([]);
    const [showTopBar, setShowTopBar] = useState(true);
    const [user, setUser] = useState(null);
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderInfo, setOrderInfo] = useState({ name: '', phone: '', email: '', address: '' });
    const [orderError, setOrderError] = useState('');
    const [addressData, setAddressData] = useState({});
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

    const handleCheckout = async () => {
        if (!user) {
            setShowLoginAlert(true);
            setShowOrderForm(false);

            return;
        }
        setShowLoginAlert(false);
        // Tự động điền tên/email nếu có user
        setOrderInfo(info => ({
            ...info,
            name: user?.name || '',
            email: user?.email || ''
        }));
        setShowOrderForm(true);
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Popup xác nhận đơn hàng */}
            {showOrderForm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={handleCloseOrderForm}
                >
                    <div
                        className="relative bg-white border border-honvietGold rounded shadow-lg max-w-md w-full p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-honvietRed text-xl font-bold"
                            onClick={handleCloseOrderForm}
                            aria-label="Đóng"
                        >
                            ×
                        </button>
                        <h3 className="text-lg font-bold mb-4 text-honvietRed text-center">Xác nhận thông tin đơn hàng</h3>
                        
                        {/* Thông tin cá nhân */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Thông tin người nhận</h4>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Họ và tên *</label>
                                    <input
                                        type="text"
                                        placeholder="Họ và tên người nhận"
                                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-honvietRed focus:border-transparent"
                                        value={orderInfo.name}
                                        onChange={e => setOrderInfo({ ...orderInfo, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Email liên hệ *</label>
                                    <input
                                        type="email"
                                        placeholder="example@gmail.com"
                                        className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-honvietRed focus:border-transparent"
                                        value={orderInfo.email}
                                        onChange={e => setOrderInfo({ ...orderInfo, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        placeholder="Số điện thoại liên hệ"
                                        className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:border-transparent ${
                                            orderInfo.phone && !validateVietnamesePhone(orderInfo.phone) 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300 focus:ring-honvietRed'
                                        }`}
                                        value={orderInfo.phone}
                                        onChange={e => setOrderInfo({ ...orderInfo, phone: e.target.value })}
                                    />
                                    {orderInfo.phone && !validateVietnamesePhone(orderInfo.phone) && (
                                        <p className="text-xs text-red-500 mt-1">Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Địa chỉ giao hàng */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2"></h4>
                            <APIAddressSelector 
                                onAddressChange={(addressData) => {
                                    setAddressData(addressData);
                                    setOrderInfo({ ...orderInfo, address: addressData.fullAddress });
                                }}
                            />
                        </div>
                        {orderError && <div className="text-red-500 mb-2 text-sm">{orderError}</div>}
                        
                        <button
                            className="bg-honvietRed text-white px-6 py-2 rounded font-semibold shadow hover:bg-honvietRed/80 w-full"
                            aria-label="Xác nhận đặt hàng"
                            onClick={async () => {
                                // Validation với địa chỉ chi tiết
                                if (!orderInfo.name || !orderInfo.email || !orderInfo.phone) {
                                    setOrderError('Vui lòng nhập đầy đủ thông tin cá nhân!');
                                    return;
                                }

                                // Validation số điện thoại Việt Nam
                                if (!validateVietnamesePhone(orderInfo.phone)) {
                                    setOrderError('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678 hoặc +84912345678)');
                                    return;
                                }
                                
                                // Kiểm tra địa chỉ đã chọn đầy đủ chưa - cập nhật validation cho API address
                                if (!addressData.province || !addressData.district || !addressData.ward) {
                                    setOrderError('Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã!');
                                    return;
                                }
                                
                                if (!addressData.specific || addressData.specific.trim() === '') {
                                    setOrderError('Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường)!');
                                    return;
                                }
                                
                                // Debug: log email trước khi gửi
                                console.log('Email gửi:', orderInfo.email);
                                if (!orderInfo.email || orderInfo.email.trim() === '') {
                                    setOrderError('Email không hợp lệ!');
                                    return;
                                }
                                    // Tạo HTML email
                                    const qrCodeUrl = encodeURI('https://res.cloudinary.com/dhhljyybq/image/upload/v1753703667/QR_lbeuzo.jpg');
                                    const order_time = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
                                    const itemsHtml = cartItems.map(item => `
                                            <tr>
                                              <td style="text-align:center;">${item.id || ''}</td>
                                              <td style="text-align:center;">
                                                <img src="${item.image[0]}" alt="${item.name}" style="width:48px;height:48px;object-fit:cover;background:#f3f4f6;border-radius:8px;" />
                                              </td>
                                              <td style="text-align:center;">${item.name}</td>
                                              <td style="text-align:center;">${item.quantity}</td>
                                              <td style="text-align:center;">${item.price.toLocaleString()}₫</td>
                                            </tr>
                                        `).join('');
                                    const htmlContent = `
                                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 16px;">
                                            <div style="text-align:center; margin-bottom:16px;">
                                                <img src='https://res.cloudinary.com/dhhljyybq/image/upload/v1752597473/Avatar_2_h5gtk9.png' alt='Hồn Việt Logo' style='width:64px;height:64px;border-radius:12px;margin-bottom:8px;' />
                                                <h2 style="color:#b91c1c; font-size:1.5rem; margin:0;">Xác nhận đơn hàng</h2>
                                            </div>
                                            <div style="background:#f3f4f6; border-radius:8px; padding:12px; margin-bottom:16px;">
                                                <h3 style="margin:0 0 8px 0; font-size:1.1rem; color:#b91c1c;">Thông tin khách hàng</h3>
                                                <p style="margin:4px 0;"><strong>Tên:</strong> ${orderInfo.name}</p>
                                                <p style="margin:4px 0;"><strong>SĐT:</strong> ${orderInfo.phone}</p>
                                                <p style="margin:4px 0;"><strong>Địa chỉ:</strong> ${orderInfo.address}</p>
                                            </div>
                                            <div style="text-align: center; margin: 20px 0;">
                                                <img src="${qrCodeUrl}" alt="QR Code" width="120" height="140" style="border-radius:8px;" />
                                                <p style="margin-top: 12px; color: #b91c1c; font-weight: bold; font-size: 1rem;">
                                                  Vui lòng chuyển khoản và ghi nội dung là mã đơn hàng <span style="background:#f3f4f6; color:#b91c1c; padding:2px 8px; border-radius:6px; font-family:monospace;">${order_time}</span>
                                                </p>
                                            </div>
                                            <h3 style="margin:0 0 8px 0; font-size:1.1rem; color:#b91c1c;">Thông tin sản phẩm</h3>
                                            <div style="overflow-x:auto;">
                                                <table border="1" cellspacing="0" cellpadding="8" style="border-collapse:collapse; min-width:400px; width:100%; font-size:0.95rem;">
                                                    <thead style="background:#f3f4f6;">
                                                        <tr>
                                                            <th style="padding:6px;">Mã SP</th>
                                                            <th style="padding:6px;">Hình ảnh</th>
                                                            <th style="padding:6px;">Tên SP</th>
                                                            <th style="padding:6px;">Số lượng</th>
                                                            <th style="padding:6px;">Giá tiền</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${itemsHtml}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div style="margin-top:16px;">
                                                <p style="margin:4px 0;"><strong>Thành tiền:</strong> ${total.toLocaleString()}₫</p>
                                                <p style="margin:4px 0;"><strong>Phí ship:</strong> 30,000₫</p>
                                                <p style="margin:4px 0;"><strong>Discount:</strong> -0₫</p>
                                                <h3 style="color:#b91c1c; margin:8px 0 0 0;">TỔNG: ${(total + 30000).toLocaleString()}₫</h3>
                                            </div>
                                            <p style="margin-top: 24px; color:#b91c1c; font-weight:bold; font-size:1.1rem; text-align:center;">Cảm ơn bạn đã mua hàng tại Hồn Việt!</p>
                                            <style>
                                                @media only screen and (max-width: 480px) {
                                                    div[style*='max-width: 600px'] { padding:8px !important; }
                                                    table { font-size:0.85rem !important; }
                                                    img[alt='Hồn Việt Logo'] { width:48px !important; height:48px !important; }
                                                    img[alt='QR Code'] { width:90px !important; height:90px !important; }
                                                }
                                            </style>
                                        </div>
                                    `;
                                // Gửi email qua emailjs
                                emailjs.send('service_bu0hrw9', 'template_2cwcchp', {
                                    to_email: orderInfo.email,
                                    html_content: htmlContent,
                                    order_time: order_time,
                                    customer_name: orderInfo.name,
                                }, 'EXD0j4WTnajToEd4D')
                                    .then(() => {
                                        alert('Đơn hàng đã được đặt thành công!');
                                        // Reset order info và clear cart chỉ khi thành công
                                        setOrderInfo({ name: '', phone: '', email: '', address: '' });
                                        setAddressData({});
                                        handleClearCart();
                                        setShowOrderForm(false);
                                    })
                                    .catch(err => {
                                        console.error('Error sending order:', err);
                                        setOrderError('Đặt đơn hàng thất bại, vui lòng thử lại sau.');
                                    });
                            }}
                        >
                            Xác nhận đặt hàng
                        </button>
                    </div>
                </div>
            )}
            {/* Alert nếu chưa đăng nhập và ấn thanh toán */}
            {showLoginAlert && (
                <div className="max-w-4xl mx-auto mt-4 mb-2 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 font-semibold text-center rounded">
                    Vui lòng đăng nhập để thanh toán đơn hàng!
                </div>
            )}
            {/* Hàng 1 – Dòng đỏ */}
            <div
                className={`bg-honvietRed text-white text-sm font-semibold transition-all duration-300 ease-in-out flex items-center justify-center ${showTopBar ? 'h-8 opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}
            >
                Giao hàng miễn phí cho thành viên của Hồn Việt
            </div>
            {/* Hàng 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 bg-black/30 backdrop-blur-md shadow-md ">
                <div className="flex flex-row justify-between items-center gap-3 max-w-4xl mx-auto w-full">
                    <div className="w-16 h-16 bg-gray-300 rounded-md">
                        <img src="https://res.cloudinary.com/dhhljyybq/image/upload/v1752597473/Avatar_2_h5gtk9.png" alt="Hồn Việt Logo" className="w-full h-full object-cover" />
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
            <div
                className="px-2 py-4 sm:p-6 max-w-4xl mx-auto flex-1"
                style={{ minHeight: 'calc(100vh - 64px - 80px)' }} // header ~64px, footer ~80px
            >
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
                                                <img src={item.image[0]} alt={item.name} className="w-12 h-12 object-cover rounded" />
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
                            <button
                                className="px-6 py-2 bg-honvietGold text-black rounded font-semibold shadow hover:bg-honvietGold/80"
                                onClick={handleCheckout}
                            >
                                Thanh toán
                            </button>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div >
    );
}
