let importantCats = ["all"];
let otherCats = [];
let filteredProducts = [];
let loadedCount = 0;
const itemsPerLoad = 15; // عدد المنتجات التي تُعرض كل مرة
let searchQuery = "";
const scrollTopBtn = document.getElementById("scrollTopBtn"); // زر العودة للأعلى
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

function showCat() {
  finalBaseProducts.forEach((product) => {
    // (تعديل جديد) تجاهل المنتج المخصص عند بناء قوائم التصنيفات
    if (product.isCustomOrder) return;

    const firstCat = product.categories[0];
    if (!importantCats.includes(firstCat) && firstCat != undefined) {
      importantCats.push(firstCat);
    }
    for (let i = 1; i < product.categories.length; i++) {
      const otherCategory = product.categories[i];
      if (
        !otherCats.includes(otherCategory) &&
        !importantCats.includes(otherCategory)
      ) {
        otherCats.push(otherCategory);
      }
    }
  });

  const importantCatDiv = document.getElementById("importantCats");
  let importantHTML = "";

  importantCats.forEach((cat) => {
    importantHTML += `
            <button onclick="filterProducts('${cat}')" id="${cat}">${
      cat === "all" ? "الكل" : cat
    }</button>
            <div class="cats-divider" role="separator" aria-orientation="vertical" ></div>
        `;
  });

  importantCatDiv.innerHTML = importantHTML;

  const dropDown = document.getElementById("otherCat");
  let otherHTML = `<option value="Other" selected>أخرى</option>`;

  otherCats.forEach((cat) => {
    otherHTML += `
            <option value="${cat}">${cat}</option>
        `;
  });

  dropDown.innerHTML = otherHTML;

  let btn = document.getElementById("all");
  btn.classList.add("active-cat");
}

function filterProducts(category, fromSelect = false) {
  // 1. (تعديل جديد) استخراج المنتج المخصص
  const customProduct = finalBaseProducts.find(
    (product) => product.isCustomOrder
  );

  // إعادة العد عند تغيير التصنيف
  loadedCount = 0;

  if (category === "all" || category === "Other") {
    filteredProducts = finalBaseProducts.filter(
      (product) => !product.isCustomOrder
    );
  } else {
    filteredProducts = finalBaseProducts.filter(
      (product) =>
        product.categories.includes(category) && !product.isCustomOrder // نستثني المنتج المخصص من الفلترة حسب التصنيف
    );
  }

  // 2. (تعديل جديد) إعادة دمج المنتج المخصص في البداية
  // سيتم إضافته دائماً إذا كان موجوداً، بغض النظر عن نتيجة الفلترة
  if (customProduct) {
    filteredProducts.unshift(customProduct);
  }

  importantCats.forEach((cat) => {
    let btn = document.getElementById(cat);
    if (btn) {
      if (category === "Other") {
        // اجعل زر "all" نشط عند اختيار "Other"
        if (cat === "all") btn.classList.add("active-cat");
        else btn.classList.remove("active-cat");
      } else {
        // المنطق العادي
        if (cat == category) btn.classList.add("active-cat");
        else btn.classList.remove("active-cat");
      }
    }
  });

  // فقط عندما لا يكون من القائمة المنسدلة نعيدها لقيمة "Other"
  if (!fromSelect) {
    const sel = document.getElementById("otherCat");
    if (sel) sel.value = "Other";
  }

  // حالة select (active)
  const dropDown = document.getElementById("otherCat");
  if (dropDown) {
    if (category === "Other" || importantCats.includes(category)) {
      dropDown.classList.remove("active-cat");
    } else {
      dropDown.classList.add("active-cat");
    }
  }

  // إعادة عرض المنتجات من البداية
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  // إعادة اظهار الزر وتمكينه في حال وجود منتجات كافية
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const productsInfo = document.getElementById("productsInfo");
  if (!loadMoreBtn || !productsInfo) {
    // لو عناصر ال DOM غير موجودة، نخرج مبكراً
    loadMoreProducts();
    return;
  }

  if (filteredProducts.length === 0) {
    // لا منتجات
    loadMoreBtn.style.display = "none";
    productsInfo.textContent = "لا توجد منتجات";
    return;
  }

  // أظهر الزر إذا كان هناك منتجات تُعرض لاحقاً
  loadMoreBtn.style.display = "inline-block";
  loadMoreBtn.disabled = false;
  productsInfo.textContent = `تم عرض 0 من أصل ${filteredProducts.length} منتج`;

  // حمل أول دفعة
  loadMoreProducts();
}

