import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-honvietRed/80 to-yellow-100">
      <img
        src="https://res.cloudinary.com/dhhljyybq/image/upload/v1753117423/1_b%E1%BB%99_mi%E1%BB%81n_B%E1%BA%AFc_jylh8i.jpg"
        alt="404 Hồn Việt"
        className="w-40 h-40 object-contain mb-6 drop-shadow-xl animate-bounce"
      />
      <h1 className="text-4xl font-bold text-honvietRed mb-2">404 - Không tìm thấy trang</h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-md">
        Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.<br/>
        Hãy quay về trang chủ để tiếp tục khám phá các sản phẩm văn hóa Việt nhé!
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-honvietRed text-white rounded font-semibold shadow hover:bg-honvietRed/80"
      >
        Về trang chủ
      </button>
    </div>
  );
}
