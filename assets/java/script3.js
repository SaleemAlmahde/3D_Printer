// ======================================================
// 🛒 تحميل بيانات السلة من localStorage
// ======================================================
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let appliedCoupon = null; // لتتبع الكوبون المستخدم

/* ======================================================
     حفظ واسترجاع معلومات العميل (باستثناء التاريخ والملاحظات)
     المفتاح في localStorage: `savedCustomerInfo`
     يحفظ: customerName, customerPhone, customerCity, shippingType, shippingDetails
     ====================================================== */
function loadSavedCustomerInfo() {
  try {
    const raw = localStorage.getItem("savedCustomerInfo");
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data) return;

    const nameEl = document.getElementById("customerName");
    const phoneEl = document.getElementById("customerPhone");
    const cityEl = document.getElementById("customerCity");
    const shippingTypeEl = document.getElementById("shippingType");
    const shippingDetailsEl = document.getElementById("shippingDetails");

    if (nameEl && data.name) nameEl.value = data.name;
    if (phoneEl && data.phone) phoneEl.value = data.phone;
    if (cityEl && data.city) cityEl.value = data.city;
    if (shippingTypeEl && data.shippingType)
      shippingTypeEl.value = data.shippingType;
    if (shippingDetailsEl && data.shippingDetails)
      shippingDetailsEl.value = data.shippingDetails;
    // If there's a helper to adjust placeholder/fields based on shipping type, call it
    try {
      if (typeof updateShippingPlaceholder === "function")
        updateShippingPlaceholder();
    } catch (e) {}
  } catch (e) {
    console.warn("Could not load saved customer info:", e);
  }
}

function saveCustomerInfo() {
  try {
    const name = (document.getElementById("customerName") || {}).value || "";
    const phone = (document.getElementById("customerPhone") || {}).value || "";
    const city = (document.getElementById("customerCity") || {}).value || "";
    const shippingType =
      (document.getElementById("shippingType") || {}).value || "";
    const shippingDetails =
      (document.getElementById("shippingDetails") || {}).value || "";

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      shippingType: shippingType,
      shippingDetails: shippingDetails.trim(),
    };

    localStorage.setItem("savedCustomerInfo", JSON.stringify(payload));
  } catch (e) {
    console.warn("Could not save customer info:", e);
  }
}