function loadMoreProducts() {
  const productsDiv = document.getElementById("products");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const productsInfo = document.getElementById("productsInfo");

  // تأكد أن المتغيرات موجودة
  if (!productsDiv || !loadMoreBtn || !productsInfo) return;

  // جلب المنتجات التالية
  const nextProducts = filteredProducts.slice(
    loadedCount,
    loadedCount + itemsPerLoad
  );

  // لو لا توجد منتجات على الإطلاق
  if (nextProducts.length === 0) {
    // إذا لم يكن هناك شيء للعرض (مثلاً عدد المنتجات أقل من 1)
    if (loadedCount === 0) {
      productsInfo.textContent = "لا توجد منتجات";
    }
    loadMoreBtn.style.display = "none";
    return;
  }

  // أثناء التحميل: إظهار مؤشر بسيط داخل الزر (اختياري)
  const originalBtnHTML = loadMoreBtn.innerHTML;
  loadMoreBtn.disabled = true;
  loadMoreBtn.innerHTML = "جارٍ التحميل...";

  nextProducts.forEach((product, index) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    // 🔧 أضف هذا الشرط هنا:
    if (product.isCustomOrder) {
      card.classList.add("custom-product-card");
    }

    // استخدام الدالة الجديدة لتفعيل المنتج
    card.setAttribute("onclick", "activateProductCard(this)");

    const isSingleImage = product.images.length === 1;
    const dotsContainerClass = isSingleImage
      ? "dots-container single-dot"
      : "dots-container";

    card.innerHTML = `
        <div class="slider-container" 
             onmouseover="${
               !isSingleImage ? `startAutoSlideForProduct(this)` : ""
             }" 
             onmouseout="${
               !isSingleImage ? `stopAutoSlideForProduct(this)` : ""
             }">
            <div class="slider">
                ${product.images
                  .map(
                    (imgSrc, index) => `
                    <div class="slide"><img src="${imgSrc}" alt="Image ${
                      index + 1
                    }" loading="lazy"></div>
                `
                  )
                  .join("")}
            </div>
            ${
              !isSingleImage
                ? `
                <button class="prev" onclick="event.stopPropagation(); prevSlide(this)">&#10095;</button>
                <button class="next" onclick="event.stopPropagation(); nextSlide(this)">&#10094;</button>
            `
                : ""
            }
        </div>
        <div class="${dotsContainerClass}">
            ${product.images
              .map(
                (imgSrc, index) => `
                <span class="dot" data-index="${index}" 
                    ${
                      !isSingleImage
                        ? `onclick="event.stopPropagation(); stopAutoSlideForProduct(this.parentElement.previousElementSibling); showSlides(this.parentElement.previousElementSibling, ${index})"`
                        : ""
                    }>
                </span>
            `
              )
              .join("")}
        </div>
        <div class="product-card-bottom">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.shortDisc || ""}</p>
            </div>
            <button class="product-button gradient-text" onclick="event.stopPropagation(); showModal('${
              product.id
            }')">
                <i class="fa fa-cart-plus gradient-icon"></i>
            </button>
        </div>
    `;
    productsDiv.appendChild(card);

    if (!isSingleImage) {
      initializeSlider(card);
    }

    setTimeout(() => card.classList.add("show"), 100 * index);
  });

  // تمرير تلقائي لأول منتج جديد
  setTimeout(() => {
    const firstNew = document.querySelectorAll(".product-card")[loadedCount];
    if (firstNew)
      firstNew.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 600);

  loadedCount += nextProducts.length;

  // تحديث النص السفلي
  productsInfo.textContent = `تم عرض ${loadedCount} من أصل ${filteredProducts.length} منتج`;

  // إعادة الزر إلى حالته العادية
  loadMoreBtn.innerHTML = originalBtnHTML;
  loadMoreBtn.disabled = false;

  // إخفاء الزر عند الانتهاء
  if (loadedCount >= filteredProducts.length) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.style.display = "none";
    productsInfo.textContent = "✅ تم عرض جميع المنتجات";
  }
}

