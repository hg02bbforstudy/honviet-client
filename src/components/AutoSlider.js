import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // nếu chưa cài: npm i lucide-react

const slides = [
  {
    background: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594682/MI%E1%BB%80N_B%E1%BA%AEC_zfosjy.png',
    overlays: [
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594701/1_grkt7p.png',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594703/2_qnjmvv.png',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594702/3_se4uqs.png',
    ],
  },
  {
    background: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594198/hon_viet_mien_trung.png',
    overlays: [
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594735/1_z42vo5.png',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594735/2_z18bga.png',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594736/3_rnxob7.png',
    ],
  },
  {
    background: 'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594687/MI%E1%BB%80N_NAM_cgc9dw.png',
    overlays: [
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594720/1_kvclhd.png',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594720/2_uazoah.png',
      'https://res.cloudinary.com/dhhljyybq/image/upload/v1752594723/3_hafyyv.png',
    ],
  },
];

export default function AutoBackgroundSlider() {
  const [index, setIndex] = useState(0);
  const timer = useRef(null);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Reset timer mỗi khi index thay đổi
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      nextSlide();
    }, 5000);
    return () => clearTimeout(timer.current);
  }, [index]);

  return (
    <div className="relative w-full h-[700px] overflow-hidden mt-1">
      {/* wrapper flex */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="min-w-full relative flex-shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.background})` }}
          >
            {/* <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 z-10 flex items-center justify-center gap-6">
              {s.overlays.map((src, j) => (
                <div
                  key={j}
                  className="w-64 h-96 overflow-hidden rounded-xl shadow-lg bg-white"
                >
                  <img
                    src={src}
                    alt={`overlay-${i}-${j}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div> */}
            
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? 'bg-honvietRed scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Nút điều hướng trái/phải */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/70 hover:bg-white rounded-full shadow"
      >
        <ChevronLeft className="text-honvietRed w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/70 hover:bg-white rounded-full shadow"
      >
        <ChevronRight className="text-honvietRed w-6 h-6" />
      </button>
    </div>
  );
}
