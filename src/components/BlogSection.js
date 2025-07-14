import React, { useEffect, useRef, useState } from 'react';

const banners = [
  {
    type: 'image',
    src: 'https://picsum.photos/id/1020/1200/400',
    alt: 'Ảnh quảng cáo sản phẩm mới',
  },
  {
    type: 'text',
    content: '🎉 Ưu đãi HOT: Mua 2 tặng 1 toàn bộ phụ kiện trong tuần này!',
  },
  {
    type: 'image',
    src: 'https://picsum.photos/id/1021/1200/400',
    alt: 'Ảnh quảng cáo sự kiện sắp tới',
  },

];

export default function BlogBanner() {
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  // Chuyển ảnh/text sau 5s — không áp dụng cho video
  useEffect(() => {
    if (banners[index].type === 'video') return;

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [index]);

  // Khi index đổi → nếu là video thì play từ đầu
  useEffect(() => {
    if (banners[index].type === 'video' && videoRef.current) {
      const video = videoRef.current;
      video.muted = muted;
      video.volume = volume;
      video.currentTime = 0;
      video.play().catch(() => { });
    }
  }, [index]);

  // Khi chỉnh volume hoặc muted thì cập nhật video nhưng không reset
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = muted;
      video.volume = volume;
    }
  }, [muted, volume]);

  const handleVideoEnded = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const banner = banners[index];

  return (
    <div className="relative mx-auto max-w-[1280px] px-0 select-none my-16">
      <h2 className="text-2xl font-bold text-center mb-6">BLOG</h2>
      <div className="h-[400px] flex items-center justify-center relative bg-black/20">
        {/* --- Render nội dung chính --- */}
        {banner.type === 'image' && (
          <img
            src={banner.src}
            alt={banner.alt}
            className="h-full w-auto max-w-full mx-auto block object-cover"
          />
        )}

        {banner.type === 'video' && (
          <div className="w-full h-full relative flex items-center justify-center">
            <video
              ref={videoRef}
              src={banner.src}
              muted={muted}
              onEnded={handleVideoEnded}
              autoPlay
              playsInline
              className="h-full w-auto max-w-full mx-auto block object-cover cursor-pointer"
              onClick={() => setMuted((m) => !m)}
            />
            {/* Volume slider */}
            <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 rounded flex items-center gap-2 text-sm">
              🔉
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
        )}

        {banner.type === 'text' && (
          <div className="absolute inset-0 bg-black text-white flex items-center justify-center px-6">
            <div className="text-2xl font-bold text-center leading-snug max-w-5xl mx-auto">
              {banner.content}
            </div>
          </div>
        )}


        {/* Indicator */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {banners.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-white' : 'bg-gray-500/50'
                }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
