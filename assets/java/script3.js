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

    if (!product) return; // لو المنتج الأصلي غير موجود

        // ----------------------------------------------------------------------------------
        // 💡 منطق عرض الطلب المخصص 💡
        // ----------------------------------------------------------------------------------
        let detailsHTML = '';
        let editButtonHTML = '';

        if (item.isCustom) {
            // للعرض المخصص: نعرض الوصف فقط
            detailsHTML = `
                <p>الكمية: 1 (طلب)</p>
                <p style="font-weight: bold; color: #007bff; margin-top: 5px;">الوصف المخصص:</p>
                <textarea readonly style="width: 100%; border: 1px solid #ccc; padding: 5px; border-radius: 4px; resize: none; height: 80px; font-size: 14px; background: #f9f9f9;">${item.customDescription || 'لا يوجد وصف.'}</textarea>
            `;
            // لا يوجد زر تعديل للطلبات المخصصة (لأن التعديل قد يتطلب تغيير السعر)
            editButtonHTML = `<button class="edit-cart-btn" onclick="showToast('⚠️ لا يمكن تعديل الطلب المخصص من هنا. يرجى الحذف وإعادة الإضافة.', 3000, 'orange')">تعديل</button>`;
            
        } else {
            // للمنتجات القياسية: نعرض اللون والكمية والسعر
            const itemColorCode = item.selectedColor.code.toLowerCase().trim();
            let colorStyle = `color:${itemColorCode}; font-weight:bold;`;

            // إذا كان كود اللون فاتحاً، نطبق إطار أسود
            if (itemColorCode === '#ffffff' || itemColorCode === '#fff' || itemColorCode === 'white' || itemColorCode === '#f5f5dc' || itemColorCode === '#5dadec' || itemColorCode === '#ffff00' || itemColorCode === '#40e0d0') {
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

    // 💡 المنطق الجديد: التحقق من اللون الأبيض
    const itemColorCode = item.selectedColor.code.toLowerCase().trim();
    let colorStyle = `color:${itemColorCode}; font-weight:bold;`;

    // إذا كان كود اللون أبيض (بصيغة #FFFFFF أو #FFF أو white)
    if (itemColorCode === '#ffffff' || itemColorCode === '#fff' || itemColorCode === 'white' || itemColorCode === '#f5f5dc' || itemColorCode === '#5dadec' || itemColorCode === '#ffff00' || itemColorCode === '#40e0d0') {
        // تطبيق إطار أسود (Text Stroke/Shadow) لجعل النص مرئياً
        colorStyle += ` text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important;`;
    }

    const card = document.createElement("div");
    card.classList.add("cart-card");

    card.innerHTML = `
        <h3>${product.name}</h3>
      <div class="cart-info">
      <img class="cart-image" src="${product.images[0]}" alt="${product.name}" style="width:120px; height:120px; border-radius:10px 10px 25px 10px; object-fit:contain;">
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

    // 💡 (تعديل جديد) منع التعديل للمنتجات المخصصة
    if (cartItem.isCustom) {
        showToast('⚠️ لا يمكن تعديل الطلب المخصص من صفحة السلة. يرجى الحذف وإعادة الإضافة.', 4000, '#d32f2f');
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
                <img src="./${product.images[0]}" alt="${product.name}" style="width: 80px; height: 80px;">
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
        showToast("⚠️ يرجى اختيار لون للمنتج", 3000, 'orange');
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

    showToast(`✅ تم حفظ التعديلات بنجاح!`, 3000, 'green');
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


// ======================================================
// 📤 دالة إرسال الطلب لـ Telegram (مُعدَّلة)
// ======================================================
function sendTelegramOrder() {
    // ⚠️ يجب التأكد من صحة الحقول قبل الإرسال (تم التحقق منها في handleCheckout)
    const BOT_TOKEN = "8574296855:AAHWLVBmKLQs95L4dnLHNdAQnp9fPcruUH8"; 
    const CHAT_ID = "1604687718"; 
    
    // 1. الحصول على الكود والتفاصيل
    const { code: encodedCode, details: encodedDetails } = formatOrderDetails();

    // 2. بناء عناوين الـ API
    const codeApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedCode}`;
    const detailsApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedDetails}`;

    // إظهار رسالة تحميل أو تعطيل الزر لمنع الضغط المتعدد
    document.getElementById("checkoutBtn").disabled = true; 
    document.getElementById("checkoutBtn").textContent ="جاري إرسال الرسالة 1/2 (الكود)..."; 

    // دالة مساعدة لضمان نجاح استجابة HTTP 
    const checkResponse = (response) => {
        if (!response.ok) {
            // إذا كانت الاستجابة HTTP غير ناجحة (مثل 404 أو 500)
            throw new Error(`فشل إرسال الطلب. رمز الاستجابة: ${response.status}`);
        }
        return response.json();
    };

    // 🛑 الإرسال الأول: الكود فقط
    fetch(codeApiUrl)
        .then(checkResponse) // التحقق من HTTP ثم قراءة JSON
        .then(data => {
            if (!data.ok) {
                // إذا رد Telegram بخطأ (مثل CHAT_ID غير صحيح)
                throw new Error(data.description || 'فشل إرسال الكود عبر Telegram.');
            }
            
            // تحديث رسالة التحميل
            document.getElementById("checkoutBtn").textContent = "جاري إرسال الرسالة 2/2 (التفاصيل)...";

            // 🛑 الإرسال الثاني: التفاصيل الكاملة
            return fetch(detailsApiUrl);
        })
        .then(checkResponse) // التحقق من HTTP ثم قراءة JSON
        .then(data => {
            if (data.ok) {
                // ✅ النجاح الكامل: مسح السلة ورسالة التأكيد
                cartItems = [];
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                displayCartItems(); 
                
                showConfirmationModal();
                resetCheckoutButton();
            } else {
                // إذا رد Telegram بخطأ في الرسالة الثانية
                throw new Error(data.description || 'فشل إرسال التفاصيل عبر Telegram.');
            }
        })
        .catch(error => {
            // ❌ معالجة الأخطاء
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

    updateCartTotals();
}

// ======================================================
// 🕹️ دالة التحكم الرئيسية (Stage Controller)
// ======================================================
function handleCheckout() {
    const checkoutBtn = document.getElementById("checkoutBtn");
    
    if (cartItems.length === 0) {
        showToast("❌ السلة فارغة! لا يمكن تأكيد الطلب.", 5000, 'red');
        return;
    }

    const currentStage = checkoutBtn.dataset.stage || 'initial';

    if (currentStage === 'initial') {
        // --- المرحلة 1: عرض حقول الإدخال ---
        
        // 1. إظهار حقول العميل
        document.getElementById("customerInfoFields").classList.remove("hidden");

        document.getElementById("closeBtn").classList.remove("hidden");
        // 2. تحديث نص الزر
        checkoutBtn.textContent = "حفظ وإرسال الطلب";
        // 3. الانتقال إلى المرحلة التالية
        checkoutBtn.dataset.stage = 'confirm';
        // 4. تعيين placeholder الافتراضي وتوجيه المستخدم
        updateShippingPlaceholder();

        setFutureDateMin(); // نضبط أقل تاريخ مسموح به (الغد)

        document.getElementById("customerName").focus();
        
    } else if (currentStage === 'confirm') {
        // --- المرحلة 2: التحقق والإرسال لـ Telegram ---
        
        // 1. التحقق من الحقول قبل الإرسال
        if (!validateCustomerInputs()) {
            return; // توقف إذا كانت الحقول غير مكتملة
        }

        // -----------------------------------------------------
        // 💡 التحقق من قاعدة الستيكرات (3 ستيكرات على الأقل) 💡
        // -----------------------------------------------------
        let totalStickerCount = 0;

        cartItems.forEach(item => {
            // العثور على المنتج الأصلي من مصفوفة finalBaseProducts
            const product = finalBaseProducts.find(p => p.id == item.productId);

            if(product.categories[0] != 'ستيكر'){
                totalStickerCount=100;
            }
            
            // التحقق: إذا كان المنتج موجوداً ويحتوي على تصنيفات، والتصنيف الأول فيه كلمة 'ستيكر'
            if (product && product.categories && product.categories.length > 0 && product.categories[0]=== 'ستيكر') { 
                totalStickerCount += item.quantity;

            }
        });



        // تطبيق الشرط: إذا كان هناك ستيكرات (الكمية > 0) وكانت الكمية الإجمالية أقل من 3
        if (totalStickerCount > 0 && totalStickerCount < 3) {
            showToast(`⚠️ عذراً، يجب طلب 3 ستيكرات على الأقل لإتمام عملية الشراء. (الكمية الحالية: ${totalStickerCount})`, 5000, 'orange');

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
            // 💡 (تعديل جديد) حساب الإجمالي والكمية بشكل صحيح
            totalQuantity += item.quantity; 
            totalPrice += item.quantity * product.price;

            messageText += `${index + 1}. ${product.name}\n`;

            if (item.isCustom) {
                // للمنتجات المخصصة: نعرض الوصف المخصص
                messageText += `   - *نوع الطلب: مخصص*\n`;
                messageText += `   - الوصف: ${item.customDescription || 'لا يوجد وصف.'}\n`;
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
        showToast("⚠️ يرجى تعبئة جميع معلومات التواصل والموقع الإلزامية.", 3000, 'red');
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
        showToast("❌ يرجى اختيار تاريخ شحن مستقبلي (لا يمكن الشحن في نفس اليوم أو يوم سابق).", 3000, 'red');
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
    const shippingType = document.getElementById("shippingType").value === 'delivery'; // true: شحن, false: ضمن حمص
    const shippingDetails = document.getElementById("shippingDetails").value.trim();
    const shippingDateRaw = document.getElementById("shippingDate").value.trim();
    const shippingDate = shippingDateRaw || new Date().toISOString().slice(0, 10);
    const notes = document.getElementById("notes").value.trim();

    let totalSYP = 0;

    const productsArray = cartItems.map(item => {
        const product = finalBaseProducts.find(p => p.id == item.productId);
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
                customDescription: item.customDescription || 'لا يوجد وصف مخصص.' // الوصف المباشر
            };
        }

        else {
            // التعامل مع المنتج القياسي (دون تغيير)
            const priceSYP = parseFloat(product.price) || 0;
            totalSYP += item.quantity * priceSYP;

            return {
                name: product.name,
                quantity: item.quantity,
                priceSYP: priceSYP, 
                priceAtOrder: priceSYP,
                color: item.selectedColor ? {
                    name: item.selectedColor.name || '',
                    code: item.selectedColor.code || ''
                } : null,
                isCustom: false // علامة مميزة
            };
        }
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

        products: productsArray // استخدام مصفوفة المنتجات التي تم إنشاؤها
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
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000)); 
    
    // تنسيق التاريخ إلى YYYY-MM-DD
    const year = tomorrow.getFullYear();
    // نستخدم padStart لضمان وجود الصفر في الأرقام الفردية (01، 09)
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');

    const minDate = `${year}-${month}-${day}`;
    
    // تعيين خاصية min
    shippingDateInput.min = minDate;
}

document.addEventListener('DOMContentLoaded', () => {
    const invoicesLink = document.getElementById('invoicesLink');
    const dividers = document.getElementById('firstDivider');
    
    if (isAdmin()) {
        
    } else {
        invoicesLink.style.display = 'none';  // إذا لم يكن مديراً، يتم إخفاء الزر
        dividers.style.display = 'none';
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
    document.getElementById('confirmationOverlay').classList.remove('hidden');
    document.getElementById('confirmationModal').classList.remove('hidden');
}

/**
 * إغلاق مودال التأكيد
 */
function closeConfirmationModal() {
    document.getElementById('confirmationOverlay').classList.add('hidden');
    document.getElementById('confirmationModal').classList.add('hidden');
}

// إغلاق المودال عند الضغط على زر الهروب (Escape)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeConfirmationModal();
    }
});

function closeCustomerInfoFields() {
    if (confirm("هل تريد إلغاء عملية الشراء؟ سيتم مسح جميع البيانات المدخلة.")) {
        resetCheckoutButton();
    }
}