function addActiveCard(card) {
  document
    .querySelectorAll(".product-card")
    .forEach((c) => c.classList.remove("active-card"));
  card.classList.toggle("active-card");
}

function showModal(id) {
  const product = finalBaseProducts.find((r) => r.id == id);
  const modelContent = document.getElementById("modalContent");

  // ----------------------------------------------------------------------------------
  // 💡 (تعديل جديد) منطق عرض المودال للمنتج المخصص 💡
  // ----------------------------------------------------------------------------------
  if (product.isCustomOrder) {
    modelContent.innerHTML = `
            <button class="close-modal-btn" onclick="closeModal()">
                <i class="fa fa-times"></i> 
            </button>
            <div class="container">
                <h2 style="color:#007bff;">${product.name}</h2>
                <p style="text-align:center; margin-bottom: 20px;">${product.shortDisc}</p>
                <img src="./${product.images[0]}" alt="${product.name}" style="max-width: 150px; margin-bottom: 15px;" loading="lazy">
                
                <div style="background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 12px; border-radius: 5px; margin-bottom: 15px; font-weight: bold; text-align: center;">
                    ⚠️ السعر سيتحدد لاحقاً بعد تقييم الطلب
                </div>
                
                <label for="customDescInput" style="font-weight: bold; margin-bottom: 5px; display: block;">وصف المنتج والقياسات المطلوبة:</label>
                <textarea id="customDescInput" rows="4" placeholder="مثال: مقاس A4 - لون أحمر - طباعة ملونة - سمك 3 ملم - تصميم شعار الشركة - 100 قطعة&#10;أو: علبة سماعات بحجم مخصص - لون ذهبي مطفي - مع تصميم داخلي&#10;أو: ستاند هاتف - قياس يناسب الآيفون 13 - لون أسود لامع" style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
                
                <input type="number" id="customQuantity" placeholder="الكمية المطلوبة" value="1" min="1" required style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px;" />
                
                <button onClick="addToCart('${id}')" style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">إرسال طلب التخصيص</button>
            </div>
        `;
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("overlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";

    return; // إنهاء الدالة هنا للمنتج المخصص
  }

  // -----------------------------------------------------
  // 💡 1. منطق التحقق من قاعدة الستيكرات 💡
  // -----------------------------------------------------
  let stickerWarningHTML = "";

  // التحقق: إذا كان المنتج موجوداً ويحتوي على تصنيفات، والتصنيف الأول فيه كلمة 'ستيكر'
  if (
    product.categories &&
    product.categories.length > 0 &&
    product.categories[0] == "ستيكر"
  ) {
    stickerWarningHTML = `
            <div class="sticker-warning-alert" style="background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-weight: bold; text-align: center;">
            🔔 يجب طلب 3 ستيكرات على الأقل من أي نوع إذا كانت طلبيتك ستيكرات فقط.
            </div>
        `;
  }
  // -----------------------------------------------------

  // عرض الألوان كدوائر
  let colorsHTML = "";
  if (product.colors && product.colors.length > 0) {
    colorsHTML = `<div class="color-container" id="colorContainer" style="display:flex; gap:10px; align-items:center; flex-wrap: wrap;">
                ${product.colors
                  .filter((c) => c.code)
                  .map(
                    (c) => `
                    <div class="color-circle" title="${c.name}" onclick="selectColor(this, '${id}', '${c.name}', '${c.code}')" style="width:28px; height:28px; border-radius:50%; background:${c.code}; cursor:pointer; box-shadow:0 2px 6px #0001;"></div>
                `
                  )
                  .join("")}
            </div>`;
  }

  modelContent.innerHTML = `
        <button class="close-modal-btn" onclick="closeModal()">
            <i class="fa fa-times"></i> 
        </button>

                <div class="container">
                <div style="display:flex; flex-direction:column; justify-content:space-between; align-items:center;">
                <div>
                        <h2>${product.name}</h2>
                        <img src="./${product.images[0]}" alt="${product.name}">
                        </div>
                        <h3>${product.price} ل.س</h3>
                        </div>
                        ${colorsHTML}
                        <input type="number" id="pQ" placeholder="الكمية" required>
                        <textarea id="productNote" placeholder="ملاحظة (اختياري)" style="width:100%; margin-top:8px; min-height:48px; padding:8px; border:1px solid #ccc; border-radius:4px;"></textarea>
                        ${stickerWarningHTML}
                        
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; width: 100%;">
                            <input type="checkbox" id="customizationCheckbox" style="width: 20px; height: 20px; cursor: pointer;" />
                            <label for="customizationCheckbox" style="font-weight: bold; cursor: pointer; margin: 0;">إضافة تخصيص للمنتج</label>
                        </div>
                        
                        <div id="customizationWarning" style="display: none; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 12px; border-radius: 5px; margin-bottom: 15px; font-weight: bold; text-align: center;">
                            ⚠️ السعر سيتحدد لاحقاً بعد تقييم طلب التخصيص
                        </div>
                        
                        <div id="customizationSection" style="display: none; width: 100%;">
                            <label for="productCustomDesc" style="font-weight: bold; margin-bottom: 5px; display: block;">وصف التخصيص:</label>
                            <textarea id="productCustomDesc" rows="3" placeholder="مثال: إضافة شعار الشركة - تغيير اللون - حفر بأحرف ذهبية - إلخ." style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
                        </div>
                        
                        <button onClick="addToCart('${id}')" style="width: 100%;">أضف للسلة</button>
                </div>
        `;

  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // إضافة event listener للـ checkbox الجديد
  document
    .getElementById("customizationCheckbox")
    .addEventListener("change", function () {
      const customizationWarning = document.getElementById(
        "customizationWarning"
      );
      const customizationSection = document.getElementById(
        "customizationSection"
      );
      if (this.checked) {
        customizationWarning.style.display = "block";
        customizationSection.style.display = "block";
      } else {
        customizationWarning.style.display = "none";
        customizationSection.style.display = "none";
      }
    });
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("overlay").classList.add("hidden");
  document.body.style.overflow = "";
}

function selectColor(clickedElement, productId, colorName, colorCode) {
  // 1. البحث عن المنتج (للتأكد فقط)
  const product = finalBaseProducts.find((p) => p.id == productId);
  if (!product) return;

  const colorContainer = document.getElementById("colorContainer");

  // 2. تخزين اللون المختار في dataset
  colorContainer.dataset.selectedColor = JSON.stringify({
    name: colorName,
    code: colorCode,
  });

  // 3. إلغاء التمييز عن جميع دوائر الألوان
  // البحث عن جميع العناصر وإزالة الفئة النشطة منها
  const colorOptions = document.querySelectorAll(".color-circle");
  colorOptions.forEach((opt) => {
    opt.classList.remove("active-color");
  });

  // 4. تمييز العنصر المضغوط عليه مباشرةً
  clickedElement.classList.add("active-color");

  // 5. تعبئة الكمية والتركيز
  const qInput = document.getElementById("pQ");
  qInput.value = "1";
  qInput.focus();
}

function addToCart(productId) {
  const product = finalBaseProducts.find((p) => p.id == productId);

  // ----------------------------------------------------------------------------------
  // 💡 (تعديل جديد) معالجة المنتج المخصص 💡
  // ----------------------------------------------------------------------------------
  if (product.isCustomOrder) {
    const customDescInput = document.getElementById("customDescInput");
    const customQuantityInput = document.getElementById("customQuantity");
    const customDescription = customDescInput.value.trim();
    const customQuantity = parseInt(customQuantityInput.value) || 1;

    if (customDescription === "") {
      showToast("⚠️ يرجى كتابة وصف لطلبك المخصص", 3000, "#d32f2f");
      return;
    }

    // إضافة الطلب المخصص كعنصر جديد
    cartItems.push({
      id: Date.now(),
      productId: product.id, // ID المنتج الوهمي
      quantity: customQuantity, // الكمية المدخلة من المستخدم
      customDescription: customDescription, // حفظ الوصف هنا
      isCustom: true, // علامة مميزة للعرض في السلة
      selectedColor: { name: "طلب مخصص", code: "" }, // بيانات وهمية لحقول الألوان
    });

    // حفظ في localStorage وإظهار التوست
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    closeModal();
    showToast(`✔️ تم اضافة طلبك المخصص الى السلة.!`);
    console.log("✅ تم إضافة طلب مخصص بنجاح.");
    return; // إنهاء الدالة
  }
  // ----------------------------------------------------------------------------------

  const qInput = document.getElementById("pQ");
  const colorContainer = document.getElementById("colorContainer");

  if (!product) {
    alert("⚠️ المنتج غير موجود");
    return;
  }

  const selectedColorData = colorContainer.dataset.selectedColor;
  if (!selectedColorData) {
    showToast("⚠️ يرجى اختيار لون للمنتج", 3000, "#d32f2f");
    return;
  }

  const quantity = parseInt(qInput.value) || 1;
  const selectedColor = JSON.parse(selectedColorData);

  // optional note from modal
  const note = document.getElementById("productNote")?.value.trim() || "";

  // هل المنتج بنفس اللون موجود مسبقًا؟
  const existingItem = cartItems.find(
    (item) =>
      item.productId === product.id &&
      item.selectedColor.code === selectedColor.code
  );

  if (existingItem) {
    existingItem.quantity += quantity; // زيادة الكمية
    if (note) existingItem.note = note; // حفظ الملاحظة إن وُجدت (تُحدث/تُستبدل)
  } else {
    cartItems.push({
      id: Date.now(),
      productId: product.id,
      quantity: quantity,
      selectedColor: selectedColor,
      note: note,
    });
  }

  // حفظ في localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // تنظيف الحقول
  delete colorContainer.dataset.selectedColor;
  qInput.value = "";
  const noteEl = document.getElementById("productNote");
  if (noteEl) noteEl.value = "";

  const colorSelector = document.querySelector(".color-selector");
  if (colorSelector) colorSelector.remove();

  closeModal();

  console.log(`✅ تمت إضافة ${product.name} إلى السلة بنجاح!`);
  showToast(`✅ تمت إضافة ${product.name} إلى السلة بنجاح!`);

  closeModal();
  // تحديث زر الفاب الخاص بالسلة
  try {
    updateCartFab();
  } catch (e) {
    /* ignore */
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cart FAB management: show/hide, update count and adjust scrollToTop position
function updateCartFab() {
  const cartFab = document.getElementById("cartFab");
  const cartCountEl = document.getElementById("cartFabCount");
  const scrollBtn = document.getElementById("scrollTopBtn");
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem("cartItems")) || [];
  } catch (e) {
    items = cartItems || [];
  }

  const count = Array.isArray(items)
    ? items.reduce((s, it) => s + (Number(it.quantity) || 0), 0)
    : 0;

  if (count > 0) {
    if (cartCountEl) cartCountEl.textContent = count;
    if (cartFab) cartFab.classList.remove("hidden");
    // place scrollTopBtn above the cart FAB
    if (scrollBtn) scrollBtn.style.bottom = 20 + 64 + 12 + "px";
  } else {
    if (cartFab) cartFab.classList.add("hidden");
    if (scrollBtn) scrollBtn.style.bottom = "20px";
  }
}

// initialize FAB state on load and listen for storage changes
window.addEventListener("DOMContentLoaded", () => {
  try {
    updateCartFab();
  } catch (e) {}
});

window.addEventListener("storage", (e) => {
  if (e.key === "cartItems") updateCartFab();
});

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

function searchProducts() {
  const input = document.getElementById("searchInput");
  searchQuery = input.value.trim().toLowerCase();

  // 1. (تعديل جديد) استخراج المنتج المخصص أولاً
  const customProduct = finalBaseProducts.find((p) => p.isCustomOrder);

  // إعادة ضبط المنتجات المحملة
  loadedCount = 0;
  document.getElementById("products").innerHTML = "";

  // تحديث filteredProducts بناء على البحث + التصنيف
  let category = document.getElementById("otherCat").value;
  if (category === "Other") category = "all";

  // 2. (تعديل) بناء القائمة الأساسية: استبعاد المنتج المخصص من البداية
  // فلترة المنتجات العادية فقط
  let baseList = finalBaseProducts.filter((p) => !p.isCustomOrder);

  // تطبيق فلترة التصنيف على القائمة الأساسية (بدون المنتج المخصص)
  if (category !== "all") {
    baseList = baseList.filter((p) => p.categories.includes(category));
  }

  // 3. تطبيق البحث على القائمة التي تم فلترتها حسب التصنيف
  if (searchQuery !== "") {
    filteredProducts = baseList.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        (p.shortDisc && p.shortDisc.toLowerCase().includes(searchQuery)) ||
        p.categories.some((cat) => cat.toLowerCase().includes(searchQuery))
    );
  } else {
    filteredProducts = baseList;
  }

  // 4. (تعديل جديد) إضافة المنتج المخصص إلى مقدمة النتائج
  if (customProduct) {
    filteredProducts.unshift(customProduct);
  }

  // إعادة تفعيل زر عرض المزيد
  const loadBtn = document.getElementById("loadMoreBtn");
  loadBtn.style.display = filteredProducts.length > 0 ? "block" : "none";
  loadBtn.disabled = false;

  // إعادة ضبط النص
  document.getElementById("productsInfo").textContent = "";

  // تحميل أول دفعة من النتائج
  loadMoreProducts();
}