// ======================================================
// 🧩 عرض المنتجات في السلة
// ======================================================
function displayCartItems() {
  const container = document.getElementById("productsCart");
  container.innerHTML = "";

  if (cartItems.length === 0) {
    container.innerHTML = `<p style="text-align:center; font-size:18px; margin-top:30px;">🛍️ السلة فارغة حاليًا</p>`;
    return;
  }

  cartItems.forEach((item) => {
    const product = finalBaseProducts.find((p) => p.id == item.productId);
    if (!product) return; // لو المنتج الأصلي غير موجود في data.js

    if (!product) return; // لو المنتج الأصلي غير موجود

    // ----------------------------------------------------------------------------------
    // 💡 منطق عرض الطلب المخصص 💡
    // ----------------------------------------------------------------------------------
    let detailsHTML = "";
    let editButtonHTML = "";

    if (item.customization) {
      // للمنتجات مع تخصيص: نعرض السعر "يحدد لاحقاً" والكمية والتخصيص
      detailsHTML = `
                <p>اللون : <span style="font-weight:bold;">${item.selectedColor.name}</span></p>
                <p>الكمية : ${item.quantity}</p>
                <p style="font-weight: bold; color: #ffc107;">السعر: يحدد لاحقاً</p>
                <p style="font-size: 14px; color: #666; margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;">التخصيص: ${item.customization}</p>
            `;
      // نسمح بفتح مودال التعديل
      editButtonHTML = `<button class="edit-cart-btn" onclick="editCartItem(${item.id})">تعديل</button>`;
    } else if (item.isCustom) {
      // للطلبات المخصصة القديمة: لا نظهر الوصف داخل الكارد، نعرض ملاحظة وأزرار (التعديل يفتح مودال قابل للتحرير)
      detailsHTML = `
                <p>الكمية: 1 (طلب مخصص)</p>
                <p style="font-weight: bold; color: #ffc107; margin-top: 5px;">هذا طلب مخصص — اضغط تعديل لتعديل الوصف</p>
            `;
      // نسمح بفتح مودال التعديل لطلبات مخصصة
      editButtonHTML = `<button class="edit-cart-btn" onclick="editCartItem(${item.id})">تعديل</button>`;
    } else {
      // للمنتجات القياسية: نعرض اللون والكمية والسعر
      const itemColorCode = item.selectedColor.code.toLowerCase().trim();
      let colorStyle = `color:${itemColorCode}; font-weight:bold;`;

      // إذا كان كود اللون فاتحاً، نطبق إطار أسود
      if (
        itemColorCode === "#ffffff" ||
        itemColorCode === "#fff" ||
        itemColorCode === "white" ||
        itemColorCode === "#f5f5dc" ||
        itemColorCode === "#5dadec" ||
        itemColorCode === "#ffff00" ||
        itemColorCode === "#40e0d0"
      ) {
        // نعدل النص Shadow ليصبح مناسباً للون الخلفية البيضاء (الافتراضية للبطاقة)
        colorStyle += ` text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;`;
      }

      detailsHTML = `
                <p>اللون : <span style="${colorStyle}">${item.selectedColor.name}</span></p>
                <p>الكمية : ${item.quantity}</p>
                <p>السعر : ${product.price} ل.س</p>
            `;
      editButtonHTML = `<button class="edit-cart-btn" onclick="editCartItem(${item.id})">تعديل</button>`;
    }
    // ----------------------------------------------------------------------------------

    // حدد ما إذا كان العنصر مخصصًا (إما طلب مخصص قديم أو تخصيص مستخدم على منتج عادي)
    const isCustomized = !!(
      item.isCustom ||
      (item.customization && item.customization.toString().trim() !== "")
    );

    // 💡 المنطق الجديد: التحقق من اللون الأبيض
    const itemColorCode = item.selectedColor.code.toLowerCase().trim();
    let colorStyle = `color:${itemColorCode}; font-weight:bold;`;

    // إذا كان كود اللون أبيض (بصيغة #FFFFFF أو #FFF أو white)
    if (
      itemColorCode === "#ffffff" ||
      itemColorCode === "#fff" ||
      itemColorCode === "white" ||
      itemColorCode === "#f5f5dc" ||
      itemColorCode === "#5dadec" ||
      itemColorCode === "#ffff00" ||
      itemColorCode === "#40e0d0"
    ) {
      // تطبيق إطار أسود (Text Stroke/Shadow) لجعل النص مرئياً
      colorStyle += ` text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;`;
    }

    const card = document.createElement("div");
    card.classList.add("cart-card");

    // determine if this item should show price as 0 and display the "price later" note
    const hasNote = item.note && item.note.toString().trim() !== "";
    const priceIsZero = hasNote || isCustomized;
    const displayPrice = priceIsZero ? 0 : product.price;
    const priceNoteHTML = priceIsZero
      ? `<p style="color:#d35400; font-weight:bold; margin-top:6px;">✳️ السعر يحدد لاحقاً</p>`
      : "";

    // build details area (different for custom orders)
    let detailsForCard = "";
    let actionButtonsHTML = `
        <button class="delete-cart-btn" onclick="removeFromCart(${item.id})">حذف</button>
        <button class="edit-cart-btn" onclick="editCartItem(${item.id})">تعديل</button>
        `;

    if (isCustomized) {
      detailsForCard = `
          <p>اللون : <span style="color:#dc143c; font-weight:bold;">مخصص</span></p>
          <p>الكمية : ${item.quantity}</p>
          <p>السعر : <span style="color:#dc143c; font-weight:bold;">يحدد لاحقاً</span></p>
      `;
    } else {
      // تحقق إذا كان المنتج له تخصيص (note)
      if (hasNote) {
        detailsForCard = `
            <p>اللون : <span style="${colorStyle}">${item.selectedColor.name}</span></p>
            <p>الكمية : ${item.quantity}</p>
            <p>السعر : <span style="color:#dc143c; font-weight:bold;">يحدد لاحقا</span></p>
        `;
      } else if (
        (product.categories &&
          product.categories.length > 0 &&
          product.categories[0] == "ستيكرات") ||
        product.showColors == 0
      ) {
        detailsForCard = `
            <p>الكمية : ${item.quantity}</p>
            <p>السعر : ${displayPrice} ل.س</p>
        `;
      } else {
        detailsForCard = `
            <p>اللون : <span style="${colorStyle}">${item.selectedColor.name}</span></p>
            <p>الكمية : ${item.quantity}</p>
            <p>السعر : ${displayPrice} ل.س</p>
        `;
      }
    }

    // أزرار العمل (موحدة لجميع أنواع المنتجات)
    actionButtonsHTML = `<button class="delete-cart-btn" onclick="removeFromCart(${item.id})"><i class="fa fa-trash"></i> <span class="btn-text">حذف</span></button>
        <button class="edit-cart-btn" onclick="editCartItem(${item.id})"><i class="fa fa-pencil"></i> <span class="btn-text">تعديل</span></button>`;

    card.innerHTML = `
        <h3>${product.name}</h3>
      <div class="cart-info">
      <img class="cart-image" src="${product.images[0]}" alt="${product.name}" style="width:120px; height:120px; border-radius:10px 10px 25px 10px; object-fit:contain;">
        <div class="cart-details">
        ${detailsForCard}
        </div>
        <div class="cart-buttons">
        ${actionButtonsHTML}
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  updateCartTotals();
}

// ======================================================
// 🚀 عند تحميل الصفحة
// ======================================================
window.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  // load previously saved customer info (excluding date & notes)
  loadSavedCustomerInfo();

  // auto-save customer info as user types (so it's persisted when they order)
  ["customerName", "customerPhone", "customerCity", "shippingDetails"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", saveCustomerInfo);
      el.addEventListener("change", saveCustomerInfo);
    },
  );

  // Handle shipping type changes specially: update placeholder and clear details locally,
  // but do NOT immediately overwrite savedCustomerInfo until the user fills details or submits.
  const shippingTypeEl = document.getElementById("shippingType");
  if (shippingTypeEl) {
    shippingTypeEl.addEventListener("change", function () {
      updateShippingPlaceholder(true); // clear the details field for new type
      // Do NOT call saveCustomerInfo() here to avoid saving an empty details value prematurely
    });
  }
});

// ======================================================
// 🗑️ حذف منتج من السلة
// ======================================================
function removeFromCart(itemId) {
  // التأكد من أن المستخدم يريد الحذف
  if (!confirm("هل أنت متأكد من حذف هذا المنتج من السلة؟")) {
    return;
  }

  // 1. تصفية (Filter) المصفوفة لإزالة العنصر المطابق
  cartItems = cartItems.filter((item) => item.id != itemId);

  // 2. حفظ المصفوفة المحدثة في التخزين المحلي
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // 3. تحديث عرض المنتجات في الصفحة
  displayCartItems();

  // ملاحظة: يمكنك هنا استدعاء دالة تحديث الإجماليات (updateTotals() إذا كانت موجودة)

  updateCartTotals();
}

// ======================================================
// 🖼️ دالة عرض مودل التعديل (نسخة مُعدّلة من showModal)
// ======================================================
function openEditModal(cartItem) {
  const product = finalBaseProducts.find((r) => r.id == cartItem.productId);
  const modalContent = document.getElementById("modalContent");

  if (!product) {
    alert("⚠️ خطأ: المنتج الأصلي غير موجود.");
    return;
  }

  // إذا كان المنتج مخصصًا، نعرض مودال خاص لتحرير الوصف المخصص

  // 1. إنشاء دوائر الألوان (فقط للمنتجات القياسية)
  let colorsHTML = "";
  if (
    !cartItem.isCustom &&
    product.colors &&
    product.colors.length > 0 &&
    product.showColors == 1
  ) {
    const productId = cartItem.productId;

    // نستخدم data-cart-item-id لتخزين معرف السلة هنا (مهم لـ selectColor/saveEdit)
    colorsHTML = `<div class="color-container" id="colorContainer" data-cart-item-id="${
      cartItem.id
    }" style="display:flex; gap:10px; margin:12px 0; align-items:center;">
            ${product.colors
              .filter((c) => c.code)
              .map(
                (c) => `
                <div 
                    class="color-circle" 
                    title="${c.name}" 
                    onclick="selectColor(this, '${productId}', '${c.name}', '${c.code}')" 
                    style="width:28px; height:28px; border-radius:50%; background:${c.code}; cursor:pointer; box-shadow:0 2px 6px #0001;"
                ></div>
            `,
              )
              .join("")}
        </div>`;
  }

  // 2. إنشاء محتوى المودل (بشكل مختلف للطلبات المخصصة)
  if (cartItem.customization) {
    // للمنتجات مع تخصيص
    modalContent.innerHTML = `
        <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div>
                    <h2>${product.name}</h2>
                    <h3 style="color: #ffc107;">السعر: يحدد لاحقاً</h3>
                </div>
                <img src="./${product.images[0]}" alt="${
                  product.name
                }" style="width: 80px; height: 80px;">
            </div>

            <p style="margin-bottom:6px; font-weight:600;">اللون: <span style="color:${
              cartItem.selectedColor.code
            }; font-weight:bold;">${cartItem.selectedColor.name}</span></p>

            <p style="margin-bottom:6px; font-weight:600;">وصف التخصيص:</p>
            <textarea id="productCustomDesc" placeholder="اكتب وصف التخصيص هنا" style="width:100%; min-height:140px; margin-top:4px;">${
              cartItem.customization || ""
            }</textarea>

            <input type="number" id="pQ" placeholder="الكمية" value="${
              cartItem.quantity
            }" min="1" required style="width:100%; margin-top:8px; padding:8px; border:1px solid #ccc; border-radius:4px;" />

            <button onClick="saveEdit(${cartItem.id})">حفظ التعديلات</button>
        </div>
    `;
  } else if (cartItem.isCustom) {
    modalContent.innerHTML = `
        <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div>
                    <h2>${product.name} (طلب مخصص)</h2>
                    <h3>${product.price} ل.س</h3>
                </div>
                <img src="./${product.images[0]}" alt="${
                  product.name
                }" style="width: 80px; height: 80px;">
            </div>

            <p style="margin-bottom:6px; font-weight:600;">الوصف المخصص:</p>
            <textarea id="customDesc" placeholder="اكتب الوصف المخصص هنا" style="width:100%; min-height:140px; margin-top:4px;">${
              cartItem.customDescription || ""
            }</textarea>

            <input type="number" id="pQ" placeholder="الكمية" value="${
              cartItem.quantity
            }" min="1" required style="width:100%; margin-top:8px; padding:8px; border:1px solid #ccc; border-radius:4px;" />

            <button onClick="saveEdit(${cartItem.id})">حفظ التعديلات</button>
        </div>
    `;
  } else {
    modalContent.innerHTML = `
        <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div>
                    <h2>${product.name}</h2>
                    <h3>${product.price} ل.س</h3>
                </div>
                <img src="./${product.images[0]}" alt="${
                  product.name
                }" style="width: 80px; height: 80px;">
            </div>
            ${colorsHTML}
            <input type="number" id="pQ" placeholder="الكمية" value="${
              cartItem.quantity
            }" required>
            
            <textarea id="pNote" placeholder="ملاحظات إضافية (اختياري)" style="width:100%; min-height:80px; margin-top:8px;">${
              cartItem.note || ""
            }</textarea>

            <button onClick="saveEdit(${cartItem.id})">حفظ التعديلات</button>
        </div>
    `;
  }

  // 3. فتح المودل وتعبئة اللون المختار مسبقًا
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("overlay").classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // 💡 التعبئة المسبقة للون المختار
  const colorContainer = document.getElementById("colorContainer");
  if (colorContainer) {
    // تخزين اللون الحالي في dataset لـ saveEdit
    colorContainer.dataset.selectedColor = JSON.stringify(
      cartItem.selectedColor,
    );

    // البحث عن دائرة اللون وتطبيق فئة التمييز
    const selectedCircle = Array.from(
      document.querySelectorAll(".color-circle"),
    ).find((circle) =>
      circle.style.background
        .toLowerCase()
        .includes(cartItem.selectedColor.code.toLowerCase().replace("#", "")),
    );

    if (selectedCircle) {
      selectedCircle.classList.add("active-color");
    }
  }
}

// ======================================================
// ✏️ دالة استدعاء التعديل من زر البطاقة
// ======================================================
function editCartItem(itemId) {
  // 1. العثور على العنصر المراد تعديله في السلة
  const cartItem = cartItems.find((item) => item.id == itemId);

  if (!cartItem) {
    alert("⚠️ خطأ: عنصر السلة غير موجود.");
    return;
  }

  // 2. فتح المودل المُعدَّل
  openEditModal(cartItem);
}

// ======================================================
// 💾 حفظ تعديلات المنتج في السلة
// ======================================================
function saveEdit(itemId) {
  const cartItemIndex = cartItems.findIndex((item) => item.id == itemId);
  const qInput = document.getElementById("pQ");
  const colorContainer = document.getElementById("colorContainer");

  if (cartItemIndex === -1) {
    alert("⚠️ خطأ في العثور على عنصر السلة للتعديل.");
    return;
  }

  // احمِ الوصول إلى dataset في حال لم يكن colorContainer موجودًا (الطلبات المخصصة لا تحتوي ألوان)
  const selectedColorData = colorContainer
    ? colorContainer.dataset.selectedColor
    : null;
  const quantity = qInput ? parseInt(qInput.value) || 1 : 1;

  const noteInput = document.getElementById("pNote");
  const note = noteInput ? noteInput.value.trim() : "";

  // إذا كان هذا عنصر مخصص، احصل على النص من textarea الخاص بالوصف المخصص
  const customDescInput = document.getElementById("customDesc");
  const customizationInput = document.getElementById("productCustomDesc");
  const isCustom = cartItems[cartItemIndex].isCustom;
  const hasCustomization = cartItems[cartItemIndex].customization;

  // للمنتجات غير المخصصة: نحتاج لوناً
  if (!isCustom && !hasCustomization && !selectedColorData) {
    showToast("⚠️ يرجى اختيار لون للمنتج", 3000, "orange");
    return;
  }

  let selectedColor = null;
  try {
    if (selectedColorData) selectedColor = JSON.parse(selectedColorData);
  } catch (e) {
    console.warn("Invalid selectedColorData", e);
  }

  // 1. تحديث بيانات العنصر
  if (hasCustomization) {
    // للمنتجات مع تخصيص: نحفظ الكمية والتخصيص
    cartItems[cartItemIndex].quantity = quantity;
    if (customizationInput) {
      cartItems[cartItemIndex].customization = customizationInput.value.trim();
    }
  } else if (isCustom) {
    // للطلبات المخصصة القديمة: نحفظ الكمية والوصف المخصص والملاحظات
    cartItems[cartItemIndex].quantity = quantity;
    cartItems[cartItemIndex].customDescription = customDescInput
      ? customDescInput.value.trim()
      : cartItems[cartItemIndex].customDescription;
    cartItems[cartItemIndex].note = note;
  } else {
    // للمنتجات العادية: نحفظ الكمية واللون والملاحظات
    cartItems[cartItemIndex].quantity = quantity;
    if (selectedColor) cartItems[cartItemIndex].selectedColor = selectedColor;
    cartItems[cartItemIndex].note = note;
  }

  // 2. حفظ في localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // 3. إغلاق المودل وإعادة تعيين العرض
  closeModal();
  displayCartItems(); // إعادة عرض السلة لعكس التعديلات
  updateCartTotals();

  showToast(`✅ تم حفظ التعديلات بنجاح!`, 3000, "green");
}

// ======================================================
// 🎨 دالة اختيار اللون (نفس التي في صفحة الإضافة)
// ======================================================
function selectColor(clickedElement, productId, colorName, colorCode) {
  const product = finalBaseProducts.find((p) => p.id == productId);
  if (!product) return;

  const colorContainer = document.getElementById("colorContainer");

  // 1. تخزين اللون المختار في dataset
  colorContainer.dataset.selectedColor = JSON.stringify({
    name: colorName,
    code: colorCode,
  });

  // 2. إلغاء التمييز عن جميع دوائر الألوان
  const colorOptions = document.querySelectorAll(".color-circle");
  colorOptions.forEach((opt) => {
    opt.classList.remove("active-color");
  });

  // 3. تمييز العنصر المضغوط عليه مباشرةً
  clickedElement.classList.add("active-color");

  // 4. التركيز على حقل الكمية
  const qInput = document.getElementById("pQ");
  qInput.focus();
}

// ======================================================
// ❌ دالة إغلاق المودل
// ======================================================
function closeModal() {
  // يجب أن تكون IDs المودل والأوفرلاي موجودة في صفحة السلة
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("overlay").classList.add("hidden");
  document.body.style.overflow = "";
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

// ======================================================
// 📊 حساب وتحديث إجمالي السلة
// ======================================================
function updateCartTotals() {
  let totalQuantity = 0;
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const product = finalBaseProducts.find((p) => p.id == item.productId);
    if (product) {
      const qty = Number(item.quantity) || 1;
      totalQuantity += qty;

      const hasNote = item.note && item.note.toString().trim() !== "";
      const unitPrice =
        hasNote || item.isCustom ? 0 : Number(product.price) || 0;
      totalPrice += qty * unitPrice;
    }
  });

  // تطبيق الكوبون إذا كان موجوداً
  let finalPrice = totalPrice;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "%") {
      finalPrice =
        totalPrice - (totalPrice * appliedCoupon.discountValue) / 100;
    } else {
      finalPrice = totalPrice - appliedCoupon.discountValue;
    }
    finalPrice = Math.max(0, finalPrice); // تأكد من عدم كون السعر سالب
  }

  // عرض النتائج في الـ HTML
  document.getElementById("totalQuantity").textContent = totalQuantity;

  // عرض السعر الأصلي والمخفف إذا كان هناك كوبون
  let priceDisplay = `${finalPrice.toLocaleString()} ل.س`;
  if (appliedCoupon) {
    priceDisplay = `<span style="text-decoration: line-through; color: #999;">${totalPrice.toLocaleString()}</span> → ${finalPrice.toLocaleString()} ل.س ✅`;
  }

  document.getElementById("totalPrice").innerHTML = priceDisplay;
}

// ======================================================
// 📤 دالة إرسال الطلب لـ Telegram (مُعدَّلة)
// ======================================================
function sendTelegramOrder() {
  const CHAT_ID = "1604687718"; // شات ID للبوت
  const VERCEL_BACKEND_URL = "https://telegram-backend-eta.vercel.app"; // رابط مشروعك على Vercel

  try {
    saveCustomerInfo();
  } catch (e) {
    console.warn("saveCustomerInfo failed", e);
  }

  // الحصول على الكود والتفاصيل (بدون encodeURIComponent)
  const { code, details } = formatOrderDetails();

  const orderRequests = [
    { chatId: CHAT_ID, message: code, step: "1/2 (الكود)" },
    { chatId: CHAT_ID, message: details, step: "2/2 (التفاصيل)" },
  ];

  const btn = document.getElementById("checkoutBtn");
  btn.disabled = true;

  const sendStep = (order) => {
    btn.textContent = `جاري إرسال الرسالة ${order.step}...`;

    return fetch(`${VERCEL_BACKEND_URL}/sendOrder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: order.chatId,
        message: order.message,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data.success) throw new Error(data.error || "فشل الإرسال");
      });
  };

  // إرسال الرسائل بالتتابع
  sendStep(orderRequests[0])
    .then(() => sendStep(orderRequests[1]))
    .then(() => {
      // حفظ الكوبون كمستخدم فقط بعد نجاح إرسال الطلب
      if (appliedCoupon) {
        incrementCouponUsage(appliedCoupon.code);
      }

      cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      displayCartItems();
      showConfirmationModal();
      resetCheckoutButton();
    })
    .catch((error) => {
      alert(`⚠️ خطأ في إرسال الطلب: ${error.message}`);
      console.error("Backend Telegram Error:", error);
      btn.disabled = false;
      btn.textContent = "تأكيد الطلب";
    });
}

