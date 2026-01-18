// const CACHE_NAME = "invoice-cache-v2";
// const FILES_TO_CACHE = [
//   "/index.html",
//   "/invoices.html",
//   "/cart.html",
//   "/stores.html",
//   "/invoice_print.html",
//   "/manifest.json",
//   "/assets/css/normalize.css",
//   "/assets/css/nav.css",
//   "/assets/css/cats.css",
//   "/assets/css/footer.css",
//   "/assets/css/products.css",
//   "/assets/css/invoices.css",
//   "/assets/css/cart.css",
//   "/assets/css/stores.css",
//   "/assets/css/invoice_print.css",
//   "/assets/css/toast_notification.css",
//   "/assets/java/script1.js",
//   "/assets/java/script2.js",
//   "/assets/java/script3.js",
//   "/assets/java/script4.js",
//   "/assets/java/admin.js",
//   "/assets/java/data.js",
//   "/assets/java/export_import_data.js",
//   "/assets/java/html2pdf.bundle.min.js",
//   "/assets/java/invoice_logo.js",
//   "/assets/java/invoice_print.js",
//   "/assets/java/invoiceCodec.js",
//   "/assets/java/show_toast.js",
//   "/assets/plugins/fuse/fuse.js",
//   "/assets/plugins/font-awesome/css/font-awesome.css",
//   "/assets/plugins/font-awesome/css/font-awesome.min.css",
//   "/assets/plugins/font-awesome/fonts/fontawesome-webfont.eot",
//   "/assets/plugins/font-awesome/fonts/fontawesome-webfont.svg",
//   "/assets/plugins/font-awesome/fonts/fontawesome-webfont.ttf",
//   "/assets/plugins/font-awesome/fonts/fontawesome-webfont.woff",
//   "/assets/plugins/font-awesome/fonts/fontawesome-webfont.woff2",
//   "/assets/plugins/font-awesome/fonts/FontAwesome.otf",
// ];

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       // محاولة cache كل ملف على حدة لتجنب فشل العملية بأكملها
//       return Promise.allSettled(
//         FILES_TO_CACHE.map((file) =>
//           cache.add(file).catch((err) => {
//             console.warn(`فشل تخزين الملف مؤقتاً: ${file}`, err);
//           }),
//         ),
//       );
//     }),
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       const fetchPromise = fetch(event.request).then((networkResponse) => {
//         // تحديث الكاش بالنسخة الجديدة من السيرفر
//         caches.open(CACHE_NAME).then((cache) => {
//           cache.put(event.request, networkResponse.clone());
//         });
//         return networkResponse;
//       });
//       // ارجع النسخة المخبأة فوراً أو انتظر نسخة الشبكة
//       return cachedResponse || fetchPromise;
//     })
//   );
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cache) => {
//           if (cache !== CACHE_NAME) {
//             console.log("حذف الكاش القديم...");
//             return caches.delete(cache);
//           }
//         })
//       );
//     })
//   );
// });
