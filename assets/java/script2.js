// ======================================================
// ⚙️ إعدادات البحث الحالي (Global State)
// ======================================================
let currentSearchQuery = ""; // متغير جديد لحفظ نص البحث السريع
const DEFAULT_FILTERS = {
  paymentStatus: "all",
  store: "all",
  sortOption: "date_desc",
  startDate: "", // 👈 القيمة الافتراضية فارغة
  endDate: "", // 👈 القيمة الافتراضية فارغة
};

// تأكد من أن currentFilters يبدأ بالحالة الافتراضية
let currentFilters = { ...DEFAULT_FILTERS };
// Marker to keep an invoice open after re-render (set id before calling renderInvoices)
window.__keepOpenInvoiceId = null;

function calculateTotals(products) {
  if (!Array.isArray(products)) {
    console.error("calculateTotals: products is not an array", products);
    return { totalSYP: 0 };
  }

  try {
    return products.reduce(
      (totals, p) => {
        // التحقق من وجود القيم المطلوبة
        const priceSYP = Number(p.priceSYP) || 0;
        const quantity = Number(p.quantity) || 0;

        return {
          totalSYP: totals.totalSYP + priceSYP * quantity,
        };
      },
      { totalSYP: 0 }
    );
  } catch (error) {
    console.error("Error in calculateTotals:", error, products);
    return { totalSYP: 0 };
  }
}

// تطبيق الخصم/الزيادة على قيمة إجمالي
function applyAdjustment(total, type, value) {
  const v = parseFloat(value);
  if (!type || isNaN(v) || v === 0) return total;
  let adjusted = total;
  switch (type) {
    case "+":
      adjusted = total + v;
      break;
    case "-":
      adjusted = total - v;
      break;
    case "+%":
      adjusted = total + (total * v) / 100;
      break;
    case "-%":
      adjusted = total - (total * v) / 100;
      break;
    default:
      adjusted = total;
  }
  // لا نريد قيمة سالبة على الإجمالي
  if (isNaN(adjusted) || adjusted < 0) return 0;
  return Math.round(adjusted * 100) / 100; // دقة بسيطة إلى سنت
}

// تحقق إن الفاتورة تطابق نص البحث (يتحقق عبر أغلب الحقول: المعرف، العميل، الهاتف، المحافظة، الشحن، التواريخ، المنتجات، الإجماليات)
function invoiceMatches(invoice, query) {
  if (!query) return true;
  const q = query.toString().toLowerCase().trim();

  // helper to test any stringy value
  const includes = (val) => {
    if (val === null || val === undefined) return false;
    return String(val).toLowerCase().includes(q);
  };

  // id (as number or padded)
  if (includes(invoice.id) || includes(invoice.id?.toString().padStart(3, "0")))
    return true;

  // basic invoice fields
  const fields = [
    invoice.customerName,
    invoice.phone,
    invoice.city,
    invoice.shippingCompany,
    invoice.shippingInfo,
    invoice.date,
    invoice.shippingDate,
    invoice.totalSYP,
  ];
  if (fields.some((f) => includes(f))) return true;

  // shipping flag
  if (
    typeof invoice.shipping === "boolean" &&
    String(invoice.shipping).includes(q)
  )
    return true;

  // products (name, color name, color code)
  if (Array.isArray(invoice.products)) {
    for (const p of invoice.products) {
      if (includes(p.name) || includes(p.quantity) || includes(p.priceSYP))
        return true;
      if (p.color) {
        if (includes(p.color.name) || includes(p.color.code)) return true;
      }
    }
  }

  return false;
}

// قراءة قيمة البحث من الحقل واستدعاء العرض مع الفلتر
function searchInvoices() {
  try {
    const input = document.getElementById("searchInput");
    const q = input ? input.value.toString().trim() : "";

    // 💡 1. تحديث المتغير العالمي لنص البحث
    currentSearchQuery = q;

    // 💡 2. استدعاء دالة عرض الفواتير بدون وسائط
    renderInvoices();
  } catch (e) {
    console.error("searchInvoices error:", e);
  }
}