// ======================================================
// 🔄 دالة لتعيين حالة الزر مرة أخرى
// ======================================================
function resetCheckoutButton() {
  // إخفاء حقول العميل وتعديل الزر إلى الحالة الأصلية
  document.getElementById("customerInfoFields").classList.add("hidden");
  document.getElementById("checkoutBtn").textContent = "تأكيد الطلب";
  document.getElementById("checkoutBtn").dataset.stage = "initial";
  document.getElementById("checkoutBtn").disabled = false;

  // تنظيف الحقول (اختياري)
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";

  updateCartTotals();
}

// ======================================================
// 🕹️ دالة التحكم الرئيسية (Stage Controller)
// ======================================================
function handleCheckout() {
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (cartItems.length === 0) {
    showToast("❌ السلة فارغة! لا يمكن تأكيد الطلب.", 5000, "red");
    return;
  }

  const currentStage = checkoutBtn.dataset.stage || "initial";

  if (currentStage === "initial") {
    // --- المرحلة 1: عرض حقول الإدخال ---

    // 1. إظهار حقول العميل
    document.getElementById("customerInfoFields").classList.remove("hidden");
    // ملء الحقول من التخزين المحفوظ (إن وُجدت) عند العرض
    try {
      loadSavedCustomerInfo();
    } catch (e) {
      console.warn("loadSavedCustomerInfo failed", e);
    }

    document.getElementById("closeBtn").classList.remove("hidden");
    // 2. تحديث نص الزر
    checkoutBtn.textContent = "حفظ وإرسال الطلب";
    // 3. الانتقال إلى المرحلة التالية
    checkoutBtn.dataset.stage = "confirm";
    // 4. تعيين placeholder الافتراضي وتوجيه المستخدم
    updateShippingPlaceholder();

    setFutureDateMin(); // نضبط أقل تاريخ مسموح به (الغد)

    document.getElementById("customerName").focus();
  } else if (currentStage === "confirm") {
    // --- المرحلة 2: التحقق والإرسال لـ Telegram ---

    // 1. التحقق من الحقول قبل الإرسال
    if (!validateCustomerInputs()) {
      return; // توقف إذا كانت الحقول غير مكتملة
    }

    // -----------------------------------------------------
    // 💡 التحقق من قاعدة الستيكرات (3 ستيكرات على الأقل) 💡
    // -----------------------------------------------------
    let totalStickerCount = 0;

    cartItems.forEach((item) => {
      // العثور على المنتج الأصلي من مصفوفة finalBaseProducts
      const product = finalBaseProducts.find((p) => p.id == item.productId);

      if (product.categories[0] != "ستيكر") {
        totalStickerCount = 100;
      }

      // التحقق: إذا كان المنتج موجوداً ويحتوي على تصنيفات، والتصنيف الأول فيه كلمة 'ستيكر'
      if (
        product &&
        product.categories &&
        product.categories.length > 0 &&
        product.categories[0] === "ستيكر"
      ) {
        totalStickerCount += item.quantity;
      }
    });

    // تطبيق الشرط: إذا كان هناك ستيكرات (الكمية > 0) وكانت الكمية الإجمالية أقل من 3
    if (totalStickerCount > 0 && totalStickerCount < 3) {
      showToast(
        `⚠️ عذراً، يجب طلب 3 ستيكرات على الأقل لإتمام عملية الشراء. (الكمية الحالية: ${totalStickerCount})`,
        5000,
        "orange",
      );

      return; // إيقاف العملية ومنع المتابعة
    }
    // -----------------------------------------------------

    // 2. استدعاء دالة الإرسال
    sendTelegramOrder();

    updateCartTotals();
    document.getElementById("closeBtn").classList.add("hidden");
  }
}

