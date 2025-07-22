import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { addToCart, getCart } from '../utils/cartUtils';
import CartFab, { cartFabDomId } from './CartFab';
import { useNavigate } from 'react-router-dom';

const GAP = 16;

const products = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117424/combo_2_b%E1%BB%99_B%E1%BA%AFc-Trung_1_v0cbqu.jpg',
    brand: 'Hồn Việt',
    name: 'Combo 3 bộ board games',
    price: 449000,
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/Combo_2_b%E1%BB%99_B%E1%BA%AFc_-_Trung_wojsp8.jpg',
    brand: 'Hồn Việt',
    name: 'Combo 2 bộ miền Bắc-Trung',
    price: 299000,
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117424/combo_2_b%E1%BB%99_B%E1%BA%AFc-Trung_1_v0cbqu.jpg',
    brand: 'Hồn Việt',
    name: 'Combo 2 bộ miền Bắc-Nam',
    price: 299000,
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/Combo_2_b%E1%BB%99_B%E1%BA%AFc_-_Trung_wojsp8.jpg',
    brand: 'Hồn Việt',
    name: 'Combo 2 bộ miền Trung-Nam',
    price: 299000,
  },
  {
    id: 5,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117423/1_b%E1%BB%99_mi%E1%BB%81n_B%E1%BA%AFc_jylh8i.jpg',
    brand: 'Hồn Việt',
    name: 'Bộ board game miền Bắc',
    price: 169000,
  },
  {
    id: 6,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/Combo_2_b%E1%BB%99_B%E1%BA%AFc_-_Trung_wojsp8.jpg',
    brand: 'Hồn Việt',
    name: 'Bộ board game miền Trung',
    price: 169000,
  },
  {
    id: 7,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117424/combo_2_b%E1%BB%99_B%E1%BA%AFc-Trung_1_v0cbqu.jpg',
    brand: 'Hồn Việt',
    name: 'Bộ board game miền Nam',
    price: 169000,
  },
  {
    id: 8,
    image: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/Combo_2_b%E1%BB%99_B%E1%BA%AFc_-_Trung_wojsp8.jpg',
    brand: 'Hồn Việt',
    name: 'Bộ quà tặng cao cấp',
    price: 899000,
  },
];

const formatPrice = (p) => p.toLocaleString('vi-VN') + '₫';
const getVisible = (w) => (w >= 1280 ? 5 : w >= 1024 ? 4 : w >= 768 ? 3 : 2);

export default function ProductCarousel() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  const [visible, setVisible] = useState(5);
  const [itemW, setItemW] = useState(0);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [flyImage, setFlyImage] = useState(null);
  // No local cartRef, use CartFab's DOM node
  const flyRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = wrapRef.current?.offsetWidth || 0;
      const v = getVisible(width);
      setVisible(v);
      setItemW((width - GAP * (v - 1)) / v);
      setIndex((i) => Math.min(i, products.length - v));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    trackRef.current?.scrollTo({ left: index * (itemW + GAP), behavior: 'smooth' });
  }, [index, itemW]);

  const slide = (dir) =>
    setIndex((i) => Math.max(0, Math.min(i + (dir === 'left' ? -1 : 1), products.length - visible)));

  const drag = useRef({ start: 0, left: 0, active: false, moved: false });

  const onDown = (e) => {
    drag.current = {
      start: e.clientX ?? e.touches[0].clientX,
      left: trackRef.current.scrollLeft,
      active: true,
      moved: false,
    };
    setIsDragging(true);
    e.preventDefault();
  };

  const onMove = (e) => {
    if (!drag.current.active) return;
    const x = e.clientX ?? e.touches[0].clientX;
    const dx = x - drag.current.start;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    trackRef.current.scrollLeft = drag.current.left - dx;
  };

  const onUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
    const newIdx = Math.round(trackRef.current.scrollLeft / (itemW + GAP));
    setIndex(newIdx);
  };

  const handleAddToCart = (e, product) => {
    if (drag.current.moved || animating) return;
    const imgRect = e.currentTarget.getBoundingClientRect();
    const cartFab = document.getElementById(cartFabDomId);
    if (!cartFab) return;
    const cartRect = cartFab.getBoundingClientRect();
    const deltaX = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const deltaY = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);
    setFlyImage({
      src: product.image,
      top: imgRect.top,
      left: imgRect.left,
      width: imgRect.width,
      height: imgRect.height,
      deltaX,
      deltaY,
    });
    addToCart(product);
    requestAnimationFrame(() => {
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setFlyImage(null);
      }, 1000);
    });
  };

  // No local cartCount, use CartFab

  // No local cartCount, use CartFab

  return (
    <div ref={wrapRef} className="relative mx-auto max-w-[1580px] px-0 select-none">
      <h2 className="text-2xl font-bold text-center mt-12 mb-4">BOARD GAME</h2>

      <button
        onClick={() => slide('left')}
        disabled={index === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow disabled:opacity-40"
      >
        <ChevronLeft className="text-honvietRed" />
      </button>

      <div
        ref={trackRef}
        className={`overflow-x-scroll no-scrollbar ${isDragging ? '' : 'scroll-smooth'} cursor-grab active:cursor-grabbing pb-8`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <div className="flex" style={{ gap: GAP }}>
          {products.map((p) => (
            <div
              key={p.id}
              className="flex-shrink-0 bg-white rounded-xl shadow hover:shadow-lg hover:translate-y-[-12px] cursor-pointer transition p-3"
              style={{ width: itemW }}
              onPointerUp={(e) => handleAddToCart(e, p)}
            >
              <img
                src={p.image}
                alt={p.name}
                draggable={false}
                className="rounded-t-xl w-full h-[260px] object-contain select-none bg-gray-200"
              />
              <div className="p-3 text-sm">
                <div className="font-bold text-honvietRed uppercase text-xs">{p.brand}</div>
                <div className="mt-1 font-medium line-clamp-2">{p.name}</div>
                <div className="mt-2">
                  <span className="text-red-600 font-bold text-base">{formatPrice(p.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => slide('right')}
        disabled={index >= products.length - visible}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow disabled:opacity-40"
      >
        <ChevronRight className="text-honvietRed" />
      </button>

      {flyImage && (
        <img
          ref={flyRef}
          src={flyImage.src}
          className="fixed rounded-xl object-cover z-50 pointer-events-none"
          style={{
            top: flyImage.top,
            left: flyImage.left,
            width: flyImage.width/2,
            height: flyImage.height/2,
            transition: 'transform 1s ease-in, opacity 1s ease-in',
            transform: animating
              ? `translate(${flyImage.deltaX}px, ${flyImage.deltaY}px) scale(0.4)`
              : 'none',
            opacity: animating ? 0 : 1,
          }}
        />
      )}

      <CartFab />
    </div>
  );
}