function renderInvoices(filterStoreId = null) {
  const invoicesDiv = document.getElementById("invoices");
  invoicesDiv.innerHTML = "";

  const allInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
  let processedInvoices = [...allInvoices];

  // 🚨 الخطوة التشخيصية رقم 2: هل يوجد فواتير أساساً؟
  console.log(
    "عدد الفواتير التي تم جلبها من localStorage:",
    allInvoices.length
  );

  // 💡 تحديد القيمة التي سنستخدمها للفلترة: ID المُمرر أو القيمة المحفوظة
  // إذا كان هناك ID مُمرر من الـ URL، نستخدمه ونحفظه في currentFilters.store
  if (filterStoreId) {
    currentFilters.store = filterStoreId; // حفظ القيمة لتطبيقها ولظهور زر الإلغاء
  }

  processedInvoices = processedInvoices.filter((invoice) => {
    // أ. فلترة حالة الدفع
    const paymentFilter = currentFilters.paymentStatus;
    const invoiceStatus = invoice.payment?.status || "unpaid";

    if (paymentFilter !== "all" && invoiceStatus !== paymentFilter) {
      return false;
    }

    // ب. فلترة المتجر
    const storeFilter = currentFilters.store;
    const invoiceStoreName = invoice.customerName;

    if (storeFilter && storeFilter !== "all") {
      // 💡 ملاحظة: يجب أن نستخدم ID المتجر المخزن في الفاتورة للمقارنة
      // أنا أستخدم storeId هنا، قم بتغييره إذا كان المفتاح مختلفاً لديك (مثل posId)
      const invoiceStoreId = invoice.posId;

      const numericFilterId = parseInt(storeFilter);
      const numericInvoiceId = parseInt(invoiceStoreId);

      // 🚨 الخطوة التشخيصية رقم 1: طباعة القِيَم للمقارنة
      console.log(`
            ID الفاتورة: ${invoice.id}
            ID مُفلتر (URL): ${numericFilterId}
            ID المتجر في الفاتورة: ${numericInvoiceId}
            المقارنة: ${
              numericInvoiceId === numericFilterId ? "✅ تطابق" : "❌ لا تطابق"
            }
        `);

      // المقارنة بين IDs
      if (!isNaN(numericFilterId) && numericInvoiceId !== numericFilterId) {
        return false;
      }
    }

    // 🚨 إضافة فلترة نطاق التاريخ المفقودة
    const startFilter = currentFilters.startDate;
    const endFilter = currentFilters.endDate;

    if (startFilter || endFilter) {
      try {
        // 1. تحويل تاريخ الفاتورة إلى Timestamp
        // نفضل الحقل الرقمي `timestamp` إن وُجد لأنه موثوق
        let invoiceDateTimestamp = null;
        if (typeof invoice.timestamp === "number") {
          invoiceDateTimestamp = invoice.timestamp;
        } else if (invoice.date instanceof Date) {
          invoiceDateTimestamp = invoice.date.getTime();
        } else if (typeof invoice.date === "string") {
          // معالجة التواريخ المخزنة كنص عربي
          const pd = parseArabicDate(invoice.date);
          invoiceDateTimestamp =
            pd && !isNaN(pd.getTime()) ? pd.getTime() : NaN;
        } else {
          const d = new Date(invoice.date);
          invoiceDateTimestamp = !isNaN(d.getTime()) ? d.getTime() : NaN;
        }

        // 2. تحويل تاريخ البداية إلى Timestamp (بداية اليوم: 00:00:00)
        const startDateTimestamp = startFilter
          ? new Date(startFilter).setHours(0, 0, 0, 0)
          : 0;

        // 3. تحويل تاريخ النهاية إلى Timestamp (نهاية اليوم: 23:59:59)
        const endDateTimestamp = endFilter
          ? new Date(endFilter).setHours(23, 59, 59, 999)
          : Infinity;

        // 4. تطبيق المقارنة
        if (
          (isFinite(invoiceDateTimestamp) &&
            invoiceDateTimestamp < startDateTimestamp) ||
          (isFinite(invoiceDateTimestamp) &&
            invoiceDateTimestamp > endDateTimestamp)
        ) {
          return false;
        }
      } catch (error) {
        console.warn("خطأ في معالجة تاريخ الفاتورة:", invoice.date, error);
        // في حالة الخطأ، نعرض الفاتورة لتجنب فقدان البيانات
      }
    }

    // 💡 ج. تطبيق فلترة البحث السريع
    if (currentSearchQuery && !invoiceMatches(invoice, currentSearchQuery)) {
      return false;
    }
    return true; // إذا نجحت في جميع الفلاتر
  });

  processedInvoices.sort((a, b) => {
    const sortOption = currentFilters.sortOption;

    // دالة مساعدة للحصول على القيمة الآمنة للمقارنة
    const getVal = (invoice, key) => {
      switch (key) {
        case "date":
          // نفضّل الحقل الرقمي `timestamp` إن وُجد لأنه أكثر ثباتاً
          if (typeof invoice.timestamp === "number") return invoice.timestamp;
          // نحول التاريخ إلى قيمة يمكن مقارنتها (مثل Timestamp)
          let t = new Date(invoice.date).getTime();
          if (isNaN(t)) {
            const pd = parseArabicDate(invoice.date);
            t = pd && pd.getTime && !isNaN(pd.getTime()) ? pd.getTime() : NaN;
          }
          return isNaN(t) ? 0 : t;
        case "total":
          // نحصل على الإجمالي الكلي بالليرة السورية
          return Number(invoice.totalSYP) || 0;
        case "remaining":
          // نحصل على المبلغ المتبقي
          return Number(invoice.payment?.remainingSYP) || 0;
        default:
          return 0;
      }
    };

    const [key, direction] = sortOption.split("_"); // مثال: 'date_desc' -> ['date', 'desc']

    const valA = getVal(a, key);
    const valB = getVal(b, key);

    if (valA < valB) {
      return direction === "asc" ? -1 : 1;
    }
    if (valA > valB) {
      return direction === "asc" ? 1 : -1;
    }
    return 0; // متساوون
  });

  // ===================================
  // 💡 5. التحكم بزر إلغاء الفلترة (resetFabBtn)
  // ===================================
  const isFilteredOrSorted =
    currentFilters.paymentStatus !== DEFAULT_FILTERS.paymentStatus ||
    currentFilters.store !== DEFAULT_FILTERS.store ||
    currentFilters.sortOption !== DEFAULT_FILTERS.sortOption ||
    // 💡 الجديد: إضافة فلاتر التاريخ للتحقق
    currentFilters.startDate !== DEFAULT_FILTERS.startDate ||
    currentFilters.endDate !== DEFAULT_FILTERS.endDate ||
    (currentSearchQuery && currentSearchQuery.length > 0);

  const resetBtn = document.getElementById("resetFabBtn");

  if (resetBtn) {
    if (isFilteredOrSorted) {
      resetBtn.classList.remove("hidden");
    } else {
      resetBtn.classList.add("hidden");
    }
  }
  // -----------------------------------

  if (processedInvoices.length === 0) {
    invoicesDiv.innerHTML = `<div class="no-invoices-message">لا توجد فواتير مطابقة لخيارات الفلترة الحالية.</div>`;
    return;
  }

  processedInvoices.forEach((invoice, idx) => {
    const invoiceCard = document.createElement("div");
    invoiceCard.classList.add("invoice-card");

    let productsHTML = "";
    const productsArr = Array.isArray(invoice.products) ? invoice.products : [];
    if (!Array.isArray(invoice.products)) {
      console.warn(
        "فاتورة بدون قائمة منتجات أو بقيمة غير صحيحة (سيتم عرضها فارغة):",
        invoice.id
      );
    }

    productsArr.forEach((product) => {
      const safePriceSYP = Number(product.priceSYP) || 0;

      if (product.isCustom) {
        // Custom product: show the admin-entered name and optional color
        const customDesc = product.customDescription
          ? String(product.customDescription)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
          : "";
        const displayName = product.name || "منتج مخصص";
        const colorCodeRaw = product?.color?.code || "";
        const colorTitleRaw = product?.color?.name || "";
        const hasColor =
          colorCodeRaw &&
          colorCodeRaw !== "#ffffff" &&
          colorCodeRaw !== "undefined";
        const noteText = product.note
          ? String(product.note).replace(/</g, "&lt;").replace(/>/g, "&gt;")
          : "";

        productsHTML += `
      <li class="product-item" onclick="event.stopPropagation(); toggleCustomDesc(this)" style="cursor:pointer;">
        <span class="product-name">${displayName}</span>
        ${
          hasColor
            ? `<span class="product-color" title="${colorTitleRaw}" style="background-color: ${colorCodeRaw}"></span>`
            : `<span class="product-custom-icon" title="منتج مخصص">🛠️</span>`
        }
        <span class="product-qty">x${product.quantity}</span>
        <span class="product-price">${safePriceSYP.toLocaleString()} ل.س</span>
        ${
          customDesc || noteText
            ? `<div class="invoice-custom-desc" style="display:none; color: white; padding:8px;">${customDesc}${
                noteText ? `<div class="note-text">${noteText}</div>` : ""
              }</div>`
            : ""
        }
      </li>
    `;
      } else {
        const colorCodeRaw = product?.color?.code || "";
        const colorTitleRaw = product?.color?.name || "";
        // Normalize color: prefer hex-like values, fallback to light gray
        const displayColor =
          colorCodeRaw && colorCodeRaw !== "undefined"
            ? colorCodeRaw
            : "#CCCCCC";
        const displayTitle =
          colorTitleRaw && colorTitleRaw !== "undefined"
            ? colorTitleRaw
            : "بدون لون";

        const descParts = [];
        if (product.customDescription) {
          descParts.push(
            String(product.customDescription)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
          );
        }
        if (product.note) {
          descParts.push(
            `<div class="note-text">${String(product.note)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")}</div>`
          );
        }
        if (product.description) {
          descParts.push(
            String(product.description)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
          );
        }
        if (product.shortDisc) {
          descParts.push(
            String(product.shortDisc)
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
          );
        }

        const descHTML = descParts.length
          ? `<div class="invoice-custom-desc" style="display:none; color: white; padding:8px;">${descParts.join(
              ""
            )}</div>`
          : "";

        const clickableAttr = descParts.length
          ? ' onclick="event.stopPropagation(); toggleCustomDesc(this)" style="cursor:pointer;"'
          : "";

        productsHTML += `
    <li class="product-item"${clickableAttr}>
      <span class="product-name">${product.name}</span>
      <span class="product-color" title="${displayTitle}" style="background-color: ${displayColor}"></span>
      <span class="product-qty">x${product.quantity}</span>
      <span class="product-price">${safePriceSYP.toLocaleString()} ل.س</span>
      ${descHTML}
    </li>
  `;
      }
    });

    const safeTotalSYP = Number(invoice.totalSYP) || 0;
    const origTotalSYP = Number(invoice.totalOriginalSYP) || 0;
    const showOrigTotal = origTotalSYP && origTotalSYP !== safeTotalSYP;

    const payment = invoice.payment || {
      status: "unpaid",
      paidSYP: 0,
      remainingSYP: safeTotalSYP,
    };
    if (payment.remainingSYP === undefined)
      payment.remainingSYP = safeTotalSYP - (payment.paidSYP || 0);
    const notes = invoice.notes || "";

    const statusClass = `status-${payment.status || "unpaid"}`;
    invoiceCard.classList.add(statusClass);

    const formattedShippingDate = invoice.shippingDate
      ? formatDateToYYYYMMDD(invoice.shippingDate)
      : "-";

    // attach invoice id for later lookup
    invoiceCard.dataset.invoiceId = invoice.id;

    const displayInvoiceNumber = idx + 1;

    invoiceCard.innerHTML = `
      <div class="invoice-header invoice-toggle-area">
        <h4>فاتورة #${displayInvoiceNumber}</h4>
        <span class="invoice-date">${invoice.date}</span>
      </div>

      <div class="invoice-summary">
        <div class="summary-line-1">
          <span class="summary-customer"><strong >المشتري : </strong> ${
            invoice.customerName
          }</span>
          ${
            showOrigTotal
              ? `<span class="summary-total"><strong class="summary-total">المبلغ الكلي : </strong>
                <span class="original-total" style="text-decoration:line-through;color:black;display:block">${origTotalSYP.toLocaleString()} ل.س</span>
                <span class="adjusted-total" style="font-weight:bold;display:block">${safeTotalSYP.toLocaleString()} ل.س</span>
               </span>`
              : `<span class="summary-total"><strong class="summary-total" >المبلغ الكلي : </strong> ${safeTotalSYP.toLocaleString()} ل.س</span>`
          }
          </div>

          <div class="summary-line-2">
        ${
          payment.status === "paid-partial"
            ? `
        <p><strong>المبلغ المدفوع :</strong> ${(
          payment.paidSYP || 0
        ).toLocaleString()} ل.س</p>
        <p><strong>المتبقي :</strong> ${(
          payment.remainingSYP || safeTotalSYP - (payment.paidSYP || 0)
        ).toLocaleString()} ل.س</p>
      `
            : ""
        }
      </div>
        </div>

      <div class="invoice-body hidden">
        <div class="invoice-info">
          <p><strong>المشتري :</strong> ${invoice.customerName}</p>
          <div class="invoice-contacts-logo">
          <div class="invoice-contacts">
          <p><strong>هاتف :</strong> ${invoice.phone}</p>
          <p><strong>محافظة :</strong> ${invoice.city}</p>
          <p><strong>نوع التسليم :</strong> ${
            invoice.shipping ? "شحن" : "ضمن حمص"
          }</p>
          ${
            invoice.shipping
              ? `<p><strong>شركة الشحن :</strong> ${
                  invoice.shippingCompany || "-"
                }</p>
          <p><strong>معلومات الشحن :</strong> ${
            invoice.shippingInfo || "-"
          }</p>`
              : `<p><strong>الموقع:</strong> ${invoice.shippingInfo || "-"}</p>`
          }
          </div>
          <div class="invoice-logo-wrap">
            <img class="invoice-logo" src="./assets/imgs/log_png-removebg-preview.png" alt="logo">
          </div>
          </div>
          <p><strong>موعد التسليم :</strong> ${formattedShippingDate || "-"}</p>

          ${`<p><strong>حالة الدفع :</strong>
            ${
              payment.status === "unpaid"
                ? `لم يدفع <i class="fa fa-times-circle" style="color: red;"></i>`
                : payment.status === "paid-partial"
                ? `دُفع جزئياً <i class="fa fa-adjust" style="color: yellow;"></i>`
                : `دُفع كامل <i class="fa fa-check-circle" style="color: green;"></i>`
            }
            `}      

          ${notes ? `<p><strong>ملاحظات :</strong> ${notes}</p>` : ""}

          <div class="invoice-products-toggle">
            <p><strong>المنتجات :</strong></p>
            <hr class="invoice-hr">
            <button class="btn-toggle-products" title="عرض المنتجات"><i class="fa fa-chevron-down"></i></button>
          </div>
        </div>

        <div class="invoice-products hidden">
          <ul>${productsHTML}</ul>
        </div>

        <div class="invoice-footer">
      <div class="invoice-info">
        ${
          showOrigTotal
            ? `<span class="total">الإجمالي : <span class="original-total" style="text-decoration:line-through;color:#999;display:block">${origTotalSYP.toLocaleString()} ل.س</span><span class="adjusted-total" style="font-weight:bold;display:block">${safeTotalSYP.toLocaleString()} ل.س</span></span>`
            : `<span class="total">الإجمالي : ${safeTotalSYP.toLocaleString()} ل.س </span>`
        }

    ${
      payment.status === "paid-partial"
        ? `
      <p><strong>المبلغ المدفوع :</strong> ${(
        payment.paidSYP || 0
      ).toLocaleString()} ل.س</p>
      <p><strong>المتبقي :</strong> ${(
        payment.remainingSYP || safeTotalSYP - (payment.paidSYP || 0)
      ).toLocaleString()} ل.س</p>
    `
        : ""
    }
  </div>
  <button class="btn-view" onclick="editInvoice(${
    invoice.id
  })">تعديل الفاتورة</button>
</div>
      </div>
    `;

    invoicesDiv.appendChild(invoiceCard);

    // ------------------------------------------------------------------
    // ⬇️ 🎯 المنطقة الصحيحة لإضافة منطق التبديل الرئيسي 🎯 ⬇️
    // ------------------------------------------------------------------

    const toggleArea = invoiceCard.querySelector(".invoice-toggle-area");
    const summaryContainer = invoiceCard.querySelector(".invoice-summary");
    const detailsContainer = invoiceCard.querySelector(".invoice-body");

    // 2. معالج الحدث الجديد (التعديل الرئيسي يكمن هنا)
    toggleArea.addEventListener("click", (e) => {
      // نتحقق من أن النقر ليس على زر المنتجات الداخلية
      if (e.target.closest(".btn-toggle-products")) return;

      // تبديل حالة الإظهار/الإخفاء بين الملخص والتفاصيل:
      // إذا كان الملخص ظاهراً، سنخفيه. وإذا كان مخفياً، سنظهره.
      summaryContainer.classList.toggle("hidden");

      // إذا كان البودي (التفاصيل) مخفياً، سنظهره. وإذا كان ظاهراً، سنخفيه.
      detailsContainer.classList.toggle("hidden");

      // ✅ منطق طي المنتجات (لضمان التناسق)
      if (detailsContainer.classList.contains("hidden")) {
        // إذا كان البودي مُخفى (أي الفاتورة مطوية الآن)، يجب طي المنتجات الداخلية.
        const productsDiv = invoiceCard.querySelector(".invoice-products");
        const toggleProductsBtn = invoiceCard.querySelector(
          ".btn-toggle-products"
        );
        const toggleProductsIcon = toggleProductsBtn
          ? toggleProductsBtn.querySelector("i")
          : null;

        // نطوي المنتجات إذا كانت مفتوحة
        if (productsDiv && !productsDiv.classList.contains("hidden")) {
          productsDiv.classList.add("hidden");
          if (toggleProductsIcon) {
            toggleProductsIcon.classList.replace(
              "fa-chevron-up",
              "fa-chevron-down"
            );
          }
        }
      }
    });

    // If we were asked to keep this invoice open (e.g., after editing), open it and scroll to it
    try {
      const keepId = window.__keepOpenInvoiceId;
      if (keepId && Number(keepId) === Number(invoice.id)) {
        // ensure summary collapsed and details shown
        if (
          summaryContainer &&
          !summaryContainer.classList.contains("hidden")
        ) {
          summaryContainer.classList.add("hidden");
        }
        if (detailsContainer && detailsContainer.classList.contains("hidden")) {
          detailsContainer.classList.remove("hidden");
        }
        const viewBtn = invoiceCard.querySelector(".btn-view");
        if (viewBtn) viewBtn.classList.add("visible-btn");
        // scroll the card into view
        invoiceCard.scrollIntoView({ behavior: "smooth", block: "center" });
        // clear marker so only one invoice is focused
        window.__keepOpenInvoiceId = null;
      }
    } catch (err) {
      console.warn(
        "Failed to auto-open invoice after save:",
        err && err.message
      );
    }

    // ✅ إظهار/إخفاء زر تعديل الفاتورة
    invoiceCard.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("btn-view") ||
        e.target.closest(".btn-toggle-products")
      )
        return;
      document.querySelectorAll(".btn-view.visible-btn").forEach((btn) => {
        if (btn !== invoiceCard.querySelector(".btn-view")) {
          btn.classList.remove("visible-btn");
        }
      });
      invoiceCard.querySelector(".btn-view").classList.toggle("visible-btn");
    });

    // ✅ إظهار/إخفاء قائمة المنتجات + تغيير الأيقونة
    const productsToggleBtn = invoiceCard.querySelector(".btn-toggle-products");
    const productsDiv = invoiceCard.querySelector(".invoice-products");
    if (productsToggleBtn) {
      productsToggleBtn.addEventListener("click", () => {
        productsDiv.classList.toggle("hidden");
        const icon = productsToggleBtn.querySelector("i");
        if (productsDiv.classList.contains("hidden")) {
          icon.classList.remove("fa-chevron-up");
          icon.classList.add("fa-chevron-down");
        } else {
          icon.classList.remove("fa-chevron-down");
          icon.classList.add("fa-chevron-up");
        }
      });
    }
  });

  // Toggle custom product description inside invoice card (only used for rendered invoice lists)
  function toggleCustomDesc(li) {
    try {
      const desc = li.querySelector(".invoice-custom-desc");
      if (!desc) return;
      if (desc.style.display === "none" || !desc.style.display) {
        desc.style.display = "block";
      } else {
        desc.style.display = "none";
      }
    } catch (e) {
      console.warn("toggleCustomDesc error:", e && e.message);
    }
  }
}
// expose a global toggle function so inline onclick handlers can call it
window.toggleCustomDesc = function (li) {
  try {
    // if someone passed an event target instead of the LI, normalize
    const el = li && li.nodeType ? li : li && li.target ? li.target : null;
    const listItem = el && el.closest ? el.closest("li.product-item") : el;
    const desc = listItem
      ? listItem.querySelector(".invoice-custom-desc")
      : null;
    if (!desc) return;
    desc.style.display = desc.style.display === "block" ? "none" : "block";
  } catch (e) {
    console.warn("window.toggleCustomDesc error:", e && e.message);
  }
};

// دالة إعادة تعيين النموذج
function resetForm() {
  const form = document.getElementById("invoiceForm");
  form.reset(); // إعادة تعيين الحقول الأساسية

  // إعادة تعيين حقول الشحن
  // إعادة تعيين حقول الشحن (شركة الشحن + معلومات الشحن)
  const shippingCompanyEl = document.getElementById("shippingCompany");
  if (shippingCompanyEl) shippingCompanyEl.value = "";
  const shippingInfoEl = document.getElementById("shippingInfo");
  if (shippingInfoEl) shippingInfoEl.value = "";
  document.getElementById("localShippingInfo").value = "";
  // إعادة تعيين تاريخ التسليم
  const deliveryDateEl = document.getElementById("deliveryDate");
  if (deliveryDateEl) deliveryDateEl.value = "";

  // إعادة تعيين قائمة المنتجات
  document.getElementById("selectedProductsList").innerHTML = "";

  // إعادة تعيين الإجماليات
  document.getElementById("totalSYP").textContent = "0";

  // إخفاء حقول الشحن والموقع
  document.getElementById("shippingFields").classList.add("hidden");
  document.getElementById("localFields").classList.add("hidden");

  // حذف معرف التعديل
  delete form.dataset.editingId;
  // إخفاء زر الحذف عند إعادة التهيئة (فقط يظهر أثناء التعديل)
  const delBtn = document.getElementById("deleteInvoiceBtn");
  if (delBtn) delBtn.classList.add("hidden");
  // تأكد أن حقل اختيار طريقة التسليم فارغ ويُخفي الحقول المرتبطة
  const deliverySelect = document.getElementById("deliveryType");
  if (deliverySelect) {
    deliverySelect.value = "";
    toggleShippingFields();
  }
  // إعادة تعيين حقول الدفع والملاحظات
  const paymentSelect = document.getElementById("paymentStatus");
  if (paymentSelect) paymentSelect.value = "unpaid";
  const paymentAmountEl = document.getElementById("paymentAmountPaid");
  if (paymentAmountEl) {
    paymentAmountEl.value = "";
    paymentAmountEl.classList.add("hidden");
  }
  const notesEl = document.getElementById("invoiceNotes");
  if (notesEl) notesEl.value = "";
  // إعادة تعيين حقل التعديل (الخصم/الزيادة)
  const adjVal = document.getElementById("adjustmentValue");
  const adjType = document.getElementById("adjustmentType");
  if (adjVal) adjVal.value = "";
  if (adjType) adjType.value = "+";
}