// ======================================================
// 🔄 تهيئة الزر عند تحميل الصفحة
// ======================================================
window.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  // تعيين المرحلة الافتراضية للزر عند التحميل
  document.getElementById("checkoutBtn").dataset.stage = "initial";
});

// ======================================================
// ✍️ دالة لتنسيق نص الرسالة (النسخة النهائية مع الكود وتفاصيل الفاتورة)
// ======================================================
function formatOrderDetails() {
  // 1. توليد كود الطلبية المشفر (يجب أن يتم أولاً لأنه يحتاج البيانات غير المشفرة)
  const orderCode = generateOrderCode();
  const displayCode = orderCode || "⚠️ فشل توليد الكود"; // للتحقق في حالة الفشل

  // 2. قراءة وتنسيق بيانات العميل
  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const customerCity = document.getElementById("customerCity").value.trim();
  const shippingTypeElement = document.getElementById("shippingType");
  const shippingTypeDisplay =
    shippingTypeElement.value === "delivery" ? "شحن" : "ضمن حمص";
  const shippingDetails = document
    .getElementById("shippingDetails")
    .value.trim();
  const shippingDate = document.getElementById("shippingDate").value.trim();
  const notes = document.getElementById("notes").value.trim();

  // 3. بناء نص الرسالة (شامل الكود والتفاصيل)
  let messageText = `🎉 طلب جديد [${shippingTypeDisplay}] عبر الموقع الإلكتروني 🎉\n\n`;

  // --- قسم بيانات العميل (إعادة الإضافة) ---
  messageText += `👤 بيانات العميل:\n`;
  messageText += `الاسم: ${customerName}\n`;
  messageText += `الهاتف: ${customerPhone}\n`;
  messageText += `المحافظة: ${customerCity}\n`;
  messageText += `نوع التسليم: ${shippingTypeDisplay}\n`;
  messageText += `الموقع/العنوان: ${shippingDetails}\n`;
  messageText += `موعد التسليم: ${shippingDate}\n`;
  if (notes) {
    messageText += `ملاحظات العميل: ${notes}\n`;
  }
  messageText += `----------------------------------\n\n`;

  // --- قسم المنتجات والإجمالي ---
  messageText += `🛍️ تفاصيل المنتجات:\n`;

  let totalQuantity = 0;
  let totalPrice = 0;

  cartItems.forEach((item, index) => {
    const product = finalBaseProducts.find((p) => p.id == item.productId);
    if (product) {
      // 💡 (تعديل جديد) حساب الإجمالي والكمية بشكل صحيح
      totalQuantity += item.quantity;
      totalPrice += item.quantity * product.price;

      messageText += `${index + 1}. ${product.name}\n`;

      if (item.isCustom) {
        // للمنتجات المخصصة: نعرض الوصف المخصص
        messageText += `   - *نوع الطلب: مخصص*\n`;
        messageText += `   - الوصف: ${
          item.customDescription || "لا يوجد وصف."
        }\n`;
        messageText += `   - الكمية: 1 (طلب واحد)\n`; // نؤكد على أنه طلب واحد
      } else {
        // للمنتجات القياسية: نعرض اللون والكمية
        messageText += `   - اللون: ${item.selectedColor.name}\n`;
        messageText += `   - الكمية: ${item.quantity} قطعة\n`;
      }

      messageText += `   - السعر الإفرادي: ${product.price.toLocaleString()} ل.س\n`;
      messageText += `------------------------------\n`;
    }
  });

  messageText += `\n💰 الإجمالي الكلي:\n`;
  messageText += `   - العدد الكلي: ${totalQuantity} منتجات\n`;
  messageText += `   - إجمالي المبلغ (قبل الخصم): ${totalPrice.toLocaleString()} ل.س\n`;

  // --- قسم معلومات الخصم والتعديلات ---
  if (appliedCoupon) {
    messageText += `\n🎟️ كود الخصم:\n`;
    messageText += `   - كود الكوبون: ${appliedCoupon.code}\n`;
    messageText += `   - نوع الخصم: ${appliedCoupon.discountType === "%" ? "نسبة مئوية" : "مبلغ ثابت"}\n`;
    messageText += `   - قيمة الخصم: ${appliedCoupon.discountValue}${appliedCoupon.discountType === "%" ? "%" : " ل.س"}\n`;
  }

  // حساب السعر بعد تطبيق الخصم الذكي
  let finalPrice = totalPrice;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "%") {
      finalPrice =
        totalPrice - (totalPrice * appliedCoupon.discountValue) / 100;
    } else {
      finalPrice = totalPrice - appliedCoupon.discountValue;
    }
  }

  messageText += `\n💵 المبلغ النهائي: ${finalPrice.toLocaleString()} ل.س\n`;
  messageText += `==================================`;

  const encodedDetails = messageText;
  const encodedCode = displayCode; // الكود وحده

  // 🛑 الإرجاع: نُرجع كائناً يحتوي على الرسالتين المشفرتين
  return {
    code: encodedCode,
    details: encodedDetails,
  };
}

