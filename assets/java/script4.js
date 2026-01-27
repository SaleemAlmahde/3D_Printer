// المتغيرات التي سنحتاجها عالميًا (نقوم بتهيئة قيمتها لاحقًا)
let storeModal;
let storeOverlay;
let storeForm;
let deleteStoreBtn;
let storeLogoInput;
let storeLogoPreview;
let removeStoreLogoBtn;

function getStores() {
  // أولاً: جلب المتاجر المحفوظة في localStorage
  let userStores = JSON.parse(localStorage.getItem("pointsOfSale")) || [];

  // ثانياً: دمج المتاجر الافتراضية مع متاجر المستخدم
  // نبدأ بإنشاء نسخة من المتاجر الافتراضية
  let combinedStores = [...defaultStores];

  // ندمج مع متاجر المستخدم (نستبدل المتاجر الافتراضية التي تم تعديلها)
  userStores.forEach((userStore) => {
    // البحث إذا كان هذا المتجر موجوداً في الافتراضية (بنفس الـ id)
    const index = combinedStores.findIndex(
      (store) => store.id === userStore.id,
    );

    if (index !== -1) {
      // إذا كان متجراً افتراضياً معدلاً، نستبدله
      combinedStores[index] = userStore;
    } else {
      // إذا كان متجراً جديداً أضافه المستخدم، نضيفه
      combinedStores.push(userStore);
    }
  });

  return combinedStores;
}

// دالة لحفظ قائمة المتاجر الجديدة في localStorage
function setStores(stores) {
  // نحدد المتاجر الافتراضية الأصلية
  const defaultStoreIds = defaultStores.map((store) => store.id);

  // نجهز مصفوفة المتاجر التي سنحفظها
  let storesToSave = [];

  stores.forEach((store) => {
    // إذا كان المتجر غير افتراضي، نحفظه
    if (!defaultStoreIds.includes(store.id)) {
      storesToSave.push(store);
    } else {
      // إذا كان افتراضياً، نتحقق إذا كان مختلفاً عن الأصل
      const originalStore = defaultStores.find((s) => s.id === store.id);

      // مقارنة المتجر مع الأصل
      if (JSON.stringify(store) !== JSON.stringify(originalStore)) {
        // إذا كان مختلفاً (تم تعديله)، نحفظه
        storesToSave.push(store);
      }
      // إذا كان مطابقاً للأصل، لا نحفظه (سيعرض من الافتراضيات)
    }
  });

  // حفظ في localStorage
  localStorage.setItem("pointsOfSale", JSON.stringify(storesToSave));
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. تهيئة المتغيرات: الآن فقط يتم البحث عن العناصر بعد تحميلها
  storeModal = document.getElementById("newStoreModal");
  storeOverlay = document.getElementById("newStoreOverlay");
  storeForm = document.getElementById("storeForm");
  deleteStoreBtn = document.getElementById("deleteStoreBtn");

  storeOverlay.addEventListener("click", closeStoreModal);

  // init logo inputs (optional)
  storeLogoInput = document.getElementById("storeLogoInput");
  storeLogoPreview = document.getElementById("storeLogoPreview");
  removeStoreLogoBtn = document.getElementById("removeStoreLogoBtn");
  const storeLogoDataField = document.getElementById("storeLogoData");
  const storeLogoFake = document.getElementById("storeLogoFake");
  if (storeLogoInput) {
    storeLogoInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (evt) {
        const dataUrl = evt.target.result;
        // store the data but do NOT display the preview inside the modal
        if (storeLogoPreview) {
          storeLogoPreview.src = dataUrl; // keep data for saving but keep hidden
        }
        if (storeLogoDataField) storeLogoDataField.value = dataUrl;
        // also store in form dataset for easier access
        if (storeForm) storeForm.dataset.logoData = dataUrl;
        // update fake input value to show filename/selection
        try {
          if (storeLogoFake) storeLogoFake.value = file.name || "صورة مختارة";
          // show remove button since a file is selected
          if (removeStoreLogoBtn) removeStoreLogoBtn.classList.remove("hidden");
        } catch (err) {}
      };
      reader.readAsDataURL(file);
    });
  }
  // click the visible placeholder-field to open file picker
  if (storeLogoFake) {
    storeLogoFake.addEventListener("click", (ev) => {
      ev.preventDefault();
      if (storeLogoInput) storeLogoInput.click();
    });
  }

  // remove logo button handler (clear selection/data but do not delete store record)
  if (removeStoreLogoBtn) {
    removeStoreLogoBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      deleteStoreLogo();
    });
  }

  // تهيئة البحث
  const searchInput = document.getElementById("storeSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", searchStores);
    searchInput.addEventListener("keyup", searchStores);
  }

  // 2. التحقق وبدء عرض المتاجر
  if (document.getElementById("storesContainer")) {
    renderStores();
  }
  // 💡 الآن، يمكن لبقية الدوال (مثل openStoreModal) استخدام هذه المتغيرات بشكل آمن.
});