/**
 * فتح مودال الفاتورة لإضافة أو تعديل، مع دعم الاختيار المسبق للمتجر.
 * @param {number | null} targetStoreId - معرّف المتجر الذي يجب اختياره مسبقًا عند الإضافة.
 */

function openNewInvoiceModel(targetStoreId = null) {
  // إعادة تعيين النموذج فقط إذا كنا نضيف فاتورة جديدة
  if (!document.getElementById("invoiceForm").dataset.editingId) {
    resetForm();
  }

  invoiceFormOpen = true;

  closeFabMenu();

  mainFab.classList.add("hidden");

  // 2. 💡 استدعاء populateStoreSelect هنا
  populateStoreSelect(targetStoreId);

  // فتح المودال
  const modal = document.getElementById("newInvoiceModal");
  const overlay = document.getElementById("newInvoiceOverlay");
  modal.classList.remove("hidden");
  // activate overlay using the .active state so it sits below the bottom-sheet overlay
  overlay.classList.remove("hidden");
  overlay.classList.add("active");

  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("newInvoiceModal");
  const overlay = document.getElementById("newInvoiceOverlay");
  modal.classList.add("hidden");
  // deactivate overlay
  overlay.classList.remove("active");
  overlay.classList.add("hidden");

  invoiceFormOpen = false;

  mainFab.classList.remove("hidden");

  // إعادة تعيين النموذج بعد إغلاق المودال
  setTimeout(resetForm, 300); // تأخير قليل لضمان انتهاء الأنيميشن
  document.body.style.overflow = "";
}

// دالة التبديل بين حقول الشحن
function toggleShippingFields() {
  const deliveryType = document.getElementById("deliveryType").value;
  const shippingFields = document.getElementById("shippingFields");
  const localFields = document.getElementById("localFields");

  if (deliveryType === "shipping") {
    shippingFields.classList.remove("hidden");
    localFields.classList.add("hidden");
  } else if (deliveryType === "local") {
    shippingFields.classList.add("hidden");
    localFields.classList.remove("hidden");
  } else {
    shippingFields.classList.add("hidden");
    localFields.classList.add("hidden");
  }
}

// تبديل عرض حقل المبلغ المدفوع عند اختيار حالة الدفع
function togglePaymentFields() {
  const status = document.getElementById("paymentStatus")?.value;
  const paymentAmountEl = document.getElementById("paymentAmountPaid");
  if (!paymentAmountEl) return;
  if (status === "paid-partial") {
    paymentAmountEl.classList.remove("hidden");
  } else {
    paymentAmountEl.classList.add("hidden");
    // إذا كانت دُفع كامل، نضع القيمة مساوية للإجمالي (سيتم ضبطها عند الحفظ)
    if (status === "paid-full") {
      // leave empty here; during save we'll set paid = total
    } else {
      paymentAmountEl.value = "";
    }
  }
}

// 🟩 دالة تعديل الفاتورة
function editInvoice(id) {
  const allInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
  const invoice = allInvoices.find((inv) => inv.id === id);
  if (!invoice) return alert("⚠️ لم يتم العثور على الفاتورة");

  // تعبئة الحقول بالقيم الحالية
  document.getElementById("buyerName").value = invoice.customerName;
  document.getElementById("buyerPhone").value = invoice.phone;
  document.getElementById("buyerProvince").value = invoice.city;
  document.getElementById("deliveryType").value = invoice.shipping
    ? "shipping"
    : "local";

  // تعبئة حقول الشحن
  if (invoice.shipping) {
    // نعرض حقل شركة الشحن ومعلومات الشحن
    document.getElementById("shippingCompany").value =
      invoice.shippingCompany || "";
    document.getElementById("shippingInfo").value = invoice.shippingInfo || "";
  } else {
    document.getElementById("localShippingInfo").value =
      invoice.shippingInfo || "";
  }
  // تعبئة تاريخ التسليم إن وُجد
  if (invoice.shippingDate) {
    const deliveryDateEl = document.getElementById("deliveryDate");
    if (deliveryDateEl) deliveryDateEl.value = invoice.shippingDate;
  }

  // تحديث حقول الشحن المرئية
  toggleShippingFields();

  // تعبئة المنتجات في القائمة
  const selectedProductsList = document.getElementById("selectedProductsList");
  selectedProductsList.innerHTML = "";

  const productsArr = Array.isArray(invoice.products) ? invoice.products : [];

  productsArr.forEach((p, index) => {
    const isCustom = p.isCustom === true;
    const name = p.name || "";
    const qty = p.quantity || 1;
    const priceSYP = p.priceSYP || 0;
    const colorName = p.color?.name || "";
    const colorCode = p.color?.code || "";
    const customDescription = p.customDescription || "";

    const item = document.createElement("div");
    item.className = "selected-product";

    if (isCustom) {
      // Custom product in edit modal: no color, no "تسعير يدوي" label, editable description
      const tempProductId = `CUSTOM_${Date.now()}_${index}`;
      item.innerHTML = `
          <div class="selected-product-left" style="background:#fff3e0; padding:5px; border-radius:4px;">
            <span class="product-name" style="font-weight:bold; color:#d9534f;">${name}</span>
            <textarea class="custom-description-input" placeholder="وصف المنتج المخصص..." style="width:100%; margin-top:6px; min-height:48px;">${
              customDescription || ""
            }</textarea>
            <input type="hidden" class="is-custom-flag" value="true">
            <input type="hidden" class="temp-product-id" value="${tempProductId}">
            <input type="hidden" class="custom-description-text" value="${customDescription.replace(
              /"/g,
              "&quot;"
            )}">
            <input type="hidden" class="product-note-text" value="${(
              p.note || ""
            ).replace(/"/g, "&quot;")}">
          </div>
          <div class="selected-product-right">
            <div class="field-group">
              <label style="font-size:10px;">الكمية</label>
              <input type="number" class="product-qty-input" value="${qty}" min="1" oninput="updateInvoiceTotals()">
            </div>
            <div class="field-group">
              <label style="font-size:10px;">السعر (ل.س)</label>
              <input type="number" class="product-price-input" value="${priceSYP}" min="0" oninput="updateInvoiceTotals()">
            </div>
          </div>
          <button type="button" class="remove-product" 
              onclick="this.closest('.selected-product').remove(); updateInvoiceTotals();">
            <i class="fa fa-times"></i>
          </button>
        `;
      item.classList.add("custom-product-item");
    } else {
      // 🔧 🔧 🔧 التصحيح المهم: إضافة الحقول المخفية للون
      item.innerHTML = `
                <div class="selected-product-left">
                    <span class="product-name">${name}</span>
                    ${
                      colorCode
                        ? `
                        <span class="selected-color" 
                              title="${colorName}" 
                              style="background-color:${colorCode};display:inline-block;width:14px;height:14px;border-radius:3px;margin-inline-start:8px;vertical-align:middle">
                        </span>
                    `
                        : ""
                    }
                </div>
                <div class="selected-product-right">
                    <span class="product-qty">x${qty}</span>
                    <span class="product-price">${priceSYP.toLocaleString()} ل.س</span>
                </div>
                <button type="button" class="remove-product" 
                        onclick="this.closest('.selected-product').remove(); updateTotals();">
                    <i class="fa fa-times"></i>
                </button>
                <!-- 🔧 🔧 🔧 الحقول المخفية المفقودة -->
                <input type="hidden" class="is-custom-flag" value="false">
                <input type="hidden" class="product-qty-static" value="${qty}">
                <input type="hidden" class="product-price-static" value="${priceSYP}">
                <input type="hidden" class="product-color-name" value="${colorName}">
                <input type="hidden" class="product-color-code" value="${colorCode}">
                <input type="hidden" class="product-note-text" value="${(
                  p.note || ""
                ).replace(/"/g, "&quot;")}">
            `;
    }

    selectedProductsList.appendChild(item);
  });

  // تحديث الإجماليات
  const safeProducts = Array.isArray(invoice.products) ? invoice.products : [];
  const { totalSYP } = calculateTotals(safeProducts);

  // ✅ إصلاح: استخدام القيم الآمنة
  const safeTotalSYP = totalSYP || 0;

  document.getElementById("totalSYP").textContent =
    safeTotalSYP.toLocaleString();

  // تعبئة حالة الدفع والملاحظات إن وجدت
  const paymentStatusEl = document.getElementById("paymentStatus");
  const paymentAmountEl = document.getElementById("paymentAmountPaid");
  if (paymentStatusEl && invoice.payment) {
    paymentStatusEl.value = invoice.payment.status || "unpaid";
    if (invoice.payment.status === "paid-partial") {
      if (paymentAmountEl) {
        paymentAmountEl.value = invoice.payment.paidSYP || 0;
        paymentAmountEl.classList.remove("hidden");
      }
    } else if (invoice.payment.status === "paid-full") {
      if (paymentAmountEl) {
        paymentAmountEl.value = invoice.payment.paidSYP || safeTotalSYP || 0;
        paymentAmountEl.classList.add("hidden");
      }
    } else {
      if (paymentAmountEl) paymentAmountEl.classList.add("hidden");
    }
  }

  const notesEl = document.getElementById("invoiceNotes");
  if (notesEl) notesEl.value = invoice.notes || "";

  // 💡 الجديد: تعبئة قائمة المتجر يدوياً (للتأكد من الاختيار الصحيح عند الفتح)
  const storeSelectEl = document.getElementById("linkedStores");
  if (storeSelectEl) {
    // إذا كان هناك posId في الفاتورة، نقوم بتعيينه كقيمة للـ Select
    storeSelectEl.value = invoice.posId ? String(invoice.posId) : "";
  }

  // تخزين المعرف داخل الفورم
  document.getElementById("invoiceForm").dataset.editingId = id;

  // إظهار زر الحذف لأننا في وضع التعديل
  const delBtn = document.getElementById("deleteInvoiceBtn");
  if (delBtn) delBtn.classList.remove("hidden");

  // فتح المودال
  openNewInvoiceModel(invoice.posId || null);
}

// تحديث: استخدام حوار تأكيد مخصص بدلاً من confirm/alert الافتراضي
function showDeleteConfirm() {
  const form = document.getElementById("invoiceForm");
  const id = form && form.dataset.editingId;
  if (!id) {
    console.warn("لم يتم تحديد فاتورة للحذف.");
    return;
  }

  const overlay = document.getElementById("confirmOverlay");
  const modal = document.getElementById("confirmModal");
  const msg = document.getElementById("confirmModalMessage");
  if (msg)
    msg.textContent = `هل أنت متأكد من حذف الفاتورة رقم ${id}؟ هذا الإجراء لا يمكن التراجع عنه.`;

  if (overlay) {
    overlay.classList.remove("hidden");
    overlay.classList.add("active");
  }
  if (modal) {
    modal.classList.remove("hidden");
    modal.classList.add("active");
  }
}

function cancelDelete() {
  const overlay = document.getElementById("confirmOverlay");
  const modal = document.getElementById("confirmModal");
  if (overlay) {
    overlay.classList.remove("active");
    overlay.classList.add("hidden");
  }
  if (modal) {
    modal.classList.remove("active");
    modal.classList.add("hidden");
  }
}

function confirmDelete() {
  const form = document.getElementById("invoiceForm");
  const id = form && form.dataset.editingId;
  if (!id) {
    cancelDelete();
    return;
  }

  try {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const filtered = invoices.filter((inv) => inv.id !== Number(id));
    localStorage.setItem("invoices", JSON.stringify(filtered));

    // اغلاق نافذة التأكيد + المودال الرئيسي واعادة عرض القائمة
    cancelDelete();
    closeModal();
    renderInvoices();
    // لا نستخدم alert هنا — التصميم يعتمد على حوار أنيق
  } catch (e) {
    console.error("خطأ أثناء حذف الفاتورة:", e);
    cancelDelete();
  }
}