// ======================================================
// 🔄 تحديث نص placeholder بناءً على نوع التسليم
// ======================================================
function updateShippingPlaceholder(shouldClear = false) {
  const shippingTypeEl = document.getElementById("shippingType");
  const shippingType = shippingTypeEl && shippingTypeEl.value;
  const detailsInput = document.getElementById("shippingDetails");

  if (!detailsInput) return;

  if (shippingType === "delivery") {
    detailsInput.placeholder =
      "العنوان التفصيلي للشحن (مثلاً: رقم الطرد، الفرع)";
    if (shouldClear) detailsInput.value = "";
  } else {
    detailsInput.placeholder = "موقع التسليم المفصل ضمن حمص";
    if (shouldClear) detailsInput.value = "";
  }

  // لا نقوم بالحفظ التلقائي هنا لتجنب الكتابة فوق القيم المحفوظة عند التغيير العرضي
}

// ======================================================
// 🔍 التحقق من إدخالات العميل
// ======================================================
function validateCustomerInputs() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const city = document.getElementById("customerCity").value.trim();
  const details = document.getElementById("shippingDetails").value.trim();
  const date = document.getElementById("shippingDate").value.trim();

  // التحقق من الحقول الإلزامية
  if (!name || !phone || !city || !details || !date) {
    showToast(
      "⚠️ يرجى تعبئة جميع معلومات التواصل والموقع الإلزامية.",
      3000,
      "red",
    );
    return false;
  }

  // 2. 🛑 التحقق الجديد: التأكد من أن التاريخ هو تاريخ مستقبلي
  const inputDate = new Date(date);
  const today = new Date();

  // لتبسيط المقارنة وإزالة عامل الوقت (الساعة/الدقيقة/الثانية)،
  // نحدد اليوم الحالي عند بداية اليوم (الساعة 00:00:00).
  today.setHours(0, 0, 0, 0);

  // إذا كان التاريخ المدخل أصغر من أو يساوي اليوم الحالي (مقارنة بالمللي ثانية)
  if (inputDate.getTime() <= today.getTime()) {
    showToast(
      "❌ يرجى اختيار تاريخ شحن مستقبلي (لا يمكن الشحن في نفس اليوم أو يوم سابق).",
      3000,
      "red",
    );
    document.getElementById("shippingDate").focus();
    return false;
  }
  return true;
}