// فتح مودال المتجر
function openStoreModal(store = null) {
  storeModal.classList.remove("hidden-store");
  storeOverlay.classList.remove("hidden-store");

  // إعادة تعيين النموذج في كل مرة يفتح فيها
  storeForm.reset();
  delete storeForm.dataset.editingId;
  deleteStoreBtn.classList.add("hidden");

  if (store) {
    // حالة التعديل
    document.querySelector("#newStoreModal h2").textContent =
      "تعديل بيانات المتجر";
    storeForm.dataset.editingId = store.id;
    document.getElementById("storeName").value = store.name;
    document.getElementById("storePhone").value = store.phone;
    document.getElementById("storeLocation").value = store.location;
    // populate optional map URL
    try {
      document.getElementById("storeMapUrl").value = store.mapUrl || "";
    } catch (err) {}
    deleteStoreBtn.classList.remove("hidden");
    // populate logo preview if exists and sync fake field
    try {
      const logoField = document.getElementById("storeLogoData");
      // Do NOT display the image preview inside the modal. Instead expose a remove button when a logo exists.
      if (store.logo) {
        if (logoField) logoField.value = store.logo;
        if (storeForm) storeForm.dataset.logoData = store.logo;
        if (storeLogoFake) storeLogoFake.value = "صورة موجودة";
        if (removeStoreLogoBtn) removeStoreLogoBtn.classList.remove("hidden");
        // keep preview src but keep wrapper hidden
        if (storeLogoPreview) storeLogoPreview.src = store.logo;
        try {
          document.getElementById("storeLogoPreviewWrap").style.display =
            "none";
        } catch (err) {}
      } else {
        if (storeLogoPreview) storeLogoPreview.src = "";
        if (logoField) logoField.value = "";
        if (storeForm) delete storeForm.dataset.logoData;
        try {
          document.getElementById("storeLogoPreviewWrap").style.display =
            "none";
        } catch (err) {}
        if (storeLogoFake) storeLogoFake.value = "";
        if (removeStoreLogoBtn) removeStoreLogoBtn.classList.add("hidden");
      }
    } catch (err) {
      console.warn("Logo init failed:", err && err.message);
    }
  } else {
    // حالة الإضافة الجديدة
    document.querySelector("#newStoreModal h2").textContent = "إضافة متجر جديد";
    // clear logo preview
    try {
      const logoField = document.getElementById("storeLogoData");
      if (storeLogoPreview) storeLogoPreview.src = "";
      if (logoField) logoField.value = "";
      if (storeForm) delete storeForm.dataset.logoData;
      try {
        document.getElementById("storeLogoPreviewWrap").style.display = "none";
      } catch (err) {}
      if (storeLogoInput) storeLogoInput.value = "";
      try {
        if (storeLogoFake) storeLogoFake.value = "";
      } catch (err) {}
      if (removeStoreLogoBtn) removeStoreLogoBtn.classList.add("hidden");
    } catch (err) {}
  }
}

