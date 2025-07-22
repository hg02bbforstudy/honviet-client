import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart } from '../utils/cartUtils';


const GAP = 16;
const formatPrice = (price) => price.toLocaleString('vi-VN') + '₫';
const getVisible = (w) => (w >= 1280 ? 5 : w >= 1024 ? 4 : w >= 768 ? 3 : 2);

const localAccessories = [
  {
    id: 101,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117421/STICKER_2_isogws.png',
    name: 'Túi Tote',
    price: 60000,
    brand: 'Hồn Việt',
    },
    {
    id: 102,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_1_swe1jc.png',
    name: 'Cốc sứ',
    price: 65000,
    brand: 'Hồn Việt',
    },
    {
    id: 103,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117421/STICKER_2_isogws.png',
    name: 'Mũ lưỡi trai',
    price: 70000,
    brand: 'Hồn Việt',
    },
    {
    id: 104,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_1_swe1jc.png',
    name: 'Quạt cầm tay',
    price: 50000,
    brand: 'Hồn Việt',
    },
    {//oke
    id: 105,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_dyzzii.png',
    name: 'Sticker chủ đề Văn hóa',
    price: 10000,
    brand: 'Hồn Việt',
    }
];

export default function AccessoriesSection() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
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

  return (
    <div ref={wrapRef} className="relative mx-auto max-w-[1280px] px-0 select-none mt-16">
      <h2 className="text-2xl font-bold text-center mb-6">PHỤ KIỆN & KHÁC</h2>

      {showControls && (
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 py-2 bg-white/80 rounded-full shadow disabled:opacity-30"
        >
          <ChevronLeft className="text-honvietRed" />
        </button>
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
              onClick={() => addToCart(item)}
              className="flex-shrink-0 bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-2 cursor-pointer transition-transform duration-300 overflow-hidden"
              style={{ width: itemW }}
            >
              <div className="w-full aspect-square overflow-hidden p-2">
                <img
                  src={item.image}
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

      {showControls && (
        <button
          onClick={() => setIndex((i) => Math.min(i + 1, accessories.length - visible))}
          disabled={index >= accessories.length - visible}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow disabled:opacity-30"
        >
          <ChevronRight className="text-honvietRed" />
        </button>
      )}
    </div>
  );
}
