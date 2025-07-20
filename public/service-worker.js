const CACHE_NAME = 'hon-viet-image-cache-v1';
const IMAGE_URLS = [
  'https://res.cloudinary.com/dhhljyybq/image/upload/v1752597473/Avatar_2_h5gtk9.png',
  'https://res.cloudinary.com/dhhljyybq/image/upload/v1752597281/Product_1.png',
  // thêm các ảnh bạn muốn preload vào đây
  
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(IMAGE_URLS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Chỉ cache các ảnh từ Cloudinary
  if (requestUrl.hostname.includes('res.cloudinary.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
    );
  }
});
