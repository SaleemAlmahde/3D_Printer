const CACHE_NAME = "invoice-cache-v1";
const FILES_TO_CACHE = [
  "/",
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
  "/assets/java/invoice_print.js",
  "/assets/java/invoiceCodec.js.js",
  "/assets/java/invoice_print.js",
  "/assets/java/show_toast.js",
  "/assets/plugins/fuse/fuse.js",
  "/assets/plugins/fonts/alfont_com_AlFont_com_K24KurdishBold-Bold-1.ttf",
  "/assets/plugins/fonts/alfont_com_LANTX-Regular.otf",
  "/assets/plugins/fonts/AM-ZAIN-ORIGINAL.ttf",
  "/assets/plugins/fonts/Bahij_TheSansArabic-Bold.ttf",
  "/assets/plugins/fonts/TheYearofTheCamel-ExtraBold.otf",
  "/assets/plugins/fonts/uthmanic_hafs_v22.ttf",
  "/assets/plugins/fonts/Ya-ModernPro-Bold.otf",
  "/assets/plugins/font-awesome/css/font-awesome.css",
  "/assets/plugins/font-awesome/css/font-awesome.min.css",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.eot",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.svg",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.ttf",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.woff",
  "/assets/plugins/font-awesome/fonts/fontawesome-webfont.woff2",
  "/assets/plugins/font-awesome/fonts/FontAwesome.otf",
  
  
//   "/css/style.css",
//   "/js/main.js"
  
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