// 🟨 دالة الحفظ (إضافة أو تعديل)
// 🟨 دالة الحفظ (إضافة أو تعديل) - تم تحديثها لـ: (1) حل خطأ toLocaleString، (2) حساب الدولار بشكل صحيح.
function saveInvoice() {
  try {
    const form = document.getElementById("invoiceForm");
    const buyerName = document.getElementById("buyerName").value;
    const buyerPhone = document.getElementById("buyerPhone").value;
    const buyerProvince = document.getElementById("buyerProvince").value;
    const deliveryType = document.getElementById("deliveryType").value;

    // 💡 التعديل #1: قراءة ID المتجر المختار من الـ Select
    const linkedStoresSelect = document.getElementById("linkedStores");
    let posId = null; // القيمة الافتراضية تكون null (بدون متجر)
    // إذا تم اختيار قيمة (وهي store ID)، نحولها لرقم
    if (linkedStoresSelect && linkedStoresSelect.value !== "") {
      posId = parseInt(linkedStoresSelect.value);
    }

    // معلومات الشحن: شركة الشحن + معلومات الشحن
    let shippingCompany = "";
    let shippingInfo = "";
    let shippingDate = "";
    if (deliveryType === "shipping") {
      shippingCompany = document.getElementById("shippingCompany").value;
      shippingInfo = document.getElementById("shippingInfo").value;
    } else if (deliveryType === "local") {
      shippingInfo = document.getElementById("localShippingInfo").value;
    }
    // قراءة تاريخ التسليم إن وُجد
    const deliveryDateEl = document.getElementById("deliveryDate");
    if (deliveryDateEl) shippingDate = deliveryDateEl.value;

    // جلب المنتجات المختارة
    const selectedProductsList = document.getElementById(
      "selectedProductsList"
    );
    const selectedProducts = Array.from(selectedProductsList.children).map(
      (item) => {
        // 🛑 التعديل: تحديد ما إذا كان المنتج قياسياً أم مخصصاً 🛑
        const isCustom =
          item.querySelector(".is-custom-flag")?.value === "true";

        // قراءة الاسم المشترك بين الحالتين
        const name =
          item.querySelector(".product-name")?.textContent || "منتج غير معروف";

        if (isCustom) {
          // --- قراءة المنتج المخصص (Active Inputs) ---
          const qtyInput = item.querySelector(".product-qty-input");
          const priceInput = item.querySelector(".product-price-input");

          const quantity = parseInt(qtyInput?.value) || 1;
          const priceSYP = parseFloat(priceInput?.value) || 0;

          // description may be in textarea (editable) or hidden field
          const customDesc =
            item.querySelector(".custom-description-input")?.value ||
            item.querySelector(".custom-description-text")?.value ||
            "";
          // read optional color info stored on the element
          const colorNameEl = item.querySelector(".product-color-name");
          const colorCodeEl = item.querySelector(".product-color-code");
          const colorName = colorNameEl?.value || "مخصص";
          const colorCode = colorCodeEl?.value || "#ffffff";

          const note = item.querySelector(".product-note-text")?.value || "";
          return {
            name: name,
            quantity: quantity,
            priceSYP: priceSYP,
            isCustom: true, // ضروري للحفظ
            color: { name: colorName, code: colorCode },
            customDescription: customDesc,
            note: note,
          };
        } else {
          // --- قراءة المنتج القياسي (Static Hidden Inputs) ---

          const qtyEl = item.querySelector(".product-qty-static");
          const priceEl = item.querySelector(".product-price-static");
          const colorNameEl = item.querySelector(".product-color-name");
          const colorCodeEl = item.querySelector(".product-color-code");

          const quantity = parseInt(qtyEl?.value) || 1;
          const priceSYP = parseFloat(priceEl?.value) || 0;

          const colorName = colorNameEl?.value || "";
          const colorCode = colorCodeEl?.value || "";

          // إذا لم يكن هناك لون محدد، نستخدم القيمة الافتراضية
          if (!colorName || colorName === "undefined") {
            colorName = "بدون لون";
          }
          if (
            !colorCode ||
            colorCode === "undefined" ||
            colorCode === "transparent"
          ) {
            colorCode = "#CCCCCC"; // رمادي فاتح كقيمة افتراضية
          }

          // 🔧 تسجيل تحذير إذا كان اللون مفقوداً
          if (!colorNameEl || !colorCodeEl) {
            console.warn("⚠️ منتج بدون حقول لون مخفية:", {
              name: name,
              quantity: quantity,
              priceSYP: priceSYP,
              element: item,
            });
          }

          const note = item.querySelector(".product-note-text")?.value || "";
          return {
            name: name,
            quantity: quantity,
            priceSYP: priceSYP,
            isCustom: false, // ضروري للحفظ
            color: { name: colorName, code: colorCode },
            note: note,
          };
        }
      }
    );

    // التحقق من صحة البيانات
    if (!buyerName || !buyerPhone || !buyerProvince || !deliveryType) {
      showToast("⚠️ يرجى ملء جميع الحقول المطلوبة", 3000, "orange");
      return;
    }

    if (deliveryType === "shipping" && (!shippingCompany || !shippingInfo)) {
      showToast("⚠️ يرجى ملء شركة الشحن ومعلومات الشحن", 3000, "orange");
      return;
    }

    if (deliveryType === "local" && !shippingInfo) {
      showToast("⚠️ يرجى إدخال الموقع", 3000, "orange");
      return;
    }

    if (selectedProducts.length === 0) {
      showToast("⚠️ يرجى إضافة منتج واحد على الأقل", 3000, "orange");
      return;
    }

    // 🛑 التعديل: التحقق من أن المدير قام بتسعير المنتجات المخصصة
    const hasZeroPriceCustomItem = selectedProducts.some(
      (p) => p.isCustom && p.priceSYP === 0
    );
    if (hasZeroPriceCustomItem) {
      showToast(
        "⚠️ يرجى تسعير جميع المنتجات المخصصة (قيمتها 0) قبل الحفظ.",
        4000,
        "red"
      );
      return;
    }

    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

    // حساب الإجمالي من المنتجات المختارة
    const { totalSYP } = calculateTotals(selectedProducts);

    // استخدام القيم الآمنة (مع أنها أصبحت آمنة بالفعل في calculateTotals)
    const safeTotalSYP = totalSYP || 0;

    // قراءة إعدادات التعديل (إن وُجدت) وتطبيقها على الإجمالي
    const adjValGlobal = document.getElementById("adjustmentValue")?.value;
    const adjTypeGlobal = document.getElementById("adjustmentType")?.value;
    const adjustedGlobal = applyAdjustment(
      safeTotalSYP,
      adjTypeGlobal,
      adjValGlobal
    );

    if (form.dataset.editingId) {
      // تعديل فاتورة
      const id = parseInt(form.dataset.editingId);
      const index = invoices.findIndex((inv) => inv.id === id);
      if (index !== -1) {
        // قراءة حالة الدفع والملاحظات
        const paymentStatus = document.getElementById("paymentStatus")
          ? document.getElementById("paymentStatus").value
          : "unpaid";
        const paymentAmountVal = document.getElementById("paymentAmountPaid")
          ? parseInt(document.getElementById("paymentAmountPaid").value || "0")
          : 0;
        let paidSYP = 0;
        if (paymentStatus === "paid-full") paidSYP = adjustedGlobal;
        else if (paymentStatus === "paid-partial")
          paidSYP = isNaN(paymentAmountVal) ? 0 : paymentAmountVal;
        const paymentObj = {
          status: paymentStatus,
          paidSYP: paidSYP,
          remainingSYP: Math.max(0, adjustedGlobal - paidSYP),
        };
        const notes =
          (document.getElementById("invoiceNotes")
            ? document.getElementById("invoiceNotes").value.trim()
            : "") || "";

        invoices[index] = {
          ...invoices[index],
          customerName: buyerName,
          phone: buyerPhone,
          city: buyerProvince,
          shipping: deliveryType === "shipping",
          shippingCompany,
          shippingInfo,
          shippingDate,
          products: selectedProducts,
          totalOriginalSYP: safeTotalSYP,
          totalSYP: adjustedGlobal,
          adjustment:
            adjValGlobal && adjTypeGlobal
              ? { type: adjTypeGlobal, value: parseFloat(adjValGlobal) }
              : null,
          payment: paymentObj,
          notes,
          posId: posId,
          // لا نغيّر الطابع الزمني الأصلي عند التعديل إن وُجد، وإلا ندرجه
          timestamp: invoices[index].timestamp || Date.now(),
        };
        // Keep this invoice open/visible after re-render
        try {
          window.__keepOpenInvoiceId = id;
        } catch (err) {
          console.warn("Could not set keep-open marker:", err && err.message);
        }
      }
    } else {
      // إضافة فاتورة جديدة
      // قراءة حالة الدفع والملاحظات
      const paymentStatusNew = document.getElementById("paymentStatus")
        ? document.getElementById("paymentStatus").value
        : "unpaid";
      const paymentAmountValNew = document.getElementById("paymentAmountPaid")
        ? parseInt(document.getElementById("paymentAmountPaid").value || "0")
        : 0;
      let paidSYPNew = 0;
      if (paymentStatusNew === "paid-full") paidSYPNew = adjustedGlobal;
      else if (paymentStatusNew === "paid-partial")
        paidSYPNew = isNaN(paymentAmountValNew) ? 0 : paymentAmountValNew;
      const paymentObjNew = {
        status: paymentStatusNew,
        paidSYP: paidSYPNew,
        remainingSYP: Math.max(0, adjustedGlobal - paidSYPNew),
      };
      const notesNew =
        (document.getElementById("invoiceNotes")
          ? document.getElementById("invoiceNotes").value.trim()
          : "") || "";
      const newInvoice = {
        id: Date.now(),
        date: new Date().toLocaleDateString("ar-SY"),
        customerName: buyerName,
        phone: buyerPhone,
        city: buyerProvince,
        shipping: deliveryType === "shipping",
        shippingCompany,
        shippingInfo,
        shippingDate,
        products: selectedProducts,
        totalOriginalSYP: safeTotalSYP,
        totalSYP: adjustedGlobal,
        adjustment:
          adjValGlobal && adjTypeGlobal
            ? { type: adjTypeGlobal, value: parseFloat(adjValGlobal) }
            : null,
        payment: paymentObjNew,
        notes: notesNew,
        posId: posId,
        // canonical timestamp for reliable sorting/filtering
        timestamp: Date.now(),
      };

      invoices.push(newInvoice);
    }

    delete form.dataset.editingId;

    localStorage.setItem("invoices", JSON.stringify(invoices));
    closeModal();
    form.reset();
    renderInvoices();
  } catch (e) {
    console.error(e);
    alert("حدث خطأ أثناء الحفظ: " + (e && e.message ? e.message : e));
  }
}

// Ensure we call renderInvoices without passing the DOMContentLoaded event as the filter
window.addEventListener("DOMContentLoaded", function () {
  // Ensure older invoices get a canonical numeric timestamp for reliable date handling
  if (typeof migrateInvoicesTimestamps === "function") {
    try {
      migrateInvoicesTimestamps();
    } catch (e) {
      console.warn("migrateInvoicesTimestamps failed:", e);
    }
  }
  renderInvoices();
});

function openAddProductSheet() {
  document.getElementById("addProductSheet").classList.add("active");
  const sheetOverlay = document.getElementById("productSheetOverlay");
  // ensure overlay is visible (remove hidden) then activate it so it captures clicks above the invoice overlay
  if (sheetOverlay) {
    sheetOverlay.classList.remove("hidden");
    sheetOverlay.classList.add("active");
  }

  // إعادة تعيين حقل البحث
  const productInput = document.getElementById("productInput");
  productInput.value = "";

  // عرض كل المنتجات عند فتح الشيت
  renderProductsList();
}

function closeAddProductSheet() {
  document.getElementById("addProductSheet").classList.remove("active");
  const sheetOverlay = document.getElementById("productSheetOverlay");
  if (sheetOverlay) {
    sheetOverlay.classList.remove("active");
    sheetOverlay.classList.add("hidden");
  }
  document.getElementById("productDropdown").classList.add("hidden");

  // Defensive: ensure quantity input is visible again and custom UI removed
  const prodQtyEl = document.getElementById("productQuantity");
  if (prodQtyEl) {
    prodQtyEl.classList.remove("hidden");
    if (prodQtyEl.parentElement)
      prodQtyEl.parentElement.classList.remove("hidden");
  }
  const customUI = document.querySelector(".custom-product-inputs");
  if (customUI) customUI.remove();
}

// عرض قائمة المنتجات
function renderProductsList(searchQuery = "") {
  const dropdown = document.getElementById("productDropdown");
  dropdown.classList.remove("hidden");

  const useStorePrices = document.getElementById("useStorePrices")?.checked;

  // فلترة المنتجات حسب البحث
  const filteredProducts = finalBaseProducts.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.shortDisc &&
        product.shortDisc.toLowerCase().includes(searchLower)) ||
      product.price.toString().includes(searchLower)
    );
  });

  // إنشاء HTML للمنتجات
  const productsHTML = filteredProducts
    .map((product) => {
      // 🔧 التصحيح: التعامل مع ID كنص
      let onclickCode;

      if (typeof product.id === "string" && product.id.includes("CUSTOM")) {
        // للمنتج المخصص: استخدام الاسم مع علامات اقتباس
        onclickCode = `selectProduct('${product.id}')`;
      } else {
        // للمنتج القياسي: تمرير الرقم
        onclickCode = `selectProduct(${product.id})`;
      }

      // 🔧 إضافة عرض خاص للمنتج المخصص
      const isCustom = product.isCustomOrder || product.id === "CUSTOM_ORDER";

      const priceToShow =
        useStorePrices && typeof product.storePrice === "number"
          ? product.storePrice
          : product.price;

      return `
    <div class="dropdown-item" onclick="${onclickCode}">
      <img src="${product.images[0] || "assets/imgs/placeholder.jpg"}" alt="${
        product.name
      }">
      <div class="product-info">
        <span class="product-name">${product.name}</span>
          <span class="product-price">
            ${isCustom ? "يحدد لاحقاً" : priceToShow.toLocaleString() + " ل.س"}
          </span>
        ${
          product.shortDisc
            ? `<span class="product-desc">${product.shortDisc}</span>`
            : ""
        }
      </div>
      ${
        isCustom
          ? `
        <div class="custom-product-badge">
          🛠️ مخصص
        </div>
      `
          : `
        <div class="color-dots">
          ${product.colors
            ?.slice(0, 5)
            .map(
              (color) => `
            <span class="color-dot" 
                  style="background-color: ${color.code}" 
                  title="${color.name}">
            </span>
          `
            )
            .join("")}
          ${
            product.colors?.length > 5
              ? `
            <span class="color-dot more-colors" title="المزيد من الألوان">
              +${product.colors.length - 5}
            </span>
          `
              : ""
          }
        </div>
      `
      }
    </div>
  `;
    })
    .join("");

  dropdown.innerHTML =
    productsHTML || '<div class="no-results">لا توجد نتائج</div>';
}

// معالجة البحث في المنتجات
function handleProductSearch(event) {
  const searchQuery = event.target.value;
  renderProductsList(searchQuery);
}