// إغلاق مودال المتجر
function closeStoreModal() {
  storeModal.classList.add("hidden-store");
  storeOverlay.classList.add("hidden-store");
  // إعادة تعيين حالة التعديل عند الإغلاق
  storeForm.reset();
  delete storeForm.dataset.editingId;
  // clear logo preview and data
  try {
    const logoField = document.getElementById("storeLogoData");
    if (storeLogoPreview) storeLogoPreview.src = "";
    if (logoField) logoField.value = "";
    if (storeLogoInput) storeLogoInput.value = "";
    if (storeForm) delete storeForm.dataset.logoData;
    document.getElementById("storeLogoPreviewWrap").style.display = "none";
    if (removeStoreLogoBtn) removeStoreLogoBtn.classList.add("hidden");
  } catch (err) {}
}

// ----------------------------------------------------------------------
// 3. دالة حفظ المتجر (CRUD Save)
// ----------------------------------------------------------------------

function saveStore() {
  try {
    const name = document.getElementById("storeName").value.trim();
    const phone = document.getElementById("storePhone").value.trim();
    const location = document.getElementById("storeLocation").value.trim();

    if (!name || !phone || !location) {
      showToast("⚠️ يرجى ملء جميع حقول المتجر.", 3000, "red");
      return;
    }

    let stores = getStores();
    const editingId = storeForm.dataset.editingId;

    if (editingId) {
      // حالة التعديل
      const id = parseInt(editingId);
      const index = stores.findIndex((s) => s.id === id);

      if (index !== -1) {
        // include optional logo data if provided
        const logoData =
          (storeForm && storeForm.dataset && storeForm.dataset.logoData) ||
          (document.getElementById("storeLogoData") &&
            document.getElementById("storeLogoData").value) ||
          stores[index].logo ||
          "";
        stores[index] = {
          ...stores[index],
          name,
          phone,
          location,
          logo: logoData,
          mapUrl:
            (document.getElementById("storeMapUrl") &&
              document.getElementById("storeMapUrl").value.trim()) ||
            "",
        };
      }
    } else {
      // حالة الإضافة الجديدة
      const logoDataNew =
        (storeForm && storeForm.dataset && storeForm.dataset.logoData) ||
        (document.getElementById("storeLogoData") &&
          document.getElementById("storeLogoData").value) ||
        "";
      const newStore = {
        id: Date.now(),
        name,
        phone,
        location,
        logo: logoDataNew,
        mapUrl:
          (document.getElementById("storeMapUrl") &&
            document.getElementById("storeMapUrl").value.trim()) ||
          "",
      };
      stores.push(newStore);
    }

    setStores(stores);
    closeStoreModal();
    renderStores(); // تحديث القائمة المعروضة
    showToast("✅ تم حفظ المتجر بنجاح.", 3000, "green"); // No-op placeholder
  } catch (e) {
    console.error("خطأ أثناء حفظ المتجر:", e);
    showToast("❌ حدث خطأ أثناء الحفظ.", 4000, "red");
  }
}

// حذف/إفراغ صورة المتجر المؤقتة في المودال (لا يحذف الصورة من البيانات المحفوظة إلا بعد الحفظ)
function deleteStoreLogo() {
  try {
    const logoField = document.getElementById("storeLogoData");
    if (logoField) logoField.value = "";
    if (storeForm) delete storeForm.dataset.logoData;
    if (storeLogoInput) storeLogoInput.value = "";
    if (storeLogoFake) storeLogoFake.value = "";
    if (storeLogoPreview) storeLogoPreview.src = "";
    try {
      document.getElementById("storeLogoPreviewWrap").style.display = "none";
    } catch (err) {}
    if (removeStoreLogoBtn) removeStoreLogoBtn.classList.add("hidden");

    // If currently editing an existing store, remove the logo from storage immediately
    try {
      const editingId =
        storeForm && storeForm.dataset && storeForm.dataset.editingId;
      if (editingId) {
        const id = parseInt(editingId);
        let stores = getStores();
        const idx = stores.findIndex((s) => s.id === id);
        if (idx !== -1) {
          stores[idx] = { ...stores[idx], logo: "" };
          // Persist changes: setStores will save only modified stores
          setStores(stores);
          // Update the displayed list immediately
          renderStores();
          showToast("✅ تم حذف الصورة من بيانات المتجر.", 3000, "green");
          return;
        }
      }
    } catch (err) {
      console.warn("Immediate logo deletion failed:", err && err.message);
    }

    // Fallback: inform user local removal succeeded and advise to save
    showToast(
      "✅ تمت إزالة الصورة محليًا. احفظ المتجر لتطبيق التغييرات.",
      3000,
      "green",
    );
  } catch (err) {
    console.warn("deleteStoreLogo failed:", err && err.message);
  }
}

