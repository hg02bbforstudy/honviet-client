import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addToCart } from '../utils/cartUtils';
import CartFab, { cartFabDomId } from './CartFab';
import { useNavigate } from 'react-router-dom';

const GAP = 16;

export const products = [
  {
    id: 1,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753704276/1_lkhkd5.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753704276/7e99377a-0938-44e3-a335-d21d73288639_mlxwfd.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753704275/fa1d44d7-c36c-44cd-a91d-9a4f39e02c41_j5dzbk.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753704275/d2f06671-db0c-452c-ba2b-51e76fd03f6c_l13ule.jpg'],
    brand: 'Hồn Việt',
    name: 'Combo 3 bộ board games',
    price: 449000,
  },
  {
    id: 2,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/Combo_2_b%E1%BB%99_B%E1%BA%AFc_-_Trung_wojsp8.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/Combo_2_b%E1%BB%99_B%E1%BA%AFc-Trung_rx8pif.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753117424/combo_2_b%E1%BB%99_B%E1%BA%AFc-Trung_1_v0cbqu.jpg'],
    brand: 'Hồn Việt',
    name: 'Combo 2 bộ miền Bắc-Trung',
    price: 299000,
  },
  {
    id: 3,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753704995/1_eohbzo.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753704995/f54cdfe4-85ee-42e9-8fbe-8ab9be216e8d_mpwbtv.jpg'],
    brand: 'Hồn Việt',
    name: 'Combo 2 bộ miền Bắc-Nam',
    price: 299000,
  },
  {
    id: 4,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753704735/6e9ced04-1827-4bfd-90c5-0fb4ae75055a_vhyfx1.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753704734/4a791b84-161c-4224-8158-23e97ea3f56d_nem16n.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753704734/1_j8crfk.jpg',],
    brand: 'Hồn Việt',
    name: 'Combo 2 bộ miền Trung-Nam',
    price: 299000,
  },
  {
    id: 5,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753705304/1_zncw0c.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753705303/95d1024a-34e9-4928-a114-733253313e58_yfzag7.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753705304/bc74219c-ff5a-45f9-80a9-fbc23fcf49cd_retyjk.jpg'],
    brand: 'Hồn Việt',
    name: 'Bộ board game miền Bắc',
    price: 169000,
  },
  {
    id: 6,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753705067/1_upalaj.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753705068/a1c5aab8-ff71-4f71-9f6d-40342ab2dd3d_l1cqc6.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753705068/7b5a43b8-b9b5-4c54-ad23-6fa51dec9e85_kfsktl.jpg'],
    brand: 'Hồn Việt',
    name: 'Bộ board game miền Trung',
    price: 169000,
  },
  {
    id: 7,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753705163/1_f0ovxg.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753705164/fbd25026-e582-451e-b5ab-9617bb172abb_tod5y0.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1753705163/c0e5fcc5-ab94-4c92-9272-816dc6612b77_zd2pqh.jpg'],
    brand: 'Hồn Việt',
    name: 'Bộ board game miền Nam',
    price: 169000,
  },
  {
    id: 8,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/Combo_2_b%E1%BB%99_B%E1%BA%AFc_-_Trung_wojsp8.jpg'],
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
    window.dispatchEvent(new Event('cart-updated'));
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
              // onPointerUp={(e) => handleAddToCart(e, p)}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <img
                src={p.image[0]}
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
