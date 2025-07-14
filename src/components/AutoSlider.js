import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // nếu chưa cài: npm i lucide-react

const slides = [
  {
    background: 'https://picsum.photos/seed/hnvbg1/1600/600',
    overlays: [
      'https://picsum.photos/seed/hnv1/300/300',
      'https://picsum.photos/seed/hnv2/300/300',
      'https://picsum.photos/seed/hnv3/300/300',
    ],
  },
  {
    background: 'https://picsum.photos/seed/hnvbg2/1600/600',
    overlays: [
      'https://picsum.photos/seed/hnv4/300/300',
      'https://picsum.photos/seed/hnv5/300/300',
      'https://picsum.photos/seed/hnv6/300/300',
    ],
  },
  {
    background: 'https://picsum.photos/seed/hnvbg3/1600/600',
    overlays: [
      'https://picsum.photos/seed/hnv7/300/300',
      'https://picsum.photos/seed/hnv8/300/300',
      'https://picsum.photos/seed/hnv9/300/300',
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
    <div className="relative w-full h-[700px] overflow-hidden">
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
            <div className="absolute inset-0 bg-black/20" />

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
            </div>
            
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