// 💡 ملاحظة: يجب أن تكون لديك دالة getInvoices() لاسترجاع الفواتير
function getInvoices() {
  return JSON.parse(localStorage.getItem("invoices")) || [];
}

/**
 * تحسب المبلغ المتبقي الإجمالي (المديونية) لمتجر معين.
 * @param {number} storeId - معرّف المتجر المراد حساب مديونيته.
 * @returns {number} إجمالي المبلغ المتبقي بالليرة السورية.
 */
function calculateStoreDebt(storeId) {
  try {
    const allInvoices = getInvoices();
    let totalDebt = 0;

    const storeInvoices = allInvoices.filter((inv) => inv.posId === storeId);

    storeInvoices.forEach((invoice) => {
      const remaining = (invoice.payment && invoice.payment.remainingSYP) || 0;
      totalDebt += Number(remaining) || 0;
    });

    return totalDebt;
  } catch (error) {
    console.error("Error calculating store debt:", error);
    return 0;
  }
}

// 💡 تذكر أن دالة getStores() و setStores(stores) تم تعريفها مسبقاً

// ======================================================
// 🔍 دالة البحث (مطلوبة من حقل البحث في HTML)
// ======================================================
function searchStores() {
  const searchInput = document.getElementById("storeSearchInput");
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
  renderStores(searchTerm);
}

