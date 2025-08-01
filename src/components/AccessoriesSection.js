import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { addToCart, getCart } from '../utils/cartUtils';
import { useNavigate } from 'react-router-dom';
import CartFab from './CartFab';


const GAP = 16;
const formatPrice = (price) => price.toLocaleString('vi-VN') + '₫';
const getVisible = (w) => (w >= 1280 ? 5 : w >= 1024 ? 4 : w >= 768 ? 3 : 2);

export const localAccessories = [
  {
    id: 101,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753117421/STICKER_2_isogws.png'],
    name: 'Túi Tote',
    price: 60000,
    brand: 'Hồn Việt',
  },
  {
    id: 102,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753704385/20dba518-104a-4aaa-9cf8-444416939a14_vgrpau.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753704385/b53fe675-590f-4af1-866d-80a4f2367663_uo0u9f.jpg'],
    name: 'Cốc sứ',
    price: 65000,
    brand: 'Hồn Việt',
  },
  {
    id: 103,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753703658/1_lfdlol.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753703658/e2304062-830a-4b2b-b272-ba4a767f3467_ogyvln.jpg' ],
    name: 'Mũ lưỡi trai',
    price: 70000,
    brand: 'Hồn Việt',
  },
  {
    id: 104,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_1_swe1jc.png'],
    name: 'Quạt cầm tay',
    price: 50000,
    brand: 'Hồn Việt',
  },
  {//oke
    id: 105,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_dyzzii.png', 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117421/STICKER_2_isogws.png', 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_1_swe1jc.png'],
    name: 'Sticker chủ đề Văn hóa',
    price: 10000,
    brand: 'Hồn Việt',
  },
  {
    id: 106,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1754071161/Copy_of_%C3%81O_MI%E1%BB%80N_B%E1%BA%AEC_g2di6k.png','https://res.cloudinary.com/dhhljyybq/image/upload/v1754071162/%C3%81O_TRUNG_ja1hzn.png','https://res.cloudinary.com/dhhljyybq/image/upload/v1754071162/%C3%81O_MI%E1%BB%80N_NAM_digc0y.png'],
    name: 'Áo phông 3 miền',
    price: 199000,
    brand: 'Hồn Việt',
  }
];

export default function AccessoriesSection() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(5);
  const [itemW, setItemW] = useState(0);
  const [index, setIndex] = useState(0);

  const accessories = localAccessories;

  useEffect(() => {
    const handleResize = () => {
      const width = wrapRef.current?.offsetWidth || 0;
      const v = getVisible(width);
      setVisible(v);
      setItemW((width - GAP * (v - 1)) / v);
      setIndex((i) => Math.min(i, accessories.length - v));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [accessories]);

  useEffect(() => {
    trackRef.current?.scrollTo({
      left: index * (itemW + GAP),
      behavior: 'smooth',
    });
  }, [index, itemW]);

  const showControls = accessories.length > visible;

  // No local cartCount, use CartFab


  return (
    <div ref={wrapRef} className="relative mx-auto max-w-[1280px] px-0 select-none mt-16">
      <h2 className="text-2xl font-bold text-center mb-6">PHỤ KIỆN & KHÁC</h2>

      {showControls && (
        <>
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={index === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 py-2 bg-white/80 rounded-full shadow disabled:opacity-30"
          >
            <ChevronLeft className="text-honvietRed" />
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(i + 1, accessories.length - visible))}
            disabled={index >= accessories.length - visible}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 py-2 bg-white/80 rounded-full shadow disabled:opacity-30"
          >
            <ChevronRight className="text-honvietRed" />
          </button>
        </>
      )}

      <div
        ref={trackRef}
        className={`overflow-x-scroll no-scrollbar scroll-smooth pb-8`}
      >
        <div
          className={`flex`}
          style={{ gap: GAP, justifyContent: showControls ? 'start' : 'center' }}
        >
          {accessories.map((item, idx) => (
            <div
              key={item.id + '-' + idx}
              // ...existing code...
              onClick={() => navigate(`/product/${item.id}`)}
              className="flex-shrink-0 bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-2 cursor-pointer transition-transform duration-300 overflow-hidden"
              style={{ width: itemW }}
            >
              <div className="w-full aspect-square overflow-hidden p-2">
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="w-full h-full object-cover bg-gray-200"
                />
              </div>
              <div className="p-2 text-center">
                <div className="font-bold text-honvietRed uppercase text-xs">{item.brand}</div>
                <div className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[20px]">
                  {item.name}
                </div>
                <div className="mt-1 text-honvietRed font-bold text-base">
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ...existing code... */}


    </div>
  );
}
