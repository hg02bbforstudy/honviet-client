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
    id: 106,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1754071161/Copy_of_%C3%81O_MI%E1%BB%80N_B%E1%BA%AEC_g2di6k.png','https://res.cloudinary.com/dhhljyybq/image/upload/v1754071161/Copy_of_%C3%81O_MI%E1%BB%80N_B%E1%BA%AEC_g2di6k.png','https://res.cloudinary.com/dhhljyybq/image/upload/v1754071161/Copy_of_%C3%81O_MI%E1%BB%80N_B%E1%BA%AEC_g2di6k.png'],
    name: 'Áo phông miền Bắc',
    price: 199000,
    brand: 'Hồn Việt',
  },
  {
    id: 107,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1754071162/%C3%81O_TRUNG_ja1hzn.png','https://res.cloudinary.com/dhhljyybq/image/upload/v1754071162/%C3%81O_TRUNG_ja1hzn.png','https://res.cloudinary.com/dhhljyybq/image/upload/v1754071162/%C3%81O_TRUNG_ja1hzn.png'],
    name: 'Áo phông miền Trung',
    price: 199000,
    brand: 'Hồn Việt',
  },
  {
    id: 108,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1754071162/%C3%81O_MI%E1%BB%80N_NAM_digc0y.png','https://res.cloudinary.com/dhhljyybq/image/upload/v1754071162/%C3%81O_MI%E1%BB%80N_NAM_digc0y.png','https://res.cloudinary.com/dhhljyybq/image/upload/v1754071162/%C3%81O_MI%E1%BB%80N_NAM_digc0y.png'],
    name: 'Áo phông miền Nam',
    price: 199000,
    brand: 'Hồn Việt',
  },
  {
    id: 101,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1754499066/cbcf3cc0-5786-416e-ab3a-5392c181dac9_fgiyhd.jpg','https://res.cloudinary.com/dhhljyybq/image/upload/v1754499066/6b15f0cc-9f65-42c4-badb-9479edc3309e_blf0zo.jpg'],
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
  {//oke
    id: 105,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_dyzzii.png', 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117421/STICKER_2_isogws.png', 'https://res.cloudinary.com/dhhljyybq/image/upload/v1753117422/STICKER_1_swe1jc.png'],
    name: 'Móc khóa',
    price: 10000,
    brand: 'Hồn Việt',
  },
  {
    id: 109,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1754583102/1_jqzjzd.jpg',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583101/68e0f2b9-e1eb-45a8-8a51-c519eec740c9_t8uusw.jpg',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583101/5aa49ba3-3ecc-46ae-860f-68a35e3ae126_fnjkup.jpg',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583102/10a07977-02c6-45be-8c29-4cf36ab7cdd2_bgw8hm.jpg',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583103/5341412b-63e7-4c35-a334-07a07981ff11_zbtxnv.jpg'
    ],
    name: 'Sticker',
    price: 15000,
    brand: 'Hồn Việt',
  },
  {
    id: 110,
    image: ['https://res.cloudinary.com/dhhljyybq/image/upload/v1754583084/804ff630-9e5f-4a4e-b631-e03d833a941a_bmgjpd.jpg',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583083/a01061ba-f781-46b2-a5ad-07c7af07eb21_ja7itk.jpg',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583084/300b2ade-2990-4b24-a29b-c060f7398e24_cvhsdv.jpg',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583085/887b4234-7a8e-4ee0-8e28-c4e4a0a45459_n7i0qb.png',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583084/be6c83bc-4d02-488e-a25f-b454922a4414_tuczxq.jpg',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1754583091/b5fae70a-a6c2-4925-ad64-6c4a64708dc4_nrmv2a.jpg'
    ],
    name: 'Đĩa gốm',
    price: 179000,
    brand: 'Hồn Việt',
  },
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