// اختيار منتج
function selectProduct(productId) {
  // 🔧 إصلاح: التعامل مع ID كنص أو رقم
  const product = finalBaseProducts.find(
    (p) => p.id === productId || p.id.toString() === productId.toString()
  );

  if (!product) return;

  // إخفاء قائمة المنتجات وإظهار اختيار اللون
  document.getElementById("productDropdown").classList.add("hidden");
  document.getElementById("productInput").value = product.name;

  // 🔧 تحسين: تحديد ما إذا كان منتج مخصص
  const isCustom = product.isCustomOrder || product.id === "CUSTOM_ORDER";

  // 🔧 NEW: إذا كان منتج مخصص، لا نعرض الألوان
  if (isCustom) {
    // إزالة قائمة اختيار الألوان إن وجدت
    const colorSelector = document.querySelector(".color-selector");
    if (colorSelector) colorSelector.remove();

    // إضافة واجهة خاصة للمنتج المخصص
    const customProductUI = document.createElement("div");
    customProductUI.className = "custom-product-inputs";
    customProductUI.innerHTML = `
      <h4>إدخال تفاصيل المنتج المخصص</h4>
      <div class="custom-form">
        <div class="form-group">
          <label>اسم المنتج المخصص:</label>
          <input type="text" id="customProductName" placeholder="اسم المنتج (مثال: حامل هاتف)">
        </div>
        <div class="form-group">
          <label>الوصف المخصص:</label>
          <textarea id="customDescriptionInput" placeholder="أدخل وصف المنتج المخصص..." rows="3"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>اسم اللون (اختياري):</label>
            <input type="text" id="customProductColorName" placeholder="أحمر، أسود...">
          </div>
          <div class="form-group">
            <label>رمز اللون:</label>
            <input type="color" id="customProductColorCode" value="#ffffff">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>الكمية:</label>
            <input type="number" id="customProductQty" value="1" min="1">
          </div>
          <div class="form-group">
            <label>السعر المبدئي (ل.س):</label>
            <input type="number" id="customProductPrice" value="0" min="0">
          </div>
        </div>
      </div>
    `;

    const bottomSheetContent = document.querySelector(".bottom-sheet-content");
    const existingCustomUI = bottomSheetContent.querySelector(
      ".custom-product-inputs"
    );
    const existingColorSelector =
      bottomSheetContent.querySelector(".color-selector");

    if (existingCustomUI) existingCustomUI.remove();
    if (existingColorSelector) existingColorSelector.remove();

    // 🔧 التصحيح: إدراج في المكان الصحيح
    const productQuantityContainer =
      document.getElementById("productQuantity").parentElement;
    productQuantityContainer.insertBefore(
      customProductUI,
      document.getElementById("productQuantity")
    );

    // إخفاء حقل الكمية القياسي للمنتج المخصص
    document.getElementById("productQuantity").classList.add("hidden");

    return; // نخرج لأن المنتج المخصص لا يحتاج لاختيار لون
  }

  // إنشاء قائمة اختيار اللون
  const colorSelector = document.createElement("div");
  colorSelector.className = "color-selector";
  colorSelector.innerHTML = `
    <h4>اختر اللون المناسب:</h4>
    <div class="color-grid">
      ${product.colors
        .map(
          (color) => `
        <div class="color-option" 
             onclick="selectColor(${productId}, '${color.name}', '${color.code}')"
             style="background-color: ${color.code}"
             title="${color.name}">
        </div>
      `
        )
        .join("")}
    </div>
  `;

  const bottomSheetContent = document.querySelector(".bottom-sheet-content");
  const existingSelector = bottomSheetContent.querySelector(".color-selector");
  if (existingSelector) {
    existingSelector.remove();
  }
  document
    .getElementById("productQuantity")
    .parentElement.insertBefore(
      colorSelector,
      document.getElementById("productQuantity")
    );

  // Add optional note field (placeholder only) for this product selection
  const existingNote = bottomSheetContent.querySelector(
    ".product-note-wrapper"
  );
  if (existingNote) existingNote.remove();
  const noteWrapper = document.createElement("div");
  noteWrapper.className = "product-note-wrapper";
  noteWrapper.innerHTML = `<textarea id="productNoteInput" placeholder="ملاحظة (اختياري)" rows="2" style="width:100%; box-sizing:border-box; margin-top:8px; resize:vertical;"></textarea>`;
  document
    .getElementById("productQuantity")
    .parentElement.insertBefore(
      noteWrapper,
      document.getElementById("productQuantity")
    );
}

// اختيار اللون
function selectColor(productId, colorName, colorCode) {
  const product = finalBaseProducts.find((p) => p.id === productId);
  if (!product) return;

  // تخزين اللون المحدد
  document.getElementById("productInput").dataset.selectedColor =
    JSON.stringify({
      name: colorName,
      code: colorCode,
    });

  // تحديث المظهر المرئي
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((opt) => {
    opt.classList.remove("selected");
    opt.style.borderColor = "";
  });

  // نحاول أن نجد العنصر المطابق ثم نضع له ستايل بوردر مطابق للون المختار
  const selectedOption = Array.from(colorOptions).find((opt) => {
    // القيم قد تكون بصيغ مختلفة (rgb/hex) لذلك نطابق الجزء الأخير من الكود إن أمكن
    const bg = (opt.style.backgroundColor || "").toLowerCase();
    const cc = colorCode.toLowerCase();
    return (
      bg === cc ||
      bg.includes(cc.replace("#", "")) ||
      cc.includes(bg.replace(/\s/g, ""))
    );
  });
  if (selectedOption) {
    selectedOption.classList.add("selected");
    // ضبط لون البوردر ليطابق اللون المختار (يوضح للمستخدم الاختيار)
    selectedOption.style.borderColor = colorCode;
  }

  // التركيز على حقل الكمية
  document.getElementById("productQuantity").value = "1";
  document.getElementById("productQuantity").focus();
}

// إضافة المنتج للفاتورة
function confirmAddProduct() {
  const productInput = document.getElementById("productInput");
  const productName = productInput.value;

  if (!productName) {
    showToast("⚠️ يرجى اختيار منتج", 3000, "orange");
    return;
  }

  const product = finalBaseProducts.find((p) => p.name === productName);
  if (!product) {
    alert("⚠️ المنتج غير موجود");
    return;
  }

  const isCustom = product.isCustomOrder || product.id === "CUSTOM_ORDER";

  // 🔧 NEW: معالجة المنتج المخصص بشكل مختلف
  if (isCustom) {
    const customNameInput = document.getElementById("customProductName");
    const descriptionInput = document.getElementById("customDescriptionInput");
    const customQtyInput = document.getElementById("customProductQty");
    const customPriceInput = document.getElementById("customProductPrice");

    if (
      !customNameInput ||
      !descriptionInput ||
      !customQtyInput ||
      !customPriceInput
    ) {
      showToast("⚠️ يرجى إدخال تفاصيل المنتج المخصص", 3000, "orange");
      return;
    }

    const customName = customNameInput.value.trim();
    const customDescription = descriptionInput.value.trim();
    const customColorNameInput = document.getElementById(
      "customProductColorName"
    );
    const customColorCodeInput = document.getElementById(
      "customProductColorCode"
    );
    const quantity = parseInt(customQtyInput.value) || 1;
    const priceSYP = parseFloat(customPriceInput.value) || 0;
    // optional note (from bottom-sheet)
    const noteInput = document.getElementById("productNoteInput");
    const productNote = noteInput ? noteInput.value.trim() : "";

    if (!customName) {
      showToast("⚠️ يرجى إدخال اسم للمنتج المخصص", 3000, "orange");
      return;
    }

    // إضافة المنتج المخصص لقائمة المنتجات المحددة
    const selectedProductsList = document.getElementById(
      "selectedProductsList"
    );
    const productElement = document.createElement("div");
    productElement.className = "selected-product custom-product-item";
    const customColorName =
      (customColorNameInput && customColorNameInput.value.trim()) || "مخصص";
    const customColorCode =
      (customColorCodeInput && customColorCodeInput.value) || "#ffffff";

    productElement.innerHTML = `
      <div class="product-info">
        <span class="product-name">${customName}</span>
        <div class="selected-color" style="background-color: ${customColorCode};" title="${customColorName}"></div>
        <div class="custom-badge">🛠️ مخصص</div>
      </div>
      <div class="custom-product-fields">
        <div class="field-group">
          <label>الكمية:</label>
          <input type="number" class="product-qty-input" value="${quantity}" min="1" 
                 oninput="updateInvoiceTotals()">
        </div>
        <div class="field-group">
          <label>السعر (ل.س):</label>
          <input type="number" class="product-price-input" value="${priceSYP}" min="0" 
                 oninput="updateInvoiceTotals()">
        </div>
      </div>
      <div class="custom-description">
        <strong>الوصف:</strong> ${customDescription}
      </div>
      <button type="button" class="remove-product" 
              onclick="this.closest('.selected-product').remove(); updateInvoiceTotals();">
        <i class="fa fa-times"></i>
      </button>
      <input type="hidden" class="is-custom-flag" value="true">
      <input type="hidden" class="custom-description-text" value="${customDescription.replace(
        /"/g,
        "&quot;"
      )}">
      <input type="hidden" class="custom-product-name-hidden" value="${customName.replace(
        /"/g,
        "&quot;"
      )}">
      <input type="hidden" class="product-color-name" value="${customColorName.replace(
        /"/g,
        "&quot;"
      )}">
      <input type="hidden" class="product-color-code" value="${customColorCode}">
    `;
    selectedProductsList.appendChild(productElement);
  } else {
    // المنتج القياسي (الكود الحالي مع تعديلات طفيفة)
    const selectedColorData = productInput.dataset.selectedColor;
    const quantity =
      parseInt(document.getElementById("productQuantity").value) || 1;

    if (!selectedColorData) {
      showToast("⚠️ يرجى اختيار لون للمنتج", 3000, "orange");
      return;
    }

    const selectedColor = JSON.parse(selectedColorData);

    // Determine which price to use (store price when checkbox checked)
    const useStorePrices = document.getElementById("useStorePrices")?.checked;
    const priceToUse =
      useStorePrices && typeof product.storePrice === "number"
        ? product.storePrice
        : product.price;

    // إضافة المنتج للقائمة المنتجات المحددة
    const selectedProductsList = document.getElementById(
      "selectedProductsList"
    );
    const productElement = document.createElement("div");
    productElement.className = "selected-product";
    // read optional note from bottom-sheet
    const noteInput = document.getElementById("productNoteInput");
    const productNote = noteInput ? noteInput.value.trim() : "";

    productElement.innerHTML = `
      <div class="product-info">
        <span class="product-name">${product.name}</span>
        <span class="product-qty">x${quantity}</span>
        <span class="product-price">${priceToUse.toLocaleString()} ل.س</span>
        <div class="selected-color" style="background-color: ${
          selectedColor.code
        }" 
             title="${selectedColor.name}"></div>
      </div>
      <button type="button" class="remove-product" 
              onclick="this.closest('.selected-product').remove(); updateTotals();">
        <i class="fa fa-times"></i>
      </button>
      <input type="hidden" class="is-custom-flag" value="false">
      <input type="hidden" class="product-qty-static" value="${quantity}">
      <input type="hidden" class="product-price-static" value="${priceToUse}">
      <input type="hidden" class="product-color-name" value="${
        selectedColor.name
      }">
      <input type="hidden" class="product-color-code" value="${
        selectedColor.code
      }">
      <input type="hidden" class="product-note-text" value="${productNote.replace(
        /"/g,
        "&quot;"
      )}">
      `;
    selectedProductsList.appendChild(productElement);
  }

  // تحديث الإجماليات
  if (product.isCustomOrder) {
    updateInvoiceTotals(); // لدالة جديدة للمنتجات المخصصة
  } else {
    updateTotals();
  }

  // إغلاق وإعادة تعيين الحقول
  closeAddProductSheet();
  const addSheet = document.getElementById("addProductSheet");
  const overlay = document.getElementById("productSheetOverlay");
  const dropdown = document.getElementById("productDropdown");

  if (addSheet) addSheet.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
  if (dropdown) dropdown.classList.add("hidden");

  productInput.value = "";
  delete productInput.dataset.selectedColor;

  // تأكد من إعادة قيمة حقل الكمية وإظهاره (قد تم إخفاؤه عند اختيار منتج مخصص)
  const prodQtyEl = document.getElementById("productQuantity");
  if (prodQtyEl) {
    prodQtyEl.value = "";
    prodQtyEl.classList.remove("hidden");
    if (prodQtyEl.parentElement)
      prodQtyEl.parentElement.classList.remove("hidden");
  }

  // تنظيف الواجهة
  const colorSelector = document.querySelector(".color-selector");
  const customUI = document.querySelector(".custom-product-inputs");
  if (colorSelector) colorSelector.remove();
  if (customUI) customUI.remove();
}

// تحديث إجماليات الفاتورة
function updateTotals() {
  const selectedProducts = Array.from(
    document.getElementById("selectedProductsList").children
  ).map((item) => {
    // If this item is a custom product it uses different DOM structure
    const isCustom = item.querySelector(".is-custom-flag")?.value === "true";

    if (isCustom) {
      const name = item.querySelector(".product-name")?.textContent || "مخصص";
      const qtyInput = item.querySelector(".product-qty-input");
      const priceInput = item.querySelector(".product-price-input");
      const quantity = parseInt(qtyInput?.value) || 1;
      const priceSYP = parseFloat(priceInput?.value) || 0;
      return {
        name,
        quantity,
        color: { name: "مخصص", code: "" },
        priceSYP,
      };
    }

    // Standard product path (safe access)
    const nameEl = item.querySelector(".product-name");
    const qtyEl = item.querySelector(".product-qty");
    const colorEl = item.querySelector(".selected-color");

    const name = nameEl?.textContent || "";
    const quantity = parseInt(qtyEl?.textContent.replace("x", "") || "") || 1;
    const colorName = colorEl?.title || "";
    const colorCode = colorEl?.style?.backgroundColor || "";

    // البحث عن السعر: نحبذ السعر المخزن في الحقل المخفي (product-price-static)
    const priceStaticEl = item.querySelector(".product-price-static");
    const priceFromHidden = parseFloat(priceStaticEl?.value);
    const product = finalBaseProducts.find((p) => p.name === name);
    const fallbackPrice = product ? product.price : 0;
    const priceSYP = Number.isFinite(priceFromHidden)
      ? priceFromHidden
      : fallbackPrice;
    return {
      name,
      quantity,
      color: { name: colorName, code: colorCode },
      priceSYP,
    };
  });

  const { totalSYP } = calculateTotals(selectedProducts);

  // ✅ إصلاح: استخدام القيم الآمنة
  const safeTotalSYP = totalSYP || 0;

  // تحقق من وجود تعديل (خصم/زيادة)
  const adjVal = document.getElementById("adjustmentValue")?.value;
  const adjType = document.getElementById("adjustmentType")?.value;
  const adjusted = applyAdjustment(safeTotalSYP, adjType, adjVal);

  // عرض الإجماليات في المودال
  const totalEl = document.getElementById("totalSYP");
  const origRow = document.getElementById("originalTotalRow");
  const adjRow = document.getElementById("adjustedTotalRow");
  const origEl = document.getElementById("originalTotalSYP");
  const adjEl = document.getElementById("adjustedTotalSYP");

  if (adjVal && !isNaN(parseFloat(adjVal)) && adjType) {
    // حين يوجد تعديل: أظهر الأصلي والمعدّل
    if (origRow) origRow.classList.remove("hidden");
    if (adjRow) adjRow.classList.remove("hidden");
    if (origEl) origEl.textContent = safeTotalSYP.toLocaleString();
    if (adjEl) adjEl.textContent = adjusted.toLocaleString();
    if (totalEl) totalEl.textContent = adjusted.toLocaleString();
  } else {
    // لا تعديل: إظهار الإجمالي فقط
    if (origRow) origRow.classList.add("hidden");
    if (adjRow) adjRow.classList.add("hidden");
    if (totalEl) totalEl.textContent = safeTotalSYP.toLocaleString();
  }
}