function renderStores(searchTerm = "") {
  const storesContainer = document.getElementById("storesContainer");
  if (!storesContainer) return;

  const stores = getStores();
  storesContainer.innerHTML = ""; // مسح المحتوى القديم

  if (stores.length === 0) {
    storesContainer.innerHTML =
      '<p class="empty-list-msg">لا يوجد نقاط بيع مُضافة حالياً.</p>';
    return;
  }

  // فلترة المتاجر بناءً على مصطلح البحث
  const filteredStores = stores.filter((store) => {
    if (!searchTerm) return true; // لا فلترة إذا كان الحقل فارغاً

    const totalDebt = calculateStoreDebt(store.id);

    // البحث في جميع الحقول النصية
    const searchableText = [
      store.name || "",
      store.phone || "",
      store.location || "",
      totalDebt.toString(),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });

  // التحقق من النتائج بعد الفلترة
  if (filteredStores.length === 0) {
    storesContainer.innerHTML =
      '<p class="empty-list-msg">لا يوجد نتائج تطابق معيار البحث.</p>';
    return;
  }

  // عرض المتاجر المفلترة
  filteredStores.forEach((store) => {
    const totalDebt = calculateStoreDebt(store.id);
    const storeCard = document.createElement("div");
    storeCard.className = "store-card";
    storeCard.setAttribute("onclick", `showStoreActions(${store.id})`);

    let hasLogo = store.logo === "" ? false : true;

    const topCardStyle = hasLogo
      ? "display: flex; justify-content: space-around; align-items: center; width: 100%;"
      : "";

    storeCard.innerHTML = `
        <div class="top-store-card" style="${topCardStyle}">
            <h2>${store.name || "بدون اسم"}</h2>
            ${hasLogo ? `<img src="${store.logo}" alt="store logo">` : ""}
            </div>
            
            <div class="bottom-store-card">
                <div class="store-details">
                    <p><strong> <i class="fa fa-phone"></i> الهاتف :</strong> ${
                      store.phone || "غير محدد"
                    }</p>
                    ${
                      store.mapUrl
                        ? `<p>
                        <a href="${
                          store.mapUrl
                        }" target="_blank" rel="noopener"  class="store-location-link" title="افتح في خرائط Google">
                          <i class="fa fa-map-marker"></i>
                          <strong style="text-decoration: underline;"> الموقع :
                          ${store.location || "غير محدد"} </strong>
                          <i class='fa fa-external-link store-location-icon' aria-hidden='true'></i></a></p>`
                        : `<p><strong> <i class="fa fa-map-marker"></i> الموقع :</strong> ${
                            store.location || "غير محدد"
                          }</p>`
                    }
                    ${
                      isAdmin()
                        ? `<p class="store-debt-info">
                        <strong> <i class="fa fa-money"></i> المديونية المتبقية :</strong> 
                        <span class="${
                          totalDebt > 0 ? "debt-due" : "debt-clear"
                        }">
                            ${totalDebt.toLocaleString()} ل.س
                        </span>
                    </p>`
                        : ""
                    }
                    
                </div>
            </div>
            
            <div class="store-actions-overlay hidden" data-store-id="${
              store.id
            }" 
                 onclick="event.stopPropagation(); hideStoreActions(${
                   store.id
                 })">
                
                <button class="close-overlay-btn" onclick="hideStoreActions(${
                  store.id
                })">&times;</button>

                <button class="action-btn add-invoice" onclick="openInvoiceForStore(${
                  store.id
                })">
                    <i class="fa fa-plus-circle"></i> إضافة فاتورة
                </button>
                <button class="action-btn view-invoices" onclick="filterInvoicesByStore(${
                  store.id
                })">
                    <i class="fa fa-list-alt"></i> عرض الفواتير
                </button>
                <button class="action-btn edit-store" onclick="editStore(${
                  store.id
                })">
                    <i class="fa fa-pencil"></i> تعديل
                </button>
            </div>
        `;

    // If a map URL exists, ensure the link doesn't trigger the card click
    if (store.mapUrl) {
      // attach listener after innerHTML assignment so stopPropagation works reliably
      const link = storeCard.querySelector(".store-location-link");
      if (link) {
        link.addEventListener("click", function (e) {
          e.stopPropagation();
          // allow default action (opening link) to proceed
        });
      }
    }

    storesContainer.appendChild(storeCard);
  });
}

/**
 * تفتح مودال المتجر لغرض التعديل.
 * @param {number} storeId - معرّف المتجر.
 */
function editStore(storeId) {
  const stores = getStores();
  const storeToEdit = stores.find((s) => s.id === storeId);

  if (storeToEdit) {
    // دالة openStoreModal تتولى تعبئة الحقول ووضع storeId في dataset.editingId
    openStoreModal(storeToEdit);
  } else {
    showToast("❌ لم يتم العثور على المتجر للتعديل.", 3000, "orange");
  }
}

// ----------------------------------------------------------------------
// 4. دوال الحذف والبحث (مطلوبة للواجهة التفاعلية)
// ----------------------------------------------------------------------

// لفتح نافذة تأكيد حذف المتجر
function showStoreDeleteConfirm() {
  document.getElementById("storeConfirmOverlay").classList.remove("hidden");
  document.getElementById("storeConfirmModal").classList.remove("hidden");
}

// لإلغاء الحذف
function cancelStoreDelete() {
  document.getElementById("storeConfirmOverlay").classList.add("hidden");
  document.getElementById("storeConfirmModal").classList.add("hidden");
}

// لتنفيذ عملية الحذف
function confirmStoreDelete() {
  const stores = getStores();
  const storeIdToDelete = parseInt(storeForm.dataset.editingId);

  // فلترة المتاجر لإزالة المتجر المراد حذفه
  const updatedStores = stores.filter((s) => s.id !== storeIdToDelete);

  setStores(updatedStores);
  cancelStoreDelete();
  closeStoreModal();
  renderStores(); // إعادة عرض القائمة
}

