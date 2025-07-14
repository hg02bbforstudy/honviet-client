// src/components/AccessoriesSection.js
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const accessories = [
  {
    id: 101,
    image: 'https://picsum.photos/seed/acc1/300/300',
    name: 'Túi đựng board game',
    price: 190000,
  },
  {
    id: 102,
    image: 'https://picsum.photos/seed/acc2/300/300',
    name: 'Sleeves bảo vệ bài (100 cái)',
    price: 85000,
  },
  {
    id: 103,
    image: 'https://picsum.photos/seed/acc3/300/300',
    name: 'Hộp đựng token đa năng',
    price: 135000,
  },
];

const formatPrice = (price) => price.toLocaleString('vi-VN') + '₫';
const getVisible = (w) => (w >= 1280 ? 5 : w >= 768 ? 3 : 2);
const GAP = 16;

export default function AccessoriesSection() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(5);
  const [itemW, setItemW] = useState(0);
  const [index, setIndex] = useState(0);

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
  }, []);

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
          style={{
            gap: GAP,
            justifyContent: showControls ? 'start' : 'center',
          }}
        >
          {accessories.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
              style={{ width: itemW }}
            >
              <div className="w-full aspect-square overflow-hidden p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 text-center">
                <div className="font-medium text-gray-800 text-sm line-clamp-2 min-h-[40px]">
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
          onClick={() =>
            setIndex((i) =>
              Math.min(i + 1, accessories.length - visible)
            )
          }
          disabled={index >= accessories.length - visible}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow disabled:opacity-30"
        >
          <ChevronRight className="text-honvietRed" />
        </button>
      )}
    </div>
  );
}