// 🔧 NEW: دالة جديدة لحساب إجمالي المنتجات المخصصة والقياسية
function updateInvoiceTotals() {
  const selectedProductsList = document.getElementById("selectedProductsList");
  const products = Array.from(selectedProductsList.children);

  let totalSYP = 0;

  products.forEach((item) => {
    const isCustom = item.querySelector(".is-custom-flag")?.value === "true";

    if (isCustom) {
      // منتج مخصص: قراءة من حقول الإدخال
      const qtyInput = item.querySelector(".product-qty-input");
      const priceInput = item.querySelector(".product-price-input");
      const qty = parseInt(qtyInput?.value) || 0;
      const price = parseFloat(priceInput?.value) || 0;
      totalSYP += qty * price;
    } else {
      // منتج قياسي: قراءة من الحقول المخفية
      const qtyStatic = item.querySelector(".product-qty-static");
      const priceStatic = item.querySelector(".product-price-static");
      const qty = parseInt(qtyStatic?.value) || 0;
      const price = parseFloat(priceStatic?.value) || 0;
      totalSYP += qty * price;
    }
  });
  // بعد حساب الإجمالي الأصلي، تحقق من وجود تعديل
  const adjVal = document.getElementById("adjustmentValue")?.value;
  const adjType = document.getElementById("adjustmentType")?.value;
  const adjusted = applyAdjustment(totalSYP, adjType, adjVal);

  const totalEl = document.getElementById("totalSYP");
  const origRow = document.getElementById("originalTotalRow");
  const adjRow = document.getElementById("adjustedTotalRow");
  const origEl = document.getElementById("originalTotalSYP");
  const adjEl = document.getElementById("adjustedTotalSYP");

  if (adjVal && !isNaN(parseFloat(adjVal)) && adjType) {
    if (origRow) origRow.classList.remove("hidden");
    if (adjRow) adjRow.classList.remove("hidden");
    if (origEl) origEl.textContent = totalSYP.toLocaleString();
    if (adjEl) adjEl.textContent = adjusted.toLocaleString();
    if (totalEl) totalEl.textContent = adjusted.toLocaleString();
  } else {
    if (origRow) origRow.classList.add("hidden");
    if (adjRow) adjRow.classList.add("hidden");
    if (totalEl) totalEl.textContent = totalSYP.toLocaleString();
  }
}

// معالجة البحث عند الكتابة
document.addEventListener("DOMContentLoaded", function () {
  const productInput = document.getElementById("productInput");
  productInput.removeAttribute("readonly"); // جعل الحقل قابل للكتابة
  productInput.addEventListener("input", handleProductSearch);
  productInput.addEventListener("focus", () =>
    renderProductsList(productInput.value)
  );
  // استمع لتغييرات حقل/نوع التعديل لنعيد حساب الإجمالي فوراً
  const adjValEl = document.getElementById("adjustmentValue");
  const adjTypeEl = document.getElementById("adjustmentType");
  if (adjValEl) adjValEl.addEventListener("input", () => updateInvoiceTotals());
  if (adjTypeEl)
    adjTypeEl.addEventListener("change", () => updateInvoiceTotals());
});

function fillFormWithInvoice(invoice, allInvoices = []) {
  if (!invoice || typeof invoice !== "object") {
    console.error("fillFormWithInvoice: invoice is invalid", invoice);
    return;
  }

  const form = document.getElementById("invoiceForm");
  if (!form) {
    console.warn("لا يوجد عنصر form بالمعرف invoiceForm");
    return;
  }

  // ----------------------------------------------------
  // الحقول الأساسية
  // ----------------------------------------------------
  const buyerNameEl = document.getElementById("buyerName");
  const buyerPhoneEl = document.getElementById("buyerPhone");
  const buyerProvinceEl = document.getElementById("buyerProvince");
  const deliveryTypeEl = document.getElementById("deliveryType");

  // تعبئة الحقول الأساسية مع القيم الآمنة
  if (buyerNameEl)
    buyerNameEl.value = invoice.customerName || invoice.buyerName || "";
  if (buyerPhoneEl)
    buyerPhoneEl.value = invoice.phone || invoice.buyerPhone || "";
  if (buyerProvinceEl)
    buyerProvinceEl.value = invoice.city || invoice.buyerProvince || "";

  // طريقة التسليم (select) - نستخدم قيمة الفاتورة لتحديد 'shipping'/'local'
  let deliveryVal = "";
  // الفاتورة القادمة من السلة تخزن 'shipping' كـ boolean (true/false)
  if (invoice.shipping === true || invoice.shipping === "shipping") {
    deliveryVal = "shipping";
  } else if (
    invoice.shipping === false ||
    invoice.shipping === "local" ||
    invoice.shipping === "within-homs"
  ) {
    deliveryVal = "local";
  }

  if (deliveryTypeEl) {
    deliveryTypeEl.value = deliveryVal || "local"; // الافتراضي هو 'local'
    deliveryTypeEl.dispatchEvent(new Event("change"));
    // يجب أن تكون هذه الدالة موجودة لتعرض حقول الشحن أو تخفيها
    if (typeof toggleShippingFields === "function") {
      toggleShippingFields();
    }
  }

  // ----------------------------------------------------
  // ملء حقول الشحن والتسليم
  // ----------------------------------------------------
  const shippingCompanyEl = document.getElementById("shippingCompany");
  const shippingInfoEl = document.getElementById("shippingInfo");
  const localInfoEl = document.getElementById("localShippingInfo");
  const shippingDateEl =
    document.getElementById("shippingDate") ||
    document.getElementById("deliveryDate");

  // ملء حقول الشحن بالتفاصيل، حسب ما تم اختياره
  if (shippingCompanyEl)
    shippingCompanyEl.value = invoice.shippingCompany || "";

  // ملء حقل معلومات الشحن/الموقع
  if (invoice.shipping) {
    if (shippingInfoEl) shippingInfoEl.value = invoice.shippingInfo || "";
  } else {
    if (localInfoEl) localInfoEl.value = invoice.shippingInfo || "";
  }

  // موعد التسليم
  if (shippingDateEl) {
    shippingDateEl.value = invoice.shippingDate || invoice.deliveryDate || "";
  }

  // ----------------------------------------------------
  // المنتجات (نحتاج أن نعرضها داخل selectedProductsList)
  // ----------------------------------------------------
  const selList = document.getElementById("selectedProductsList");
  const notesEl = document.getElementById("invoiceNotes");

  // 💡 خطوة جديدة: تجميع الأوصاف المخصصة
  let combinedCustomNotes = "";

  if (selList) {
    selList.innerHTML = ""; // تنظيف القائمة

    const productsArr = Array.isArray(invoice.products) ? invoice.products : [];

    // 🔧 إصلاح: إضافة index كمعامل ثاني في forEach
    productsArr.forEach((p, index) => {
      // قراءة حقل isCustom
      const isCustom = p.isCustom === true;

      const name = p.name || p.productName || "";
      const qty = p.quantity || p.qty || 1;
      // نستخدم priceAtOrder من كائن الطلب إذا وُجد لضمان صحة السعر عند الطلب
      const price = p.priceAtOrder || p.priceSYP || p.price || 0;
      const colorName = p.selectedColor?.name || p.color?.name || "";
      const colorCode = p.selectedColor?.code || p.color?.code || "";
      const customDescription = p.customDescription || "";

      // ✅ إصلاح: استخدام القيمة الآمنة للسعر
      const safePrice = price || 0;

      if (isCustom && customDescription) {
        // 1. تجميع الوصف المخصص للملاحظات العامة (للتعديل اليدوي)
        combinedCustomNotes += `[${name}]: ${customDescription} | الكمية القادمة: x${qty} | السعر المبدئي: ${safePrice.toLocaleString()} ل.س\n\n`;
      }

      const item = document.createElement("div");
      item.className = "selected-product";

      if (isCustom) {
        // custom product in fillFormWithInvoice: editable description, no color label
        const tempProductId = `CUSTOM_${Date.now()}_${index}`;
        item.innerHTML = `
              <div class="selected-product-left" style="background:#fff3e0; padding:5px; border-radius:4px;">
                  <span class="product-name" style="font-weight:bold; color:#d9534f;">${name}</span>
                  <textarea class="custom-description-input" placeholder="وصف المنتج المخصص..." style="width:100%; margin-top:6px; min-height:48px;">${
                    customDescription || ""
                  }</textarea>
                  <input type="hidden" class="is-custom-flag" value="true">
                  <input type="hidden" class="temp-product-id" value="${tempProductId}">
                  <input type="hidden" class="custom-description-text" value="${customDescription.replace(
                    /"/g,
                    "&quot;"
                  )}">
              </div>
              <div class="selected-product-right">
                  <div class="field-group">
                      <label style="font-size:10px;">الكمية</label>
                      <input type="number" class="product-qty-input" value="${qty}" min="1" oninput="updateInvoiceTotals()">
                  </div>
                  <div class="field-group">
                      <label style="font-size:10px;">السعر (ل.س)</label>
                      <input type="number" class="product-price-input" value="${safePrice}" min="0" oninput="updateInvoiceTotals()">
                  </div>
              </div>
              <button type="button" class="remove-product" 
                      onclick="this.closest('.selected-product').remove(); updateInvoiceTotals();">
                <i class="fa fa-times"></i>
              </button>
          `;
        item.classList.add("custom-product-item");
      } else {
        // للمنتج القياسي: يبقى كما هو (Read-Only)
        const colorName = p.selectedColor?.name || p.color?.name || "";
        const colorCode = p.selectedColor?.code || p.color?.code || "";

        item.innerHTML = `
              <div class="selected-product-left">
                  <span class="product-name">${name}</span>
                  ${
                    colorCode
                      ? `
                      <span class="selected-color" 
                            title="${colorName}" 
                            style="background-color:${colorCode};display:inline-block;width:14px;height:14px;border-radius:3px;margin-inline-start:8px;vertical-align:middle">
                      </span>
                  `
                      : ""
                  }
              </div>
              <div class="selected-product-right">
                  <span class="product-qty">x${qty}</span>
                  <span class="product-price">${safePrice.toLocaleString()} ل.س</span>
              </div>
              <button type="button" class="remove-product" 
                      onclick="this.closest('.selected-product').remove(); updateTotals();">
                <i class="fa fa-times"></i>
              </button>
                      <input type="hidden" class="product-note-text" value="${productNote.replace(
                        /"/g,
                        "&quot;"
                      )}">
              <input type="hidden" class="is-custom-flag" value="false">
              <input type="hidden" class="temp-product-id" value="${
                p.id || ""
              }">
              <input type="hidden" class="product-qty-static" value="${qty}">
              <input type="hidden" class="product-price-static" value="${safePrice}">
              <input type="hidden" class="product-color-name" value="${colorName}">
              <input type="hidden" class="product-color-code" value="${colorCode}">
          `;
      }
      // ----------------------------------------------------
      selList.appendChild(item);
    });
  }

  // ----------------------------------------------------
  // ملء حالة الدفع والملاحظات
  // ----------------------------------------------------
  const paymentStatusEl = document.getElementById("paymentStatus");
  const paymentAmountEl = document.getElementById("paymentAmountPaid");
  const payment = invoice.payment || {
    status: "unpaid",
    paidSYP: 0,
    remainingSYP: 0,
  };

  if (paymentStatusEl) {
    paymentStatusEl.value = payment.status || "unpaid";
    // تشغيل حدث التغيير لتحديث الحقول المرتبطة
    paymentStatusEl.dispatchEvent(new Event("change"));
  }

  // إظهار/إخفاء حقل المبلغ المدفوع (يجب أن تكون هذه الدالة موجودة)
  if (typeof togglePaymentFields === "function") {
    togglePaymentFields(
      paymentStatusEl ? paymentStatusEl.value : payment.status || "unpaid"
    );
  }

  if (paymentAmountEl) {
    // ✅ إصلاح: استخدام القيمة الآمنة
    const paidAmount = payment.paidSYP || 0;
    paymentAmountEl.value = paidAmount;
  }

  // حساب وتعبئة الإجمالي في الحقول/العناصر ذات الصلة
  // 🔧 إصلاح: استخدام دالة updateInvoiceTotals الجديدة للحساب
  const selectedProductsList = document.getElementById("selectedProductsList");
  if (selectedProductsList) {
    // ستقوم updateInvoiceTotals بعرض الإجمالي الأصلي والمعدّل إن وُجد
    // أولاً نملأ حقل التعديل في حال كانت الفاتورة تحتوي على تعديل
    const adjVal = document.getElementById("adjustmentValue");
    const adjType = document.getElementById("adjustmentType");
    if (adjVal && adjType) {
      const invAdj = invoice.adjustment;
      if (invAdj && invAdj.value !== undefined && invAdj.type) {
        adjVal.value = invAdj.value;
        adjType.value = invAdj.type;
      } else {
        adjVal.value = "";
        adjType.value = "+";
      }
    }

    // نستدعي updateInvoiceTotals مباشرة بدلاً من calculateTotals
    setTimeout(updateInvoiceTotals, 0);
  } else {
    // Fallback إلى calculateTotals القديمة
    const productsForCalculation = Array.isArray(invoice.products)
      ? invoice.products
      : [];
    const { totalSYP } = calculateTotals(productsForCalculation);
    const safeTotalSYP = totalSYP || 0;
    const totalDisplay = document.getElementById("totalSYP");
    if (totalDisplay) totalDisplay.textContent = safeTotalSYP.toLocaleString();
  }

  if (notesEl) {
    // ملاحظات الفاتورة الأصلية
    let existingNotes = invoice.notes || "";

    // إذا كان هناك أوصاف مخصصة، ندمجها
    if (combinedCustomNotes) {
      // نضيف خط فاصل إذا كانت الملاحظات الأصلية موجودة
      if (existingNotes) {
        existingNotes += "\n\n--- أوصاف مخصصة من الطلب ---\n\n";
      }
      existingNotes += combinedCustomNotes;
    }

    notesEl.value = existingNotes;
  }

  // حفظ المعرف داخل الفورم لتمييز التعديل أو كمعرف مؤقت
  form.dataset.editingId = invoice.id;

  // إظهار زر الحذف فقط في حال كنا نعدل فاتورة محفوظة، وليس فاتورة جديدة مستوردة
  const delBtn = document.getElementById("deleteInvoiceBtn");
  if (delBtn) {
    // ✅ استخدام allInvoices المُمررة للتحقق مما إذا كانت الفاتورة موجودة مسبقاً
    const isExistingInvoice =
      allInvoices.findIndex((inv) => inv.id === invoice.id) !== -1;
    if (isExistingInvoice) {
      delBtn.classList.remove("hidden"); // إظهاره إذا كانت محفوظة
    } else {
      delBtn.classList.add("hidden"); // إخفاءه إذا كانت جديدة
    }
  }

  // أخيراً افتح المودال
  if (typeof openNewInvoiceModel === "function") {
    openNewInvoiceModel();
  } else {
    console.warn("الدالة openNewInvoiceModel غير معرفة");
  }
}