// بدء التشغيل
window.onload = function () {
  filteredProducts = finalBaseProducts;
  showCat();
  loadMoreProducts();
};

// متغير لتتبع السلايدر النشط حاليًا
let activeSlider = null;

// دالة لبدء التمرير التلقائي لمنتج معين
function startAutoSlideForProduct(sliderContainer) {
  // إيقاف أي سلايدر نشط سابقًا
  if (activeSlider && activeSlider !== sliderContainer) {
    stopAutoSlide(activeSlider);
  }

  // بدء التمرير التلقائي للسلايدر الحالي
  startAutoSlide(sliderContainer);
  activeSlider = sliderContainer;
}

// دالة لإيقاف التمرير التلقائي لمنتج معين
function stopAutoSlideForProduct(sliderContainer) {
  stopAutoSlide(sliderContainer);
  if (activeSlider === sliderContainer) {
    activeSlider = null;
  }
}

// دالة لتفعيل كارد المنتج
function activateProductCard(card) {
  // إلغاء تفعيل جميع الكروت الأخرى
  document.querySelectorAll(".product-card").forEach((c) => {
    c.classList.remove("active-card");
    if (c !== card) {
      const otherSlider = c.querySelector(".slider-container");
      if (otherSlider) {
        stopAutoSlideForProduct(otherSlider);
      }
    }
  });

  // تفعيل الكارد الحالي
  card.classList.add("active-card");

  // بدء التمرير التلقائي إذا كان هناك أكثر من صورة
  const sliderContainer = card.querySelector(".slider-container");
  const slides = card.querySelectorAll(".slide");

  if (sliderContainer && slides.length > 1) {
    startAutoSlideForProduct(sliderContainer);
  }
}