function generateOrderCode() {
  // 1. تجميع بيانات العميل من الحقول
  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const customerCity = document.getElementById("customerCity").value.trim();
  const shippingType =
    document.getElementById("shippingType").value === "delivery"; // true: شحن, false: ضمن حمص
  const shippingDetails = document
    .getElementById("shippingDetails")
    .value.trim();
  const shippingDateRaw = document.getElementById("shippingDate").value.trim();
  const shippingDate = shippingDateRaw || new Date().toISOString().slice(0, 10);
  const notes = document.getElementById("notes").value.trim();

  let totalSYP = 0;

  const productsArray = cartItems
    .map((item) => {
      const product = finalBaseProducts.find((p) => p.id == item.productId);
      if (!product) return null;

      // 🛑 (التعديل يبدأ هنا) 🛑
      if (item.isCustom) {
        // التعامل مع المنتج المخصص
        // السعر المبدئي = 0.0 ليرة سورية، لتحديده لاحقاً من قبل الأدمن
        const priceSYP = 0.0;

        // لا نحسبه في الإجمالي الكلي للطلب حالياً (سيبقى 0)
        // totalSYP += item.quantity * priceSYP;

        return {
          name: product.name,
          quantity: 1, // الكمية الافتراضية 1 (لأن الوصف يحتوي على الكمية الحقيقية)
          priceSYP: priceSYP,
          priceAtOrder: priceSYP, // السعر وقت الطلب صفر
          color: null, // لا يوجد لون
          isCustom: true, // علامة مميزة
          customDescription: item.customDescription || "لا يوجد وصف مخصص.", // الوصف المباشر
        };
      } else {
        // التعامل مع المنتج القياسي (دون تغيير)
        const priceSYP = parseFloat(product.price) || 0;
        totalSYP += item.quantity * priceSYP;

        return {
          name: product.name,
          quantity: item.quantity,
          priceSYP: priceSYP,
          priceAtOrder: priceSYP,
          color: item.selectedColor
            ? {
                name: item.selectedColor.name || "",
                code: item.selectedColor.code || "",
              }
            : null,
          isCustom: false, // علامة مميزة
        };
      }
    })
    .filter(Boolean);

  // 🛑 حساب السعر النهائي بعد تطبيق الخصم
  let finalSYP = totalSYP;
  let discountInfo = null;

  if (appliedCoupon) {
    discountInfo = {
      couponCode: appliedCoupon.code,
      discountType: appliedCoupon.discountType, // "%" أو "fixed"
      discountValue: appliedCoupon.discountValue,
    };

    if (appliedCoupon.discountType === "%") {
      finalSYP = totalSYP - (totalSYP * appliedCoupon.discountValue) / 100;
    } else {
      finalSYP = totalSYP - appliedCoupon.discountValue;
    }
  }

  // 3. إنشاء كائن الفاتورة
  const orderObject = {
    id: 0,
    date: new Date().toISOString().slice(0, 10),
    customerName: customerName,
    phone: customerPhone,
    city: customerCity,
    shipping: shippingType,
    shippingCompany: null,
    shippingInfo: shippingDetails,
    shippingDate: shippingDate,
    notes: notes,

    // حالة الدفع والإجماليات
    payment: {
      status: "unpaid",
      paidSYP: 0,
      remainingSYP: finalSYP > 0 ? finalSYP : 0,
    },

    // 🛑 إضافة الإجماليين والخصم هنا للمقارنة
    totalSYP: totalSYP,
    discount: discountInfo,
    finalSYP: finalSYP > 0 ? finalSYP : 0,

    products: productsArray, // استخدام مصفوفة المنتجات التي تم إنشاؤها
  };

  // 4. تشفير الكائن
  return encodeInvoice(orderObject);
}