function onPasteCode() {
  const codeInput = document.getElementById("pasteInvoiceCodeInput");
  if (!codeInput) {
    console.error("❌ حقل إدخال الكود غير موجود.");
    return;
  }

  const code = codeInput.value.trim();
  if (!code) {
    showToast("ألصق الكود أولاً", 3000, "orange");
    return;
  }

  try {
    // 1️⃣ استخراج جزء الكود إذا كان النص يحتوي على كلام إضافي
    // نتوقع رمز base64url مكوّن من أحرف [A-Za-z0-9_-] بطول معقول (>20)
    let token = null;
    const tokenMatch = code.match(/[A-Za-z0-9_\-]{20,}/);
    if (tokenMatch) token = tokenMatch[0];
    else token = code;

    // 2️⃣ محاولة إزالة ترميز URI إن وُجد (حالات نسخ من Telegram قد تكون مُرمّزة)
    let tried = [];
    let invoice = null;

    const attemptDecode = (candidate) => {
      try {
        tried.push(candidate);
        return decodeInvoice(candidate);
      } catch (err) {
        console.warn(
          "decodeInvoice failed for candidate:",
          candidate,
          err && err.message
        );
        return null;
      }
    };

    // أول محاولة: حاول decodeURIComponent ثم decodeInvoice
    try {
      const decodedURI = decodeURIComponent(token);
      invoice = attemptDecode(decodedURI);
    } catch (e) {
      // لا تفشل هنا — سنجرب المرشح الأصلي
      console.warn("decodeURIComponent failed or not needed:", e && e.message);
    }

    // إذا لم تنجح، جرّب المرشح الأصلي
    if (!invoice) invoice = attemptDecode(token);

    // كخيار أخير، جرّب atob (بعض الأنظمة قد تكون أرسلت base64 بدل base64url)
    if (!invoice) {
      try {
        const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
        // أضف padding إن لزم
        const pad = b64.length % 4;
        const padded = pad ? b64 + "=".repeat(4 - pad) : b64;
        invoice = attemptDecode(padded);
      } catch (err) {
        console.warn("atob/decode fallback failed:", err && err.message);
      }
    }

    if (!invoice)
      throw new Error(
        "لم يتم فك الكود بشكل صحيح (جرب لصق الكود فقط دون أي نص إضافي)"
      );

    // 2️⃣ تجهيز الفاتورة مع معرف جديد
    const targetInvoice = { ...invoice, id: Date.now() };

    // 3️⃣ جلب جميع الفواتير الحالية
    const allInvoices = JSON.parse(localStorage.getItem("invoices")) || [];

    // 4️⃣ تعبئة النموذج وفتح المودال إذا كانت الدالة موجودة
    if (typeof fillFormWithInvoice === "function") {
      fillFormWithInvoice(targetInvoice, allInvoices);
    } else {
      console.warn("⚠️ الدالة fillFormWithInvoice غير موجودة.");
    }

    // 5️⃣ حذف معرف التعديل إذا موجود
    const form = document.getElementById("invoiceForm");
    if (form && form.dataset.editingId) {
      delete form.dataset.editingId;
    }

    // 6️⃣ إخفاء زر الحذف فقط إذا موجود
    const delBtn = document.getElementById("deleteInvoiceBtn");
    if (delBtn) delBtn.classList.add("hidden");

    // 7️⃣ رسالة نجاح
    alert(
      '📝 تم تحميل بيانات الفاتورة. يرجى مراجعتها والضغط على "حفظ" لحفظ الفاتورة.'
    );

    // 8️⃣ مسح حقل الكود وإخفاء المودال إذا الدالة موجودة
    codeInput.value = "";
    if (typeof toggleInvoiceCodeInput === "function") {
      toggleInvoiceCodeInput();
    }
  } catch (e) {
    console.error(e);
    alert("❌ فشل فك الكود — تأكد من أن الكود صحيح\n" + (e.message || e));
  }
}

function toggleInvoiceCodeInput() {
  // دعم كلا المعرفين: القديم والجديد في الـ HTML
  const modalIds = [
    "invoiceCodeInputModal",
    "codeInputPopup",
    "pasteInvoiceCodeInputModal",
  ];
  let found = false;
  for (const id of modalIds) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle("show");
      found = true;
    }
  }
  if (!found)
    console.warn(
      "⚠️ لم يتم العثور على عنصر إدخال كود الفاتورة (id invoiceCodeInputModal|codeInputPopup)"
    );
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// دالة موحدة لتحديد ما إذا كان يجب عرض زر الصعود للأعلى
function checkScrollButtonVisibility() {
  const scrollBtn = document.getElementById("scrollTopBtn");

  // 1. يجب أن يكون هناك تمرير أكثر من 300 بكسل
  const scrolledEnough = window.scrollY > 300;

  // 2. يجب أن تكون قائمة FAB مغلقة
  const fabClosed = !fabMenuOpen;

  if (scrolledEnough && fabClosed && invoiceFormOpen === false) {
    // العرض: يجب أن نستخدم 'show' و 'hide' بشكل متناسق
    scrollBtn.classList.remove("hide");
    scrollBtn.classList.add("show");
  } else {
    // الإخفاء
    scrollBtn.classList.remove("show");
    scrollBtn.classList.add("hide");
  }
}

// استمع فقط لحدث التمرير
window.addEventListener("scroll", checkScrollButtonVisibility);

window.addEventListener("click", checkScrollButtonVisibility);