// دالة لتهيئة كل سلايدر
function initializeSlider(card) {
  const sliderContainer = card.querySelector(".slider-container");
  const slider = sliderContainer.querySelector(".slider");
  const slides = sliderContainer.querySelectorAll(".slide");

  // التحقق من أن هناك أكثر من صورة قبل التهيئة
  if (slides.length <= 1) {
    return;
  }

  // حساب العرض الديناميكي بناءً على عدد الصور
  const slideCount = slides.length;
  slider.style.width = `${slideCount * 100}%`;

  // تعيين عرض كل شريحة بناءً على عدد الصور
  slides.forEach((slide) => {
    slide.style.minWidth = `${100 / slideCount}%`;
  });

  // حفظ البيانات في عنصر السلايدر
  slider.currentIndex = 0;
  slider.slideCount = slideCount;

  // تحديث النقاط الأولي
  updateDots(sliderContainer, 0);
}

// دالة لعرض شرائح محددة
function showSlides(sliderContainer, index) {
  const slider = sliderContainer.querySelector(".slider");
  const slides = sliderContainer.querySelectorAll(".slide");
  const slideCount = slider.slideCount || slides.length;

  let currentIndex = slider.currentIndex || 0;

  if (index >= slideCount) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = slideCount - 1;
  } else {
    currentIndex = index;
  }

  slider.currentIndex = currentIndex;

  // حساب النسبة المئوية بناءً على عدد الصور
  const translateXValue = currentIndex * (100 / slideCount);
  slider.style.transform = `translateX(${translateXValue}%)`;

  updateDots(sliderContainer, currentIndex);
}

