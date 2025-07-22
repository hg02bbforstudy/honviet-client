import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { addToCart, getCart } from '../utils/cartUtils';
import { useNavigate } from 'react-router-dom';
import CartFab, { cartFabDomId } from './CartFab';


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
  // No local cartRef, use CartFab's DOM node
  const flyRef = useRef(null);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(5);
  const [itemW, setItemW] = useState(0);
  const [index, setIndex] = useState(0);
  const [flyImage, setFlyImage] = useState(null);
  const [animating, setAnimating] = useState(false);
  // No local cartCount, use CartFab

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

  const handleAddToCart = (e, item) => {
    const imgRect = e.currentTarget.getBoundingClientRect();
    const cartFab = document.getElementById(cartFabDomId);
    if (!cartFab) return;
    const cartRect = cartFab.getBoundingClientRect();
    const deltaX = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const deltaY = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);
    setFlyImage({
      src: item.image,
      top: imgRect.top,
      left: imgRect.left,
      width: imgRect.width,
      height: imgRect.height,
      deltaX,
      deltaY,
    });
    addToCart(item);
    window.dispatchEvent(new Event('cart-updated'));
    requestAnimationFrame(() => {
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setFlyImage(null);
      }, 1000);
    });
  };

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
              onClick={(e) => handleAddToCart(e, item)}
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

      {flyImage && (
        <img
          ref={flyRef}
          src={flyImage.src}
          className="fixed rounded-xl object-cover z-50 pointer-events-none"
          style={{
            top: flyImage.top,
            left: flyImage.left,
            width: flyImage.width / 2,
            height: flyImage.height / 2,
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