// ======================================================
// 📅 دالة ضبط الحد الأدنى للتاريخ المستقبلي
// ======================================================
function setFutureDateMin() {
  const shippingDateInput = document.getElementById("shippingDate");
  if (!shippingDateInput) return;

  // حساب تاريخ الغد
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  // تنسيق التاريخ إلى YYYY-MM-DD
  const year = tomorrow.getFullYear();
  // نستخدم padStart لضمان وجود الصفر في الأرقام الفردية (01، 09)
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  const minDate = `${year}-${month}-${day}`;

  // تعيين خاصية min
  shippingDateInput.min = minDate;
}

document.addEventListener("DOMContentLoaded", () => {
  const invoicesLink = document.getElementById("invoicesLink");
  const dividers = document.getElementById("firstDivider");

  if (isAdmin()) {
  } else {
    invoicesLink.style.display = "none"; // إذا لم يكن مديراً، يتم إخفاء الزر
    dividers.style.display = "none";
  }

  // ... باقي الكود ...
});

// ======================================================
// 🎯 دوال التحكم بمودال التأكيد
// ======================================================

/**
 * إظهار مودال التأكيد بعد إرسال الطلب بنجاح
 */
function showConfirmationModal() {
  document.getElementById("confirmationOverlay").classList.remove("hidden");
  document.getElementById("confirmationModal").classList.remove("hidden");
}

/**
 * إغلاق مودال التأكيد
 */
function closeConfirmationModal() {
  document.getElementById("confirmationOverlay").classList.add("hidden");
  document.getElementById("confirmationModal").classList.add("hidden");
}

// إغلاق المودال عند الضغط على زر الهروب (Escape)
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeConfirmationModal();
  }
});

function closeCustomerInfoFields() {
  // إخفاء الحقول مؤقتاً دون مسح البيانات المحفوظة
  document.getElementById("customerInfoFields").classList.add("hidden");
  document.getElementById("closeBtn").classList.add("hidden");
  // إعادة حالة زر التأكيد إلى الحالة الابتدائية
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.textContent = "تأكيد الطلب";
    checkoutBtn.dataset.stage = "initial";
  }
}