// دالة للانتقال للصورة التالية
// دالة للانتقال للصورة التالية (معدلة)
function nextSlide(button) {
  const sliderContainer = button.parentElement;
  const slider = sliderContainer.querySelector(".slider");
  const slideCount =
    slider.slideCount || sliderContainer.querySelectorAll(".slide").length;

  if (slideCount <= 1) return;

  let currentIndex = slider.currentIndex || 0;
  currentIndex = (currentIndex - 1 + slideCount) % slideCount;

  console.log("➡️ الانتقال للصورة:", currentIndex);
  showSlides(sliderContainer, currentIndex);
}

// دالة للانتقال للصورة السابقة (معدلة)
function prevSlide(button) {
  const sliderContainer = button.parentElement;
  const slider = sliderContainer.querySelector(".slider");
  const slideCount =
    slider.slideCount || sliderContainer.querySelectorAll(".slide").length;

  if (slideCount <= 1) return;

  let currentIndex = slider.currentIndex || 0;
  currentIndex = (currentIndex + 1) % slideCount;

  console.log("⬅️ الانتقال للصورة:", currentIndex);
  showSlides(sliderContainer, currentIndex);
}

// دالة لتحديث النقاط
function updateDots(sliderContainer, currentIndex) {
  const dotsContainer = sliderContainer.nextElementSibling;
  const dots = dotsContainer.querySelectorAll(".dot");

  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

// دالة لبدء التمرير التلقائي (معدلة)
function startAutoSlide(sliderContainer) {
  const slider = sliderContainer.querySelector(".slider");
  const slideCount =
    slider.slideCount || sliderContainer.querySelectorAll(".slide").length;

  if (slideCount <= 1) {
    console.log("❌ صورة واحدة فقط - لا داعي للتمرير التلقائي");
    return;
  }

  // تأكد من إلغاء أي فاصل زمني سابق
  if (slider.autoSlideInterval) {
    clearInterval(slider.autoSlideInterval);
    slider.autoSlideInterval = null;
  }

  console.log("🔄 بدء التمرير التلقائي...");

  slider.autoSlideInterval = setInterval(() => {
    const nextBtn = sliderContainer.querySelector(".next");
    if (nextBtn) {
      console.log("⏩ التمرير التلقائي للصورة التالية");
      nextSlide(nextBtn);
    }
  }, 4000);
}

// دالة لإيقاف التمرير التلقائي (معدلة)
function stopAutoSlide(sliderContainer) {
  const slider = sliderContainer.querySelector(".slider");
  if (slider.autoSlideInterval) {
    console.log("⏹️ إيقاف التمرير التلقائي");
    clearInterval(slider.autoSlideInterval);
    slider.autoSlideInterval = null;
  }
}

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

let currentAdIndex = 0;
let adAutoSlideInterval = null;

function showAds() {
  const adDiv = document.getElementById("adSlider");
  if (!adDiv) return;

  adDiv.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "ad-slider-wrapper";

  // إضافة الإعلانات
  ads.forEach((ad, index) => {
    const slide = document.createElement("div");
    slide.className = `ad-slide ${index === currentAdIndex ? "active" : ""}`;
    slide.dataset.index = index;

    const content = ad.link
      ? `<a href="${ad.link}" target="_blank" class="ad-link">
                <img src="${ad.image}" alt="إعلان ${index + 1}" loading="lazy">
            </a>`
      : `<div class="ad-no-link">
                <img src="${ad.image}" alt="إعلان ${index + 1}" loading="lazy">
            </div>`;

    slide.innerHTML = content;
    wrapper.appendChild(slide);
  });

  // إضافة الأزرار إذا كان هناك أكثر من إعلان
  if (ads.length > 1) {
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "ad-dots-container";

    ads.forEach((ad, index) => {
      const dot = document.createElement("span");
      dot.className = `ad-dot ${index === currentAdIndex ? "active" : ""}`;
      dot.dataset.index = index;
      dot.onclick = () => {
        currentAdIndex = index;
        showAds();
        resetAdAutoSlide();
      };
      dotsContainer.appendChild(dot);
    });

    wrapper.appendChild(dotsContainer);

    // بدء التمرير التلقائي
    startAdAutoSlide();
  }

  adDiv.appendChild(wrapper);
}

// الانتقال لإعلان محدد
function goToAd(index) {
  if (index < 0 || index >= ads.length) return;

  currentAdIndex = index;
  showAds();
  resetAdAutoSlide();
}

// بدء التمرير التلقائي بين الإعلانات
function startAdAutoSlide() {
  if (adAutoSlideInterval) clearInterval(adAutoSlideInterval);

  adAutoSlideInterval = setInterval(() => {
    currentAdIndex = (currentAdIndex + 1) % ads.length;
    showAds();
  }, 5000);
}

// إعادة ضبط المؤقت
function resetAdAutoSlide() {
  if (adAutoSlideInterval) {
    clearInterval(adAutoSlideInterval);
    startAdAutoSlide();
  }
}

// إيقاف التمرير التلقائي (عند التمرير فوق الإعلان)
function stopAutoAdSlide() {
  if (adAutoSlideInterval) {
    clearInterval(adAutoSlideInterval);
    adAutoSlideInterval = null;
  }
}

// عند التحميل
window.addEventListener("DOMContentLoaded", () => {
  showAds();
});

// عند التمرير فوق الإعلان (إيقاف التمرير التلقائي)
document.addEventListener("DOMContentLoaded", () => {
  showAds();

  const adSection = document.getElementById("adSection");
  if (adSection) {
    adSection.addEventListener("mouseenter", stopAutoAdSlide);
    adSection.addEventListener("mouseleave", startAdAutoSlide);
  }
});
