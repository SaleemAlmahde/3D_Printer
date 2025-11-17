// ======================================================
// 🛒 تحميل بيانات السلة من localStorage
// ======================================================
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

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

  cartItems.forEach(item => {
    const product = finalBaseProducts.find(p => p.id == item.productId);
    if (!product) return; // لو المنتج الأصلي غير موجود في data.js

    // 💡 المنطق الجديد: التحقق من اللون الأبيض
    const itemColorCode = item.selectedColor.code.toLowerCase().trim();
    let colorStyle = `color:${itemColorCode}; font-weight:bold;`;

    // إذا كان كود اللون أبيض (بصيغة #FFFFFF أو #FFF أو white)
    if (itemColorCode === '#ffffff' || itemColorCode === '#fff' || itemColorCode === 'white') {
        // تطبيق إطار أسود (Text Stroke/Shadow) لجعل النص مرئياً
        colorStyle += ` text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;`;
    }

    const card = document.createElement("div");
    card.classList.add("cart-card");

    card.innerHTML = `
        <h3>${product.name}</h3>
      <div class="cart-info">
      <img class="cart-image" src="${product.image}" alt="${product.name}" style="width:120px; height:120px; border-radius:10px 10px 25px 10px;">
        <div class="cart-details">
        <p>اللون : <span style="${colorStyle}; text-shadow: -1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff;">${item.selectedColor.name}</span></p>
        <p>الكمية : ${item.quantity}</p>
        <p>السعر : ${product.price} ل.س</p>
        </div>
        <div class="cart-buttons">
        <button class="delete-cart-btn" onclick="removeFromCart(${item.id})">حذف</button>
        <button class="edit-cart-btn" onclick="editCartItem(${item.id})">تعديل</button>
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
    cartItems = cartItems.filter(item => item.id != itemId);

    // 2. حفظ المصفوفة المحدثة في التخزين المحلي
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // 3. تحديث عرض المنتجات في الصفحة
    displayCartItems();
    
    // ملاحظة: يمكنك هنا استدعاء دالة تحديث الإجماليات (updateTotals() إذا كانت موجودة)

    updateCartTotals()
}

// ======================================================
// 🖼️ دالة عرض مودل التعديل (نسخة مُعدّلة من showModal)
// ======================================================
function openEditModal(cartItem) {
    const product = finalBaseProducts.find(r => r.id == cartItem.productId);
    const modalContent = document.getElementById("modalContent");
    
    if (!product) {
        alert("⚠️ خطأ: المنتج الأصلي غير موجود.");
        return;
    }

    // 1. إنشاء دوائر الألوان
    let colorsHTML = '';
    if (product.colors && product.colors.length > 0) {
        const productId = cartItem.productId;
        
        // نستخدم data-cart-item-id لتخزين معرف السلة هنا (مهم لـ selectColor/saveEdit)
        colorsHTML = `<div class="color-container" id="colorContainer" data-cart-item-id="${cartItem.id}" style="display:flex; gap:10px; margin:12px 0; align-items:center;">
            ${product.colors.filter(c => c.code).map(c => `
                <div 
                    class="color-circle" 
                    title="${c.name}" 
                    onclick="selectColor(this, '${productId}', '${c.name}', '${c.code}')" 
                    style="width:28px; height:28px; border-radius:50%; background:${c.code}; cursor:pointer; box-shadow:0 2px 6px #0001;"
                ></div>
            `).join('')}
        </div>`;
    }

    // 2. إنشاء محتوى المودل (بزر "حفظ التعديلات")
    modalContent.innerHTML = `
        <div class="container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <div>
                    <h2>${product.name}</h2>
                    <h3>${product.price} ل.س</h3>
                </div>
                <img src="./${product.image}" alt="${product.name}" style="width: 80px; height: 80px;">
            </div>
            ${colorsHTML}
            <input type="number" id="pQ" placeholder="الكمية" value="${cartItem.quantity}" required>
            
            <button onClick="saveEdit(${cartItem.id})">حفظ التعديلات</button>
        </div>
    `;

    // 3. فتح المودل وتعبئة اللون المختار مسبقًا
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("overlay").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    
    // 💡 التعبئة المسبقة للون المختار
    const colorContainer = document.getElementById("colorContainer");
    if (colorContainer) {
        // تخزين اللون الحالي في dataset لـ saveEdit
        colorContainer.dataset.selectedColor = JSON.stringify(cartItem.selectedColor);
        
        // البحث عن دائرة اللون وتطبيق فئة التمييز
        const selectedCircle = Array.from(document.querySelectorAll('.color-circle')).find(circle => 
            circle.style.background.toLowerCase().includes(cartItem.selectedColor.code.toLowerCase().replace('#', ''))
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
    const cartItem = cartItems.find(item => item.id == itemId);

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
    const cartItemIndex = cartItems.findIndex(item => item.id == itemId);
    const qInput = document.getElementById("pQ");
    const colorContainer = document.getElementById("colorContainer");

    if (cartItemIndex === -1) {
        alert("⚠️ خطأ في العثور على عنصر السلة للتعديل.");
        return;
    }

    const selectedColorData = colorContainer.dataset.selectedColor;
    const quantity = parseInt(qInput.value) || 1;

    if (!selectedColorData) {
        alert("⚠️ يرجى اختيار لون للمنتج");
        return;
    }

    const selectedColor = JSON.parse(selectedColorData);

    // 1. تحديث بيانات العنصر
    cartItems[cartItemIndex].quantity = quantity;
    cartItems[cartItemIndex].selectedColor = selectedColor;
    
    // 2. حفظ في localStorage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    // 3. إغلاق المودل وإعادة تعيين العرض
    closeModal();
    displayCartItems(); // إعادة عرض السلة لعكس التعديلات
    updateCartTotals()

    alert(`✅ تم حفظ التعديلات بنجاح!`);
}

// ======================================================
// 🎨 دالة اختيار اللون (نفس التي في صفحة الإضافة)
// ======================================================
function selectColor(clickedElement, productId, colorName, colorCode) {
    const product = finalBaseProducts.find(p => p.id == productId);
    if (!product) return;

    const colorContainer = document.getElementById("colorContainer");

    // 1. تخزين اللون المختار في dataset
    colorContainer.dataset.selectedColor = JSON.stringify({
        name: colorName,
        code: colorCode
    });

    // 2. إلغاء التمييز عن جميع دوائر الألوان
    const colorOptions = document.querySelectorAll(".color-circle");
    colorOptions.forEach(opt => {
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
    }})


    // ======================================================
// 📊 حساب وتحديث إجمالي السلة
// ======================================================
function updateCartTotals() {
    let totalQuantity = 0;
    let totalPrice = 0;

    cartItems.forEach(item => {
        const product = finalBaseProducts.find(p => p.id == item.productId);
        if (product) {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * product.price;
        }
    });

    // عرض النتائج في الـ HTML
    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = `${totalPrice.toLocaleString()} ل.س`;
}


function sendTelegramOrder() {
    // ⚠️ يجب التأكد من صحة الحقول قبل الإرسال
    const customerName = document.getElementById("customerName").value;
    const customerPhone = document.getElementById("customerPhone").value;
    
    if (customerName.trim() === "" || customerPhone.trim() === "") {
        alert("⚠️ يرجى تعبئة جميع معلومات التواصل (الاسم ورقم الهاتف).");
        return;
    }
    
    // ... (بقية كود الإرسال إلى Telegram الذي يعمل الآن)
    
    const BOT_TOKEN = "8574296855:AAHWLVBmKLQs95L4dnLHNdAQnp9fPcruUH8"; 
    const CHAT_ID = "1210190096"; 

    // 1. الحصول على الكود والتفاصيل
    const { code: encodedCode, details: encodedDetails } = formatOrderDetails();

    // 2. بناء عناوين الـ API
    const codeApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedCode}`;
    const detailsApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedDetails}`;

    // إظهار رسالة تحميل أو تعطيل الزر لمنع الضغط المتعدد
    document.getElementById("checkoutBtn").disabled = true; 
    document.getElementById("checkoutBtn").textContent ="جاري إرسال الرسالة 1/2 (الكود)..."; 

    // 🛑 الإرسال الأول: الكود فقط
    fetch(codeApiUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.ok) {
                throw new Error(data.description || 'فشل إرسال الكود.');
            }
            
            // تحديث رسالة التحميل
            document.getElementById("checkoutBtn").textContent = "جاري إرسال الرسالة 2/2 (التفاصيل)...";

            // 🛑 الإرسال الثاني: التفاصيل الكاملة
            return fetch(detailsApiUrl);
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                // ✅ النجاح الكامل: مسح السلة ورسالة التأكيد
                cartItems = [];
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                displayCartItems(); 
                
                alert("✅ تم إرسال طلبك بنجاح! سيتم التواصل معكم عبر الهاتف قريباً.");
                resetCheckoutButton();
            } else {
                throw new Error(data.description || 'فشل إرسال التفاصيل.');
            }
        })
        .catch(error => {
            // ❌ معالجة الأخطاء (إذا فشل إرسال الكود أو التفاصيل أو الاتصال)
            alert(`⚠️ خطأ في إرسال الطلب: ${error.message}`);
            console.error("Telegram API Error Details:", error);
            
            // إعادة تمكين الزر في حالة الفشل
            document.getElementById("checkoutBtn").disabled = false;
            document.getElementById("checkoutBtn").textContent = "تأكيد الطلب";
        });
}

// ======================================================
// 🔄 دالة لتعيين حالة الزر مرة أخرى
// ======================================================
function resetCheckoutButton() {
    // إخفاء حقول العميل وتعديل الزر إلى الحالة الأصلية
    document.getElementById("customerInfoFields").classList.add("hidden");
    document.getElementById("checkoutBtn").textContent = "تأكيد الطلب";
    document.getElementById("checkoutBtn").dataset.stage = 'initial';
    document.getElementById("checkoutBtn").disabled = false;

    // تنظيف الحقول (اختياري)
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
}

// ======================================================
// 🕹️ دالة التحكم الرئيسية (Stage Controller)
// ======================================================
function handleCheckout() {
    const checkoutBtn = document.getElementById("checkoutBtn");
    
    if (cartItems.length === 0) {
        alert("❌ السلة فارغة! لا يمكن تأكيد الطلب.");
        return;
    }

    const currentStage = checkoutBtn.dataset.stage || 'initial';

    if (currentStage === 'initial') {
        // --- المرحلة 1: عرض حقول الإدخال ---
        
        // 1. إظهار حقول العميل
        document.getElementById("customerInfoFields").classList.remove("hidden");
        // 2. تحديث نص الزر
        checkoutBtn.textContent = "حفظ وإرسال الطلب";
        // 3. الانتقال إلى المرحلة التالية
        checkoutBtn.dataset.stage = 'confirm';
        // 4. تعيين placeholder الافتراضي وتوجيه المستخدم
        updateShippingPlaceholder(); 
        document.getElementById("customerName").focus();
        
    } else if (currentStage === 'confirm') {
        // --- المرحلة 2: التحقق والإرسال لـ Telegram ---
        
        // 1. التحقق من الحقول قبل الإرسال
        if (!validateCustomerInputs()) {
            return; // توقف إذا كانت الحقول غير مكتملة
        }
        
        // 2. استدعاء دالة الإرسال
        sendTelegramOrder();
    }
}

// ======================================================
// 🔄 تهيئة الزر عند تحميل الصفحة
// ======================================================
window.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
    // تعيين المرحلة الافتراضية للزر عند التحميل
    document.getElementById("checkoutBtn").dataset.stage = 'initial';
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
    const shippingTypeDisplay = shippingTypeElement.value === 'delivery' ? 'شحن' : 'ضمن حمص';
    const shippingDetails = document.getElementById("shippingDetails").value.trim();
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
        const product = finalBaseProducts.find(p => p.id == item.productId);
        if (product) {
            totalQuantity += item.quantity;
            totalPrice += item.quantity * product.price;

            messageText += `${index + 1}. ${product.name}\n`;
            messageText += `   - اللون: ${item.selectedColor.name}\n`;
            messageText += `   - الكمية: ${item.quantity} قطعة\n`;
            messageText += `   - السعر الإفرادي: ${product.price.toLocaleString()} ل.س\n`;
            messageText += `------------------------------\n`;
        }
    });

    messageText += `\n💰 الإجمالي الكلي:\n`;
    messageText += `   - العدد الكلي: ${totalQuantity} منتجات\n`;
    messageText += `   - إجمالي المبلغ: ${totalPrice.toLocaleString()} ل.س\n`;
    messageText += `==================================`;

    const encodedDetails = encodeURIComponent(messageText);
    const encodedCode = encodeURIComponent(displayCode); // الكود وحده

    // 🛑 الإرجاع: نُرجع كائناً يحتوي على الرسالتين المشفرتين
    return {
        code: encodedCode,
        details: encodedDetails
    };
}

// ======================================================
// 🔄 تحديث نص placeholder بناءً على نوع التسليم
// ======================================================
function updateShippingPlaceholder() {
    const shippingType = document.getElementById("shippingType").value;
    const detailsInput = document.getElementById("shippingDetails");

    if (shippingType === 'delivery') {
        detailsInput.placeholder = "العنوان التفصيلي للشحن (مثلاً: رقم الطرد، الفرع)";
    } else {
        detailsInput.placeholder = "موقع التسليم المفصل ضمن حمص";
    }
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
        alert("⚠️ يرجى تعبئة جميع معلومات التواصل والموقع الإلزامية.");
        return false;
    }
    return true;
}


function generateOrderCode() {
    // 1. تجميع بيانات العميل من الحقول
    const customerName = document.getElementById("customerName").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();
    const customerCity = document.getElementById("customerCity").value.trim();
    const shippingType = document.getElementById("shippingType").value === 'delivery'; // true: شحن, false: ضمن حمص
    const shippingDetails = document.getElementById("shippingDetails").value.trim();
    const shippingDateRaw = document.getElementById("shippingDate").value.trim();
    const shippingDate = shippingDateRaw || new Date().toISOString().slice(0, 10);
    const notes = document.getElementById("notes").value.trim();

    // 💡 سعر الصرف الذي سيتم استخدامه في كود التشفير
    // ⚠️ يجب أن يتطابق هذا السعر مع السعر المستخدم في دالة calculateTotals في صفحة الفواتير إن كانت تعتمد على الدولار
    const USD_RATE = 1000; 

    // 2. حساب الإجمالي الكلي وتفاصيل المنتجات (مع إضافة priceSYP و priceUSD)
    let totalSYP = 0;
    let totalUSD = 0;

    const productsArray = cartItems.map(item => {
        const product = finalBaseProducts.find(p => p.id == item.productId);
        if (!product) return null;

        // نفترض أن product.price هو السعر بالليرة السورية (SYP)
        const priceSYP = parseFloat(product.price) || 0;
        // حساب السعر المكافئ بالدولار
        const priceUSD = priceSYP / USD_RATE; 

        totalSYP += item.quantity * priceSYP;
        totalUSD += item.quantity * priceUSD;

        return {
            name: product.name,
            quantity: item.quantity,
            // 🛑 إضافة المفاتيح الصحيحة التي تحتاجها صفحة الفواتير
            priceSYP: priceSYP, 
            priceUSD: priceUSD, 
            color: item.selectedColor ? {
                name: item.selectedColor.name || '',
                code: item.selectedColor.code || ''
            } : null
        };
    }).filter(Boolean);

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
            status: 'unpaid',
            paidSYP: 0,
            remainingSYP: totalSYP 
        },
        
        // 🛑 إضافة الإجماليين هنا للمقارنة
        totalSYP: totalSYP, 
        totalUSD: totalUSD, 

        products: productsArray // استخدام مصفوفة المنتجات التي تم إنشاؤها
    };

    // 4. تشفير الكائن
    return encodeInvoice(orderObject);
}