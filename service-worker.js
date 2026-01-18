/**
 * نظام التخزين المؤقت للفواتير - النسخة المحدثة لعام 2026
 * تم إضافة ميزات دعم iOS و iPhone لضمان التحديث الفوري
 */

const CACHE_NAME = "invoice-cache-v4"; // قم بزيادة الرقم عند كل تحديث رئيسي
const FILES_TO_CACHE = [
  "/index.html",
  "/invoices.html",
  "/cart.html",
  "/stores.html",
  "/invoice_print.html",
  "/manifest.json",
  "/assets/css/normalize.css",
  "/assets/css/nav.css",
  "/assets/css/cats.css",
  "/assets/css/footer.css",
  "/assets/css/products.css",
  "/assets/css/invoices.css",
  "/assets/css/cart.css",
  "/assets/css/stores.css",
  "/assets/css/invoice_print.css",
  "/assets/css/toast_notification.css",
  "/assets/java/script1.js",
  "/assets/java/script2.js",
  "/assets/java/script3.js",
  "/assets/java/script4.js",
  "/assets/java/admin.js",
  "/assets/java/data.js",
  "/assets/java/export_import_data.js",
  "/assets/java/html2pdf.bundle.min.js",
  "/assets/java/invoice_logo.js",
  "/assets/java/invoice_print.js",
  "/assets/java/invoiceCodec.js",
  "/assets/java/show_toast.js",
  "/assets/plugins/fuse/fuse.js",
  "/assets/plugins/font-awesome/css/font-awesome.css",
  "/assets/plugins/font-awesome/css/font-awesome.min.css",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.eot",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.svg",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.ttf",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.woff",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.woff2",
  "/assets/plugins/font-awesome/fonts/FontAwesome.otf",
];

// 1. مرحلة التثبيت: تحميل الملفات الأساسية
self.addEventListener("install", (event) => {
  console.log("🛠️ Service Worker: Installing...");
  self.skipWaiting(); // اجبار النسخة الجديدة على التفعيل فوراً (مهم للآيفون)
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        FILES_TO_CACHE.map((file) =>
          cache.add(file).catch((err) => console.warn(`⚠️ فشل تخزين: ${file}`, err))
        )
      );
    })
  );
});

// 2. مرحلة التفعيل: تنظيف الكاش القديم
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activated");
  event.waitUntil(
    Promise.all([
      // اجبار الـ Service Worker على التحكم في الصفحة فوراً
      self.clients.claim(),
      // حذف أي كاش قديم لا يطابق الاسم الحالي
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("🧹 حذف الكاش القديم:", cache);
              return caches.delete(cache);
            }
          })
        );
      })
    ])
  );
});

// 3. مرحلة جلب البيانات (Fetch)
// استراتيجية: Stale-While-Revalidate
self.addEventListener("fetch", (event) => {
  // لا تقم بتخزين طلبات الـ POST أو الطلبات الخارجية غير الآمنة
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // إذا كان الاستجابة صحيحة، قم بتحديث الكاش
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // في حالة انقطاع الإنترنت تماماً وعدم وجود كاش
        return cachedResponse; 
      });

      // ارجع النسخة المخبأة بسرعة، وحدثها في الخلفية
      return cachedResponse || fetchPromise;
    })
  );
});