// ======================================================
// 🎫 دوال إدارة الكوبونات
// ======================================================

// تحميل سجل الكوبونات المستخدمة من localStorage
function getUsedCoupons() {
  try {
    const used = localStorage.getItem("usedCoupons");
    return used ? JSON.parse(used) : {};
  } catch (e) {
    return {};
  }
}

// حفظ سجل الكوبونات المستخدمة في localStorage
function saveUsedCoupons(usedCoupons) {
  try {
    localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
  } catch (e) {
    console.error("خطأ في حفظ سجل الكوبونات:", e);
  }
}

// التحقق من عدد مرات استخدام الكوبون
function getCouponUsageCount(couponCode) {
  const usedCoupons = getUsedCoupons();
  return usedCoupons[couponCode] || 0;
}

// زيادة عداد الاستخدام للكوبون
function incrementCouponUsage(couponCode) {
  const usedCoupons = getUsedCoupons();
  usedCoupons[couponCode] = (usedCoupons[couponCode] || 0) + 1;
  saveUsedCoupons(usedCoupons);
}

function showCouponModal() {
  document.getElementById("couponOverlay").classList.remove("hidden");
  document.getElementById("couponModal").classList.remove("hidden");

  // تنظيف حقل الإدخال والرسائل
  document.getElementById("couponCode").value = "";
  document.getElementById("couponMessage").textContent = "";

  // عرض معلومات الكوبون المطبق الحالي إن وجد
  const messageEl = document.getElementById("couponMessage");
  if (appliedCoupon) {
    const discountDisplay = `${appliedCoupon.discountValue}${appliedCoupon.discountType}`;
    messageEl.innerHTML = `✅ الكوبون المطبق حالياً: <strong>${appliedCoupon.code}</strong><br/>الخصم: ${discountDisplay}<br/><button onclick="removeCouponAndResetModal()" class="remove-coupon-btn" style="margin-top: 10px; padding: 8px 15px; background-color: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">حذف الكوبون واستخدام آخر</button>`;
    messageEl.className = "coupon-message success";
    document.getElementById("couponCode").disabled = true;
    document.querySelector(".apply-coupon-btn").disabled = true;
  } else {
    document.getElementById("couponCode").disabled = false;
    document.querySelector(".apply-coupon-btn").disabled = false;
  }
}

function closeCouponModal() {
  document.getElementById("couponOverlay").classList.add("hidden");
  document.getElementById("couponModal").classList.add("hidden");
  document.getElementById("couponCode").value = "";
  document.getElementById("couponMessage").textContent = "";
}

function applyCoupon() {
  const couponCode = document.getElementById("couponCode").value.trim();
  const messageEl = document.getElementById("couponMessage");

  // التحقق من وجود كوبون مطبق بالفعل
  if (appliedCoupon) {
    messageEl.textContent =
      "❌ يوجد كوبون مطبق بالفعل. الرجاء حذفه أولاً لتطبيق كوبون آخر";
    messageEl.className = "coupon-message error";
    return;
  }

  if (!couponCode) {
    messageEl.textContent = "❌ الرجاء إدخال كود الخصم";
    messageEl.className = "coupon-message error";
    return;
  }

  // البحث عن الكوبون في القائمة
  const coupon = coupons.find((c) => c.code === couponCode);

  if (!coupon) {
    messageEl.textContent = "❌ كود الخصم غير صحيح";
    messageEl.className = "coupon-message error";
    return;
  }

  // التحقق من تاريخ انتهاء الكوبون
  const today = new Date();
  today.setHours(0, 0, 0, 0); // تعيين الساعة إلى منتصف الليل

  let endDate = new Date(coupon.endDate);
  if (typeof coupon.endDate === "string") {
    // إذا كان التاريخ نصاً بصيغة YYYY-MM-DD، تحويله بشكل صحيح
    const [year, month, day] = coupon.endDate.split("-");
    endDate = new Date(year, month - 1, day);
  }
  endDate.setHours(23, 59, 59, 999); // تعيين الساعة إلى نهاية اليوم

  if (today > endDate) {
    messageEl.textContent = "❌ انتهت صلاحية كود الخصم";
    messageEl.className = "coupon-message error";
    return;
  }

  // التحقق من عدد مرات الاستخدام
  const usageCount = getCouponUsageCount(couponCode);
  const useLimit = coupon.useLimit || Infinity; // الحد الأقصى للاستخدام

  if (usageCount >= useLimit) {
    messageEl.textContent = `❌ تم استخدام هذا الكوبون ${useLimit} مرات وانتهت الحد المسموح به`;
    messageEl.className = "coupon-message error";
    return;
  }

  // تطبيق الكوبون
  appliedCoupon = coupon;

  // عرض رسالة النجاح مع معلومات الاستخدام المتبقي
  const remainingUses = useLimit - usageCount;
  let successMessage = `✅ تم تطبيق الكوبون بنجاح! الخصم: ${
    coupon.discountValue
  } ${coupon.discountType === "%" ? "%" : "ل.س"}`;

  if (useLimit !== Infinity) {
    successMessage += `<br/>عدد الاستخدامات المتبقية: ${remainingUses}`;
  }

  messageEl.innerHTML = successMessage;
  messageEl.className = "coupon-message success";

  // تحديث الإجماليات
  updateCartTotals();

  // إغلاق المودل بعد 1.5 ثانية
  setTimeout(() => {
    closeCouponModal();
  }, 1500);
}

function removeCoupon() {
  appliedCoupon = null;
  updateCartTotals();
  showToast("✅ تم إزالة الكوبون", 3000, "green");
}

// دالة لحذف الكوبون وإعادة تعيين مودال الكوبون
function removeCouponAndResetModal() {
  removeCoupon();
  // إعادة تعيين محتوى المودال
  document.getElementById("couponCode").value = "";
  document.getElementById("couponCode").disabled = false;
  document.querySelector(".apply-coupon-btn").disabled = false;
  document.getElementById("couponMessage").textContent = "";
}
