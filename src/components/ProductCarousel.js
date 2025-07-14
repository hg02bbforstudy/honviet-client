import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const GAP = 16; // px, vì gap-4 = 1rem = 16px

const products = [{
  id: 1,
  image: 'https://picsum.photos/seed/prod1/200/200',
  brand: 'ZYGOMATIC',
  name: 'The Werewolves of Millers Hollow Characters',
  price: 455000,
  oldPrice: 479000,
},
{
  id: 2,
  image: 'https://picsum.photos/seed/prod2/200/200',
  brand: 'STRONGHOLD GAMES',
  name: 'Terraforming Mars: Small Box Retail',
  price: 3466000,
  oldPrice: 3649000,
},
{
  id: 3,
  image: 'https://picsum.photos/seed/prod3/200/200',
  brand: 'LEDER GAMES',
  name: 'Root Core game',
  price: 2108000,
  oldPrice: 2219000,
},
{
  id: 4,
  image: 'https://picsum.photos/seed/prod4/200/200',
  brand: 'INDIE BOARDS & CARDS',
  name: 'The Resistance: Hidden Agenda',
  price: 426000,
  oldPrice: 449000,
},
{
  id: 5,
  image: 'https://picsum.photos/seed/prod5/200/200',
  brand: 'INDIE BOARDS & CARDS',
  name: 'Coup: Rebellion G54 – Anarchy',
  price: 426000,
  oldPrice: 449000,
},
{
  id: 6,
  image: 'https://picsum.photos/seed/prod6/200/200',
  brand: 'LEDER GAMES',
  name: 'Another Product Name',
  price: 1234000,
  oldPrice: 1350000,
},
{
  id: 7,
  image: 'https://picsum.photos/seed/prod7/200/200',
  brand: 'LEDER GAMES',
  name: 'Root: The Riverfolk Expansion',
  price: 1234000,
  oldPrice: 1350000,
},
{
  id: 8,
  image: 'https://picsum.photos/seed/prod8/200/200',
  brand: 'LEDER GAMES',
  name: 'Root: The Underworld Expansion',
  price: 1234000,
  oldPrice: 1350000,
},
{
  id: 9,
  image: 'https://picsum.photos/seed/prod9/200/200',
  brand: 'LEDER GAMES',
  name: 'Root: The Marauder Expansion',
  price: 1234000,
  oldPrice: 1350000,
},
{
  id: 10,
  image: 'https://picsum.photos/seed/prod10/200/200',
  brand: 'LEDER GAMES',
  name: 'Root: The Clockwork Expansion',
  price: 1234000,
  oldPrice: 1350000,
},
];

const formatPrice = (p) => p.toLocaleString('vi-VN') + '₫';
const getVisible = (w) => (w >= 1280 ? 5 : w >= 1024 ? 4 : 3);

export default function ProductCarousel() {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);

  const [visible, setVisible] = useState(5);
  const [itemW, setItemW] = useState(0);
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // Thêm state này

  /* ── Re‑calc on resize ─────────────────────────── */
  useEffect(() => {
    const handleResize = () => {
      const width = wrapRef.current?.offsetWidth || 0;
      const v = getVisible(width);
      setVisible(v);
      setItemW((width - GAP * (v - 1)) / v); // 👈 trừ khoảng GAP
      setIndex((i) => Math.min(i, products.length - v));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ── Scroll khi index đổi ──────────────────────── */
  useEffect(() => {
    trackRef.current?.scrollTo({
      left: index * (itemW + GAP),
      behavior: 'smooth',
    });
  }, [index, itemW]);

  /* ── Nút trái/phải ─────────────────────────────── */
  const slide = (dir) =>
    setIndex((i) => Math.max(0, Math.min(i + (dir === 'left' ? -1 : 1), products.length - visible)));

  /* ── Pointer drag (mouse + touch) ─────────────── */
  const drag = useRef({ start: 0, left: 0, active: false, moved: false });

  const onDown = (e) => {
    drag.current = {
      start: e.clientX ?? e.touches[0].clientX,
      left: trackRef.current.scrollLeft,
      active: true,
      moved: false,
    };
    setIsDragging(true); // Bắt đầu kéo thì tắt scroll-smooth
    e.preventDefault(); // ngăn ghost drag
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
    setIsDragging(false); // Kết thúc kéo thì bật lại scroll-smooth
    /* Snap */
    const newIdx = Math.round(trackRef.current.scrollLeft / (itemW + GAP));
    setIndex(newIdx);
  };

  /* ── JSX ───────────────────────────────────────── */
  return (
    <div ref={wrapRef} className="relative mx-auto max-w-[1280px] px-0 select-none">
      <h2 className="text-2xl font-bold text-center mt-12 mb-4">BOARD GAME</h2>

      {/* Nút trái */}
      <button
        onClick={() => slide('left')}
        disabled={index === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow disabled:opacity-40"
      >
        <ChevronLeft className="text-honvietRed" />
      </button>

      {/* Track scroll */}
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
              onPointerUp={(e) => {
                if (!drag.current.moved) {
                  console.log('CLICKED PRODUCT', p.id); // ← Thay bằng open modal/navigate sau này
                }
              }}
            >

              <img
                src={p.image}
                alt={p.name}
                draggable={false}          /* ngăn ghost khi kéo */
                className="rounded-t-xl w-full h-[220px] object-cover select-none"
              />
              <div className="p-3 text-sm">
                <div className="font-bold text-honvietRed uppercase text-xs">{p.brand}</div>
                <div className="mt-1 font-medium line-clamp-2">{p.name}</div>
                <div className="mt-2">
                  <span className="text-red-600 font-bold text-base">{formatPrice(p.price)}</span>{' '}
                  {!!p.oldPrice && (
                    <>
                      <span className="ml-1 line-through text-gray-400 text-sm">{formatPrice(p.oldPrice)}</span>
                      <span className="ml-1 text-xs text-white bg-red-500 px-1.5 py-0.5 rounded">
                        -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nút phải */}
      <button
        onClick={() => slide('right')}
        disabled={index >= products.length - visible}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow disabled:opacity-40"
      >
        <ChevronRight className="text-honvietRed" />
      </button>
    </div>
  );
}

