import React, { useEffect, useState } from 'react';

const productImages = [
  'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117424/combo_2_b%E1%BB%99_B%E1%BA%AFc-Trung_1_v0cbqu.jpg',
  'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/Combo_2_b%E1%BB%99_B%E1%BA%AFc_-_Trung_wojsp8.jpg',
  'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117423/1_b%E1%BB%99_mi%E1%BB%81n_B%E1%BA%AFc_jylh8i.jpg',
  'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_1_swe1jc.png',
  'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117421/STICKER_2_isogws.png',
  'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_dyzzii.png',
];

export default function ServerWakeOverlay({ show }) {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setImgIdx((i) => (i + 1) % productImages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center opacity-30 animate-fadein">
        <img
          src={productImages[imgIdx]}
          alt="Sản phẩm nổi bật"
          className="h-full object-contain rounded-xl shadow-2xl transition-all duration-700"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-6"></div>
        <div className="text-white text-lg font-bold drop-shadow-lg text-center">
          Đang kết nối đến máy chủ...<br />Vui lòng chờ trong giây lát!
        </div>
      </div>
    </div>
  );
}