// دالة جلب المتاجر (تستخدم في صفحة الفواتير)
function getStores() {
  try {
    // جلب متاجر المستخدم من localStorage
    const userStores = JSON.parse(localStorage.getItem("pointsOfSale")) || [];

    // إذا كانت هناك قائمة المتاجر الافتراضية، ندمجها مع متاجر المستخدم
    let combinedStores = Array.isArray(defaultStores) ? [...defaultStores] : [];

    // استبدال أو إضافة متاجر المستخدم فوق الافتراضية عند الحاجة
    userStores.forEach((userStore) => {
      const idx = combinedStores.findIndex((s) => s.id === userStore.id);
      if (idx !== -1) {
        combinedStores[idx] = userStore;
      } else {
        combinedStores.push(userStore);
      }
    });

    return combinedStores;
  } catch (error) {
    console.error("❌ خطأ في جلب المتاجر:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// A. قراءة معاملات URL وتنفيذ الإجراء
// ----------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // ... (أي تهيئة سابقة لديك لصفحة الفواتير) ...

  // 💡 نقوم بفحص رابط URL لتحديد ما إذا كنا قادمين من صفحة المتاجر
  const urlParams = new URLSearchParams(window.location.search);
  const action = urlParams.get("action");
  const storeId = urlParams.get("storeId");

  // 1. تنفيذ إجراء 'ADD' (إضافة فاتورة جديدة لمتجر محدد)
  if (action === "add" && storeId) {
    // نستخدم parseInt لتحويل القيمة إلى رقم لضمان التوافق
    const targetStoreId = parseInt(storeId);

    // يجب أن تكون دالة openInvoiceModal() موجودة في هذا الملف
    // (سنعدلها لتستقبل storeId في الخطوة التالية)
    openNewInvoiceModel(targetStoreId);
  }

  // 2. تنفيذ إجراء 'FILTER' (عرض فواتير متجر محدد)
  else if (action === "filter" && storeId) {
    const targetStoreId = parseInt(storeId);

    // ✅ 1. تمرير ID المتجر للدالة
    renderInvoices(targetStoreId);

    // 💡 إظهار رسالة تفيد بأن القائمة مفلترة
    alert(`يتم الآن عرض الفواتير المرتبطة بالمتجر ID: ${targetStoreId}`);
    showToast(
      `يتم الآن عرض الفواتير المرتبطة بالمتجر ID: ${targetStoreId}`,
      5000,
      "green"
    );
  }

  // إذا لم يكن هناك معامل في الرابط، نعرض الفواتير بشكل طبيعي
  else {
    renderInvoices();
  }
});

/**
 * يقوم بملء قائمة الـ Select الخاصة بالمتاجر ببيانات المتاجر المخزنة.
 * @param {number | null} preselectStoreId - معرّف المتجر الذي يجب اختياره تلقائياً.
 */
function populateStoreSelect(preselectStoreId = null) {
  const storeSelect = document.getElementById("linkedStores");
  if (!storeSelect) return;

  // 💡 الجديد: تحديد ما إذا كنا في وضع التعديل بناءً على وجود editingId في النموذج
  const form = document.getElementById("invoiceForm");
  const isEditing = !!form.dataset.editingId;

  // 1. استرجاع المتاجر
  const stores = getStores();

  // 2. مسح الخيارات الحالية (عدا الخيار الافتراضي)
  storeSelect.innerHTML = '<option value="">-- اختر المتجر --</option>';

  if (stores.length === 0) {
    // console.warn('⚠️ لا توجد متاجر في localStorage');
    return;
  }

  // 3. تعبئة القائمة بالبيانات
  stores.forEach((store) => {
    const option = document.createElement("option");
    // نستخدم ID المتجر كقيمة (Value)
    option.value = store.id;
    option.textContent = `${store.name}  (${store.location})`; // إضافة تفاصيل للتمييز
    storeSelect.appendChild(option);
  });

  // 4. الاختيار المسبق (في حال القدوم من رابط المتجر أو وضع التعديل)
  if (preselectStoreId) {
    // نضمن تحويل الرقم إلى نص لمطابقة قيمة الـ Select
    storeSelect.value = String(preselectStoreId);
  }

  // 5. 💡 التعديل الهام: تشغيل handleStoreSelection فقط إذا لم نكن في وضع التعديل (Add New)
  // هذا يمنع تفريغ حقول المشتري المحملة من الفاتورة أثناء التعديل.
  if (!isEditing) {
    handleStoreSelection(storeSelect.value);
  }
}

/**
 * تعالج تغيير قيمة قائمة المتاجر، وتقوم بتعبئة حقول المشتري ببيانات المتجر.
 * @param {string | number} selectedId - معرّف المتجر المختار (أو سلسلة فارغة إذا كان "بدون متجر").
 */
function handleStoreSelection(selectedId) {
  // 💡 الجديد: الحصول على حالة النموذج
  const form = document.getElementById("invoiceForm");
  const isEditing = !!form.dataset.editingId;

  // 💡 التعديل الهام: إذا كنا في وضع التعديل، نخرج مباشرة دون تغيير الحقول
  // هذا يمنع تفريغ بيانات المشتري المحملة من الفاتورة الأصلية.
  if (isEditing) {
    return;
  }

  // الوصول إلى حقول المشتري
  const nameInput = document.getElementById("buyerName");
  const phoneInput = document.getElementById("buyerPhone");
  const provinceInput = document.getElementById("buyerProvince");

  // 1. تفريغ الحقول أولاً (يحدث فقط في وضع الإضافة الجديدة)
  nameInput.value = "";
  phoneInput.value = "";
  provinceInput.value = "";

  if (selectedId && selectedId !== "") {
    const stores = getStores();
    // ID المتجر يكون string من الـ HTML، يجب تحويله إلى رقم للمقارنة
    const storeIdNum = parseInt(selectedId);

    const selectedStore = stores.find((s) => s.id === storeIdNum);

    if (selectedStore) {
      // 2. تعبئة الحقول ببيانات المتجر
      nameInput.value = selectedStore.name;
      phoneInput.value = selectedStore.phone;
      provinceInput.value = selectedStore.location; // استخدمنا 'location' للمحافظة
    }
  }
}

let fabMenuOpen = false;
let invoiceFormOpen = false;
const menu = document.getElementById("fabSpeedDial");
const mainFab = document.getElementById("mainFab");

function toggleFabMenu() {
  fabMenuOpen = !fabMenuOpen;

  // تبديل حالة العرض
  menu.classList.toggle("hidden");

  // تغيير أيقونة الـ FAB الرئيسي
  if (menu.classList.contains("hidden")) {
    mainFab.querySelector("i").className = "fa fa-plus"; // عند الإغلاق
  } else {
    mainFab.querySelector("i").className = "fa fa-times"; // عند الفتح
  }
}

function closeFabMenu() {
  if (!menu.classList.contains("hidden")) {
    menu.classList.add("hidden");
    mainFab.querySelector("i").className = "fa fa-plus";
    fabMenuOpen = false;
  }
}

function openFilterModal() {
  const modal = document.getElementById("filterModal");
  const overlay = document.getElementById("filterOverlay");

  // 💡 نقطة هامة: يجب تعبئة قائمة المتاجر الخاصة بالفلتر قبل الفتح
  // سنستخدم populateStoreSelect(null) مع تعديل بسيط لاحقاً
  // حالياً نستخدم دالة افتراضية
  // populateStoreFilterSelect();

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // تأكد من إغلاق قائمة الـ FAB بعد فتح المودال
  toggleFabMenu();
}

/**
 * إغلاق مودال التصفية.
 */
function closeFilterModal() {
  const modal = document.getElementById("filterModal");
  const overlay = document.getElementById("filterOverlay");

  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

// ======================================================
// 💾 دالة تطبيق الفلترة والترتيب
// ======================================================
// NOTE: `applyFiltersAndSort` consolidated later in this file to avoid duplicate
// function declarations. The active implementation reads the filter inputs,
// updates `currentFilters` (including start/end dates) and calls `renderInvoices()`.

/**
 * تبديل حالة منبثق إدخال الكود.
 * @param {Event} event - حدث النقر.
 */
function toggleCodeInputPopup(event) {
  const popup = document.getElementById("codeInputPopup");

  // 2. إغلاق مودال الفلترة (لضمان عدم التداخل)
  closeFilterModal();

  // 3. تبديل المنبثق نفسه
  if (!popup.classList.contains("hidden")) {
    closeCodeInputPopup(); // نستخدم دالة الإغلاق لضمان مسح الحقل
    return;
  }

  popup.classList.remove("hidden");
  document.getElementById("pasteInvoiceCodeInput").focus();

  // 4. منع انتشار حدث النقر
  if (event) {
    event.stopPropagation();
  }
}

/**
 * إغلاق منبثق إدخال الكود (للاستخدام الداخلي).
 */
function closeCodeInputPopup() {
  const popup = document.getElementById("codeInputPopup");
  popup.classList.add("hidden");
  document.getElementById("pasteInvoiceCodeInput").value = "";
}

// ======================================================
// 🛒 دالة تعبئة قائمة المتاجر في مودال الفلترة
// ======================================================
function populateStoreFilterSelect() {
  // 1. 💡 استرجاع المتاجر من المصدر الرئيسي (pointsOfSale)
  const stores = getStores(); // نستخدم الدالة التي تجلب المتاجر من localStorage["pointsOfSale"]

  const storeSelect = document.getElementById("storeFilter");

  if (!storeSelect) return;

  // 2. مسح الخيارات الحالية وإضافة خيار "الكل"
  // القيمة الافتراضية 'all'
  storeSelect.innerHTML = '<option value="all">جميع المتاجر</option>';

  // 3. إضافة خيارات المتاجر بناءً على قائمة المتاجر الرئيسية
  stores.forEach((store) => {
    if (store.name && store.id !== undefined) {
      const option = document.createElement("option");

      // ✅ الأهم: نستخدم ID المتجر كقيمة (Value) للفلترة
      option.value = store.id;

      // نستخدم اسم المتجر كنص (Text) للعرض
      option.textContent = store.name;
      storeSelect.appendChild(option);
    }
  });

  // 4. تعيين القيمة المحددة مسبقاً (سواء كانت 'all' أو ID المتجر المُفلتر)
  // نستخدم String() لضمان تطابق نوع القيمة مع قيمة الـ <option>
  storeSelect.value = String(currentFilters.store);
}

// ======================================================
// 💾 دالة تطبيق الفلترة والترتيب
// ======================================================
function applyFiltersAndSort() {
  // 1. قراءة القيم من حقول الإدخال
  const paymentFilter = document.getElementById("paymentFilter").value;
  const storeFilter = document.getElementById("storeFilter").value;
  const sortOption = document.getElementById("sortOption").value;

  // 💡 الجديد: قراءة قيم التاريخ
  const startDate = document.getElementById("startDateInput").value;
  const endDate = document.getElementById("endDateInput").value;

  // 2. تحديث الإعدادات العالمية
  currentFilters.paymentStatus = paymentFilter;
  currentFilters.store = storeFilter;
  currentFilters.sortOption = sortOption;

  // 💡 الجديد: تحديث فلاتر التاريخ
  currentFilters.startDate = startDate;
  currentFilters.endDate = endDate;

  // 3. إغلاق المودال
  closeFilterModal();

  // 4. 💡 استدعاء دالة عرض الفواتير المحدثة
  // يجب أن تكون هذه الدالة (renderInvoices) جاهزة لاستلام الفلتر وتطبيقه
  renderInvoices();
}
// ======================================================
// 🔍 تحديث دالة فتح مودال الفلترة
// ======================================================
function openFilterModal() {
  const modal = document.getElementById("filterModal");
  const overlay = document.getElementById("filterOverlay");

  // إغلاق قائمة الـ FAB الرئيسية ومنبثق الكود
  if (fabMenuOpen) {
    toggleFabMenu();
  }
  closeCodeInputPopup();

  // تعبئة قائمة المتاجر
  populateStoreFilterSelect();

  // تعيين القيم الحالية في حقول الإدخال
  document.getElementById("paymentFilter").value = currentFilters.paymentStatus;
  document.getElementById("storeFilter").value = currentFilters.store;
  document.getElementById("sortOption").value = currentFilters.sortOption;

  // 🔥 الجديد: تعيين قيم التاريخ الحالية
  document.getElementById("startDateInput").value = currentFilters.startDate;
  document.getElementById("endDateInput").value = currentFilters.endDate;

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

// 💡 تضاف هذه الدالة في أي مكان في ملف الـ JavaScript

function resetFilters() {
  // 1. إعادة تعيين الفلاتر العالمية إلى القيم الافتراضية
  currentFilters.paymentStatus = DEFAULT_FILTERS.paymentStatus;
  currentFilters.store = DEFAULT_FILTERS.store;
  currentFilters.sortOption = DEFAULT_FILTERS.sortOption;
  currentFilters.startDate = DEFAULT_FILTERS.startDate; // 🔥 إعادة تعيين
  currentFilters.endDate = DEFAULT_FILTERS.endDate; // 🔥 إعادة تعيين

  // 2. مسح حقل البحث السريع
  currentSearchQuery = "";
  const searchInput = document.getElementById("quickSearchInput");
  if (searchInput) {
    searchInput.value = "";
  }

  closeFabMenu();

  // 3. إعادة عرض الفواتير
  renderInvoices();
}

/**
 * تنسيق كائن Date أو سلسلة نصية قابلة للتحويل إلى YYYY/MM/DD
 * @param {string | Date} dateSource - مصدر التاريخ (يجب أن يكون قابلاً للتحويل إلى Date object).
 */
function formatDateToYYYYMMDD(dateSource) {
  // حاول تحويل المصدر إلى كائن Date
  const date = new Date(dateSource);

  // إذا لم يكن التحويل ناجحاً، أو كانت القيمة فارغة، أرجعها كما هي أو قيمة افتراضية
  if (isNaN(date.getTime()) || !dateSource) {
    return dateSource || "-";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

// ✅ ملاحظة: هذه الدالة لم تعد تحتاج إلى document.getElementById() لأننا مررنا الزر مباشرة
function toggleAllInvoicesAction(clickedButton) {
  const allInvoices = document.querySelectorAll(".invoice-card");

  if (allInvoices.length === 0) return;

  // 1. تحديد حالة الفواتير الحالية
  const firstBody = allInvoices[0].querySelector(".invoice-body");
  const isCurrentlyHidden = firstBody.classList.contains("hidden");

  // 2. تحديد الأيقونة والنص الجديد لزر FAB
  const newText = isCurrentlyHidden ? "إغلاق الكل" : "فتح الكل";
  const newIconClass = isCurrentlyHidden ? "fa-compress" : "fa-expand";

  // 3. تحديث أيقونة ونصوص زر FAB (باستخدام clickedButton الذي مررناه)
  const iconElement = clickedButton.querySelector("i");
  iconElement.className = `fa ${newIconClass}`;
  clickedButton.querySelector("span").textContent = newText;

  // 4. تطبيق التبديل على كل فاتورة
  allInvoices.forEach((invoiceCard) => {
    const summary = invoiceCard.querySelector(".invoice-summary");
    const body = invoiceCard.querySelector(".invoice-body");

    // الأيقونات الداخلية (مؤشر السهم)
    const productsDiv = invoiceCard.querySelector(".invoice-products");
    const productsToggleIcon = invoiceCard.querySelector(
      ".btn-toggle-products i"
    );

    // عملية التبديل
    if (isCurrentlyHidden) {
      // فتح الكل
      summary.classList.add("hidden");
      body.classList.remove("hidden");
    } else {
      // إغلاق الكل
      summary.classList.remove("hidden");
      body.classList.add("hidden");

      // نضمن طي المنتجات الداخلية وتحديث أيقونتها إلى الأسفل
      if (productsDiv) productsDiv.classList.add("hidden");
      if (productsToggleIcon)
        productsToggleIcon.classList.replace(
          "fa-chevron-up",
          "fa-chevron-down"
        );
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dividers = document.getElementById("firstDivider");
  if (isAdmin()) {
  } else {
    dividers.style.display = "none";
  }
});

// 🔧 دالة لفحص ألوان المنتجات المخزنة
function debugProductColors(invoiceId) {
  const allInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
  const invoice = allInvoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    console.log("⚠️ الفاتورة غير موجودة");
    return;
  }

  console.log("=== فحص ألوان المنتجات للفاتورة ===");
  console.log("رقم الفاتورة:", invoice.id);

  invoice.products.forEach((product, index) => {
    console.log(`المنتج ${index + 1}:`, {
      name: product.name,
      quantity: product.quantity,
      priceSYP: product.priceSYP,
      color: product.color,
      hasColor: !!product.color,
      colorCode: product.color?.code,
      colorName: product.color?.name,
      isCustom: product.isCustom,
    });
  });
}

// يحول نص تاريخ قد يحتوي على أرقام عربية أو فواصل خاصة إلى كائن Date
function parseArabicDate(dateStr) {
  if (!dateStr) return new Date(NaN);
  try {
    // خرائط للأرقام العربية (الشرقية والغربية)
    const map = {
      "٠": "0",
      "١": "1",
      "٢": "2",
      "٣": "3",
      "٤": "4",
      "٥": "5",
      "٦": "6",
      "٧": "7",
      "٨": "8",
      "٩": "9",
      "\u06F0": "0",
      "\u06F1": "1",
      "\u06F2": "2",
      "\u06F3": "3",
      "\u06F4": "4",
      "\u06F5": "5",
      "\u06F6": "6",
      "\u06F7": "7",
      "\u06F8": "8",
      "\u06F9": "9",
    };

    // استبدال الأرقام العربية باللاتينية
    let normalized = dateStr.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (ch) => {
      return map[ch] || ch;
    });

    // استبدال أي فاصل غير رقمي بslash
    normalized = normalized.replace(/[^0-9]/g, "/");

    const parts = normalized.split("/").filter(Boolean);
    if (parts.length >= 3) {
      // نفترض الشكل اليوم/شهر/سنة (كما تعطي toLocaleDateString('ar-SY'))
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      return new Date(year, month - 1, day);
    }

    // آخر حل: محاولة تحويل مباشر
    const d = new Date(dateStr);
    return d;
  } catch (e) {
    console.warn("parseArabicDate failed for", dateStr, e);
    return new Date(dateStr);
  }
}

// ترحيل: إضافة حقل `timestamp` رقمي للفواتير القديمة إن لم يكن موجودًا
function migrateInvoicesTimestamps() {
  try {
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
    let changed = false;
    invoices.forEach((inv) => {
      if (!inv) return;
      if (typeof inv.timestamp === "number") return; // موجود بالفعل

      let ts = null;
      // حاول استخدام الحقل date إن وُجد
      if (inv.date) {
        if (typeof inv.date === "number") {
          ts = inv.date;
        } else if (typeof inv.date === "string") {
          const pd = parseArabicDate(inv.date);
          if (pd && !isNaN(pd.getTime())) ts = pd.getTime();
          else {
            const d = new Date(inv.date);
            if (!isNaN(d.getTime())) ts = d.getTime();
          }
        }
      }

      if (!ts) ts = Date.now();
      inv.timestamp = ts;
      changed = true;
    });
    if (changed) {
      localStorage.setItem("invoices", JSON.stringify(invoices));
      console.log("migrateInvoicesTimestamps: updated invoices with timestamp");
    }
  } catch (e) {
    console.warn("migrateInvoicesTimestamps error:", e);
  }
}

function openInvoicePrint() {
  const form = document.getElementById("invoiceForm");
  const id = form && form.dataset.editingId;

  window.open(
    `invoice_print.html?id=${id}`,
    "_blank"
  );
}
