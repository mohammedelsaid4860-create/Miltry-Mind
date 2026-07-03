const CACHE_NAME = 'military-store-v1';
const ASSETS = [
  '/Miltry-Mind/',
  '/Miltry-Mind/index.html'
];

// تثبيت ملفات الأوفلاين
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // تفعيل النسخة الجديدة فوراً بدون انتظار
});

// تفعيل وتطهير الكاش القديم
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// جلب الملفات بذكاء (حل مشكلة زر الرجوع)
self.addEventListener('fetch', (e) => {
  // تخطي الطلبات التي ليست من نوع GET (مثل إعلانات أو روابط خارجية) عشان ميعلقش المتصفح
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // لو النت شغال، افتح من النت وحدث الكاش في الخلفية
        const cacheCopy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, cacheCopy));
        return res;
      })
      .catch(() => {
        // لو النت مقطوع تماماً، افتح النسخة المحفوظة أوفلاين
        return caches.match(e.request).then((response) => {
          return response || caches.match('/Miltry-Mind/index.html');
        });
      })
  );
});