const scrollTopBtn = document.getElementById("scrollTopBtn"); // زر العودة للأعلى

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("scroll", () => {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
    scrollBtn.classList.remove("hide");
  } else {
    scrollBtn.classList.remove("show");
    scrollBtn.classList.add("hide");
    setTimeout(() => scrollBtn.classList.remove("hide"), 300);
  }
});

/**
 * إظهار أوفرلاي الإجراءات الخاصة بالكارد
 * @param {number} storeId - معرّف المتجر
 */
function showStoreActions(storeId) {
  if (isAdmin()) {
    // إخفاء أي أوفرلاي آخر مفتوح حالياً (إذا كنت تريد فتح واحد فقط في كل مرة)
    document.querySelectorAll(".store-actions-overlay").forEach((overlay) => {
      overlay.classList.add("hidden");
    });

    // إظهار الأوفرلاي المطلوب
    const overlay = document.querySelector(
      `.store-actions-overlay[data-store-id="${storeId}"]`,
    );
    if (overlay) {
      overlay.classList.remove("hidden");
    }
  }
}

/**
 * إخفاء أوفرلاي الإجراءات
 * @param {number} storeId - معرّف المتجر
 */
function hideStoreActions(storeId) {
  const overlay = document.querySelector(
    `.store-actions-overlay[data-store-id="${storeId}"]`,
  );
  if (overlay) {
    // نستخدم stopPropagation في HTML لمنع النقر على الأوفرلاي من إخفائه
    overlay.classList.add("hidden");
  }
}

// ----------------------------------------------------------------------
// 5. دوال الانتقال لصفحة الفواتير (إضافة/عرض)
// ----------------------------------------------------------------------

/**
 * تجهز للانتقال إلى صفحة الفواتير لغرض إنشاء فاتورة جديدة مرتبطة بهذا المتجر.
 * @param {number} storeId - معرّف المتجر.
 */
function openInvoiceForStore(storeId) {
  // بناء رابط URL: action=add (لفتح المودال) و storeId (لتحديد المتجر)
  const url = `invoices.html?action=add&storeId=${storeId}`;

  // الانتقال إلى صفحة الفواتير
  window.location.href = url;
}

/**
 * تجهز للانتقال إلى صفحة الفواتير لغرض تصفية الفواتير وعرض فواتير هذا المتجر فقط.
 * @param {number} storeId - معرّف المتجر. 👈 تم تغيير نوع المدخل
 */
function filterInvoicesByStore(storeId) {
  // بناء رابط URL: action=filter و storeId (الذي يجب أن يكون رقمياً)
  // 💡 الآن نرسل ID المتجر
  const url = `invoices.html?action=filter&storeId=${storeId}`;

  // الانتقال إلى صفحة الفواتير
  window.location.href = url;
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addStoreBtn");
  const scrollBtn = document.getElementById("scrollTopBtn");
  const invoicesLink = document.getElementById("invoicesLink");

  // التحقق يتم بواسطة الدالة isAdmin() الموجودة في utility.js
  if (!isAdmin()) {
    addBtn.style.display = "none"; // إذا لم يكن مديراً، يتم إخفاء الزر
    scrollBtn.style.left = "20px";
    scrollBtn.style.bottom = "20px";
    invoicesLink.style.display = "none"; // إذا لم يكن مديراً، يتم إخفاء الزر
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // ... الكود الأساسي ...

  // 💡 إخفاء أو إظهار زر الإضافة بناءً على الصلاحية
  const invoicesLink = document.getElementById("invoicesLink");
  const dividers = document.getElementById("firstDivider");

  // التحقق يتم بواسطة الدالة isAdmin() الموجودة في utility.js
  if (isAdmin()) {
  } else {
    invoicesLink.style.display = "none"; // إذا لم يكن مديراً، يتم إخفاء الزر
    dividers.style.display = "none";
  }

  // ... باقي الكود ...
});
