// دالة حساب المجموع من المنتجات
function calculateTotals(products) {
    if (!Array.isArray(products)) {
        console.error('calculateTotals: products is not an array', products);
        return { totalSYP: 0, totalUSD: 0 };
    }
    
    try {
        return products.reduce((totals, p) => {
            // التحقق من وجود القيم المطلوبة
            const priceSYP = Number(p.priceSYP) || 0;
            const priceUSD = Number(p.priceUSD) || 0;
            const quantity = Number(p.quantity) || 0;
            
            return {
                totalSYP: totals.totalSYP + (priceSYP * quantity),
                totalUSD: totals.totalUSD + (priceUSD * quantity)
            };
        }, { totalSYP: 0, totalUSD: 0 });
    } catch (error) {
        console.error('Error in calculateTotals:', error, products);
        return { totalSYP: 0, totalUSD: 0 };
    }
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
  if (includes(invoice.id) || includes(invoice.id?.toString().padStart(3, '0'))) return true;

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
    invoice.totalUSD
  ];
  if (fields.some(f => includes(f))) return true;

  // shipping flag
  if (typeof invoice.shipping === 'boolean' && String(invoice.shipping).includes(q)) return true;

  // products (name, color name, color code)
  if (Array.isArray(invoice.products)) {
    for (const p of invoice.products) {
      if (includes(p.name) || includes(p.quantity) || includes(p.priceSYP) || includes(p.priceUSD)) return true;
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
    const input = document.getElementById('searchInput');
    const q = input ? input.value.toString().trim() : '';
    renderInvoices(q);
  } catch (e) {
    console.error('searchInvoices error:', e);
  }
}

function renderInvoices(filterQuery = '') {
  const invoicesDiv = document.getElementById("invoices");
  invoicesDiv.innerHTML = "";

  const allInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
  const storedInvoices = allInvoices.filter(inv => invoiceMatches(inv, filterQuery));

  storedInvoices.forEach(invoice => {
    const invoiceCard = document.createElement("div");
    invoiceCard.classList.add("invoice-card");

    let productsHTML = "";
    const productsArr = Array.isArray(invoice.products) ? invoice.products : [];
    if (!Array.isArray(invoice.products)) {
      console.warn('فاتورة بدون قائمة منتجات أو بقيمة غير صحيحة (سيتم عرضها فارغة):', invoice.id);
    }

    productsArr.forEach(product => {
      const colorCode = (product?.color?.code) || '';
      const colorTitle = (product?.color?.name) || '';
      const safePriceSYP = Number(product.priceSYP) || 0;
      
      productsHTML += `
        <li class="product-item">
          <span class="product-name">${product.name}</span>
          <span class="product-color" title="${colorTitle}" style="background-color: ${colorCode}"></span>
          <span class="product-qty">x${product.quantity}</span>
          <span class="product-price">${safePriceSYP.toLocaleString()} ل.س</span>
        </li>
      `;
    });

    const { totalSYP, totalUSD } = calculateTotals(productsArr);
        // ✅ إصلاح: استخدام القيم الآمنة
    const safeTotalSYP = totalSYP || 0;
    const safeTotalUSD = totalUSD || 0;

    const payment = invoice.payment || { status: 'unpaid', paidSYP: 0, remainingSYP: safeTotalSYP };
    if (payment.remainingSYP === undefined) payment.remainingSYP = safeTotalSYP - (payment.paidSYP || 0);
    const notes = invoice.notes || '';

    invoiceCard.innerHTML = `
      <div class="invoice-header">
        <h4>فاتورة #${invoice.id.toString().padStart(3, '0')}</h4>
        <span class="invoice-date">${invoice.date}</span>
      </div>

      <div class="invoice-body">
        <div class="invoice-info">
          <p><strong>المشتري :</strong> ${invoice.customerName}</p>
          <div class="invoice-contacts-logo">
          <div>
          <p><strong>هاتف :</strong> ${invoice.phone}</p>
          <p><strong>محافظة :</strong> ${invoice.city}</p>
          <p><strong>نوع التسليم :</strong> ${invoice.shipping ? 'شحن' : 'ضمن حمص' }</p>
          ${invoice.shipping ? (`<p><strong>شركة الشحن :</strong> ${invoice.shippingCompany || '-'}</p>
          <p><strong>معلومات الشحن :</strong> ${invoice.shippingInfo || '-'}</p>`) : (`<p><strong>الموقع:</strong> ${invoice.shippingInfo || '-'}</p>`)}
          </div>
          <img class="invoice-logo" src="./assets/imgs/log_png-removebg-preview.png">
          </div>
          <p><strong>موعد التسليم :</strong> ${invoice.shippingDate || '-'}</p>
          ${payment.status !== 'paid-partial' ? `<p><strong>حالة الدفع :</strong> ${payment.status === 'unpaid' ? 'لم يدفع' : 'دُفع كامل'}</p>` : ''}
      

          ${notes ? `<p><strong>ملاحظات :</strong> ${notes}</p>` : ''}

          <div class="invoice-products-toggle">
            <p><strong>المنتجات :</strong></p>
            <hr class="invoice-hr">
            <button class="btn-toggle-products" title="عرض المنتجات"><i class="fa fa-chevron-down"></i></button>
          </div>
        </div>

        <div class="invoice-products hidden">
          <ul>${productsHTML}</ul>
        </div>
      </div>

      <div class="invoice-footer">
  <div class="invoice-info">
    <span class="total">الإجمالي: ${safeTotalSYP.toLocaleString()} ل.س / ${safeTotalUSD}$</span>

    ${payment.status === 'paid-partial' ? `
      <p><strong>المبلغ المدفوع :</strong> ${(payment.paidSYP || 0).toLocaleString()} ل.س</p>
      <p><strong>المتبقي :</strong> ${(payment.remainingSYP || (safeTotalSYP - (payment.paidSYP || 0))).toLocaleString()} ل.س</p>
    ` : ''}

    
  </div>

  <button class="btn-view" onclick="editInvoice(${invoice.id})">تعديل الفاتورة</button>
</div>

    `;

    invoicesDiv.appendChild(invoiceCard);

    // ✅ إظهار/إخفاء زر تعديل الفاتورة
    invoiceCard.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-view") || e.target.closest(".btn-toggle-products")) return;
      document.querySelectorAll(".btn-view.visible-btn").forEach(btn => {
        if (btn !== invoiceCard.querySelector(".btn-view")) {
          btn.classList.remove("visible-btn");
        }
      });
      invoiceCard.querySelector(".btn-view").classList.toggle("visible-btn");
    });

    // ✅ إظهار/إخفاء قائمة المنتجات + تغيير الأيقونة
    const toggleBtn = invoiceCard.querySelector(".btn-toggle-products");
    const productsDiv = invoiceCard.querySelector(".invoice-products");
    toggleBtn.addEventListener("click", () => {
      productsDiv.classList.toggle("hidden");
      const icon = toggleBtn.querySelector("i");
      if (productsDiv.classList.contains("hidden")) {
        icon.classList.remove("fa-chevron-up");
        icon.classList.add("fa-chevron-down");
      } else {
        icon.classList.remove("fa-chevron-down");
        icon.classList.add("fa-chevron-up");
      }
    });
  });
}


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
    document.getElementById("totalUSD").textContent = "0";

    // إخفاء حقول الشحن والموقع
    document.getElementById("shippingFields").classList.add("hidden");
    document.getElementById("localFields").classList.add("hidden");

    // حذف معرف التعديل
    delete form.dataset.editingId;
  // إخفاء زر الحذف عند إعادة التهيئة (فقط يظهر أثناء التعديل)
  const delBtn = document.getElementById("deleteInvoiceBtn");
  if (delBtn) delBtn.classList.add('hidden');
    // تأكد أن حقل اختيار طريقة التسليم فارغ ويُخفي الحقول المرتبطة
    const deliverySelect = document.getElementById("deliveryType");
    if (deliverySelect) {
      deliverySelect.value = "";
      toggleShippingFields();
    }
    // إعادة تعيين حقول الدفع والملاحظات
    const paymentSelect = document.getElementById('paymentStatus');
    if (paymentSelect) paymentSelect.value = 'unpaid';
    const paymentAmountEl = document.getElementById('paymentAmountPaid');
    if (paymentAmountEl) {
      paymentAmountEl.value = '';
      paymentAmountEl.classList.add('hidden');
    }
    const notesEl = document.getElementById('invoiceNotes');
    if (notesEl) notesEl.value = '';
}

/**
 * فتح مودال الفاتورة لإضافة أو تعديل، مع دعم الاختيار المسبق للمتجر.
 * @param {number | null} targetStoreId - معرّف المتجر الذي يجب اختياره مسبقًا عند الإضافة.
 */

function openNewInvoiceModel(targetStoreId=null) {
    // إعادة تعيين النموذج فقط إذا كنا نضيف فاتورة جديدة
    if (!document.getElementById("invoiceForm").dataset.editingId) {
        resetForm();
    }

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
  const status = document.getElementById('paymentStatus')?.value;
  const paymentAmountEl = document.getElementById('paymentAmountPaid');
  if (!paymentAmountEl) return;
  if (status === 'paid-partial') {
    paymentAmountEl.classList.remove('hidden');
  } else {
    paymentAmountEl.classList.add('hidden');
    // إذا كانت دُفع كامل، نضع القيمة مساوية للإجمالي (سيتم ضبطها عند الحفظ)
    if (status === 'paid-full') {
      // leave empty here; during save we'll set paid = total
    } else {
      paymentAmountEl.value = '';
    }
  }
}

// 🟩 دالة تعديل الفاتورة
function editInvoice(id) {
    const allInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const invoice = allInvoices.find(inv => inv.id === id);
    if (!invoice) return alert("⚠️ لم يتم العثور على الفاتورة");

    // تعبئة الحقول بالقيم الحالية
    document.getElementById("buyerName").value = invoice.customerName;
    document.getElementById("buyerPhone").value = invoice.phone;
    document.getElementById("buyerProvince").value = invoice.city;
    document.getElementById("deliveryType").value = invoice.shipping ? "shipping" : "local";

    // تعبئة حقول الشحن
  if (invoice.shipping) {
    // نعرض حقل شركة الشحن ومعلومات الشحن
    document.getElementById("shippingCompany").value = invoice.shippingCompany || '';
    document.getElementById("shippingInfo").value = invoice.shippingInfo || '';
  } else {
    document.getElementById("localShippingInfo").value = invoice.shippingInfo || '';
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
  selectedProductsList.innerHTML = (Array.isArray(invoice.products) ? invoice.products : []).map(p => {
    const colorCode = p && p.color && p.color.code ? p.color.code : '';
    const colorName = p && p.color && p.color.name ? p.color.name : '';
    // ✅ إصلاح: استخدام القيمة الآمنة
        const priceSYP = p?.priceSYP || 0;
        
    return `
    <div class="selected-product">
      <div class="product-info">
        <span class="product-name">${p.name}</span>
        <div class="selected-color" title="${colorName}" style="background-color: ${colorCode}"></div>
        <span class="product-qty">x${p.quantity}</span>
        <span class="product-price">${p.priceSYP.toLocaleString()} ل.س</span>
      </div>
      <button type="button" class="remove-product" onclick="this.closest('.selected-product').remove(); updateTotals();">
        <i class="fa fa-times"></i>
      </button>
    </div>
  `;
  }).join('');

  // تحديث الإجماليات
  const safeProducts = Array.isArray(invoice.products) ? invoice.products : [];
  const { totalSYP, totalUSD } = calculateTotals(safeProducts);

    // ✅ إصلاح: استخدام القيم الآمنة
    const safeTotalSYP = totalSYP || 0;
    const safeTotalUSD = totalUSD || 0;

    document.getElementById("totalSYP").textContent = safeTotalSYP.toLocaleString();
    document.getElementById("totalUSD").textContent = safeTotalUSD.toString();

    // تعبئة حالة الدفع والملاحظات إن وجدت
    const paymentStatusEl = document.getElementById('paymentStatus');
    const paymentAmountEl = document.getElementById('paymentAmountPaid');
    if (paymentStatusEl && invoice.payment) {
      paymentStatusEl.value = invoice.payment.status || 'unpaid';
      if (invoice.payment.status === 'paid-partial') {
        if (paymentAmountEl) {
          paymentAmountEl.value = invoice.payment.paidSYP || 0;
          paymentAmountEl.classList.remove('hidden');
        }
      } else if (invoice.payment.status === 'paid-full') {
        if (paymentAmountEl) {
          paymentAmountEl.value = invoice.payment.paidSYP || safeTotalSYP || 0;
          paymentAmountEl.classList.add('hidden');
        }
      } else {
        if (paymentAmountEl) paymentAmountEl.classList.add('hidden');
      }
    }

    const notesEl = document.getElementById('invoiceNotes');
    if (notesEl) notesEl.value = invoice.notes || '';

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
  if (delBtn) delBtn.classList.remove('hidden');

    // فتح المودال
    openNewInvoiceModel(invoice.posId || null);
}

// تحديث: استخدام حوار تأكيد مخصص بدلاً من confirm/alert الافتراضي
function showDeleteConfirm() {
  const form = document.getElementById('invoiceForm');
  const id = form && form.dataset.editingId;
  if (!id) {
    console.warn('لم يتم تحديد فاتورة للحذف.');
    return;
  }

  const overlay = document.getElementById('confirmOverlay');
  const modal = document.getElementById('confirmModal');
  const msg = document.getElementById('confirmModalMessage');
  if (msg) msg.textContent = `هل أنت متأكد من حذف الفاتورة رقم ${id}؟ هذا الإجراء لا يمكن التراجع عنه.`;

  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('active');
  }
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('active');
  }
}

function cancelDelete() {
  const overlay = document.getElementById('confirmOverlay');
  const modal = document.getElementById('confirmModal');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.classList.add('hidden');
  }
  if (modal) {
    modal.classList.remove('active');
    modal.classList.add('hidden');
  }
}

function confirmDelete() {
  const form = document.getElementById('invoiceForm');
  const id = form && form.dataset.editingId;
  if (!id) {
    cancelDelete();
    return;
  }

  try {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const filtered = invoices.filter(inv => inv.id !== Number(id));
    localStorage.setItem('invoices', JSON.stringify(filtered));

    // اغلاق نافذة التأكيد + المودال الرئيسي واعادة عرض القائمة
    cancelDelete();
    closeModal();
    renderInvoices();
    // لا نستخدم alert هنا — التصميم يعتمد على حوار أنيق
  } catch (e) {
    console.error('خطأ أثناء حذف الفاتورة:', e);
    cancelDelete();
  }
}

// 🟨 دالة الحفظ (إضافة أو تعديل)
// 🟨 دالة الحفظ (إضافة أو تعديل) - تم تحديثها لـ: (1) حل خطأ toLocaleString، (2) حساب الدولار بشكل صحيح.
function saveInvoice() {
  try {
    // 💡 سعر الصرف الثابت المستخدم لحساب الدولار
    const USD_RATE = 1000; 

  const form = document.getElementById("invoiceForm");
  const buyerName = document.getElementById("buyerName").value;
  const buyerPhone = document.getElementById("buyerPhone").value;
  const buyerProvince = document.getElementById("buyerProvince").value;
  const deliveryType = document.getElementById("deliveryType").value;

  // 💡 التعديل #1: قراءة ID المتجر المختار من الـ Select
    const linkedStoresSelect = document.getElementById('linkedStores');
    let posId = null; // القيمة الافتراضية تكون null (بدون متجر)
    // إذا تم اختيار قيمة (وهي store ID)، نحولها لرقم
    if (linkedStoresSelect && linkedStoresSelect.value !== "") {
        posId = parseInt(linkedStoresSelect.value);
    }
  
  // معلومات الشحن: شركة الشحن + معلومات الشحن
  let shippingCompany = '';
  let shippingInfo = '';
  let shippingDate = '';
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
  const selectedProductsList = document.getElementById("selectedProductsList");
  const selectedProducts = Array.from(selectedProductsList.children).map(item => {
    const nameEl = item.querySelector(".product-name");
    const qtyEl = item.querySelector(".product-qty");
    const priceEl = item.querySelector(".product-price");
    
    const name = nameEl.textContent;
    const quantity = parseInt(qtyEl.textContent.replace("x", "")) || 1;
    
    // ✅ إصلاح #1: قراءة آمنة لسعر الليرة SYP لتجنب خطأ toLocaleString
    const priceText = priceEl ? priceEl.textContent : ''; 
    const priceSYP = parseInt(priceText.replace(/[^\d]/g, "")) || 0; 
    
    // البحث عن المنتج في finalBaseProducts للحصول على اللون
    const product = finalBaseProducts.find(p => p.name === name) || null;

    // حاول قراءة لون العنصر من DOM
    const colorEl = item.querySelector('.selected-color');
    const colorCode = colorEl ? (colorEl.style.backgroundColor || '') : '';
    const colorName = colorEl ? (colorEl.title || '') : '';

    return {
      name,
      quantity,
      priceSYP,
      // ✅ إصلاح #2: حساب priceUSD مباشرةً من priceSYP المُقرَأ
      priceUSD: priceSYP / USD_RATE, 
      color: { name: colorName, code: colorCode }
    };
  });

  // التحقق من صحة البيانات
  if (!buyerName || !buyerPhone || !buyerProvince || !deliveryType) {
    alert("⚠️ يرجى ملء جميع الحقول المطلوبة");
    return;
  }

  if (deliveryType === "shipping" && (!shippingCompany || !shippingInfo)) {
    alert("⚠️ يرجى ملء شركة الشحن ومعلومات الشحن");
    return;
  }

  if (deliveryType === "local" && !shippingInfo) {
    alert("⚠️ يرجى إدخال الموقع");
    return;
  }

  if (selectedProducts.length === 0) {
    alert("⚠️ يرجى إضافة منتج واحد على الأقل");
    return;
  }

  const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

  // حساب الإجمالي من المنتجات المختارة
  const { totalSYP, totalUSD } = calculateTotals(selectedProducts);

  // استخدام القيم الآمنة (مع أنها أصبحت آمنة بالفعل في calculateTotals)
    const safeTotalSYP = totalSYP || 0;
    const safeTotalUSD = totalUSD || 0;

  if (form.dataset.editingId) {
    // تعديل فاتورة
    const id = parseInt(form.dataset.editingId);
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      // قراءة حالة الدفع والملاحظات
      const paymentStatus = document.getElementById('paymentStatus') ? document.getElementById('paymentStatus').value : 'unpaid';
      const paymentAmountVal = document.getElementById('paymentAmountPaid') ? parseInt(document.getElementById('paymentAmountPaid').value || '0') : 0;
      let paidSYP = 0;
      if (paymentStatus === 'paid-full') paidSYP = safeTotalSYP;
      else if (paymentStatus === 'paid-partial') paidSYP = isNaN(paymentAmountVal) ? 0 : paymentAmountVal;
      const paymentObj = {
        status: paymentStatus,
        paidSYP: paidSYP,
        remainingSYP: Math.max(0, safeTotalSYP - paidSYP)
      };
      const notes = (document.getElementById('invoiceNotes') ? document.getElementById('invoiceNotes').value.trim() : '') || '';

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
        totalSYP:safeTotalSYP,
        totalUSD:safeTotalUSD,
        payment: paymentObj,
        notes,
        posId: posId
      };
    }
  } else {
    // إضافة فاتورة جديدة
    // قراءة حالة الدفع والملاحظات
    const paymentStatusNew = document.getElementById('paymentStatus') ? document.getElementById('paymentStatus').value : 'unpaid';
    const paymentAmountValNew = document.getElementById('paymentAmountPaid') ? parseInt(document.getElementById('paymentAmountPaid').value || '0') : 0;
    let paidSYPNew = 0;
    if (paymentStatusNew === 'paid-full') paidSYPNew = safeTotalSYP;
    else if (paymentStatusNew === 'paid-partial') paidSYPNew = isNaN(paymentAmountValNew) ? 0 : paymentAmountValNew;
    const paymentObjNew = {
      status: paymentStatusNew,
      paidSYP: paidSYPNew,
      remainingSYP: Math.max(0, safeTotalSYP - paidSYPNew)
    };
    const notesNew = (document.getElementById('invoiceNotes') ? document.getElementById('invoiceNotes').value.trim() : '') || '';

    const newInvoice = {
      id: Date.now(),
      date: new Date().toLocaleDateString("ar-SY"),
      customerName: buyerName,
      phone: buyerPhone,
      city: buyerProvince,
      shipping: deliveryType === "shipping",
      // نحتفظ بحقلَي شركة الشحن ومعلومات الشحن
      shippingCompany,
      shippingInfo,
      shippingDate,
      products: selectedProducts,
      totalSYP:safeTotalSYP,
      totalUSD:safeTotalUSD,
      payment: paymentObjNew,
      notes: notesNew,
      posId: posId
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
window.addEventListener("DOMContentLoaded", function() { renderInvoices(); });

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
}

// عرض قائمة المنتجات
function renderProductsList(searchQuery = '') {
  const dropdown = document.getElementById("productDropdown");
  dropdown.classList.remove("hidden");
  
  // فلترة المنتجات حسب البحث
  const filteredProducts = finalBaseProducts.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.shortDisc && product.shortDisc.toLowerCase().includes(searchLower)) ||
      product.price.toString().includes(searchLower)
    );
  });

  // إنشاء HTML للمنتجات
  const productsHTML = filteredProducts.map(product => `
    <div class="dropdown-item" onclick="selectProduct(${product.id})">
      <img src="${product.image || 'assets/imgs/placeholder.jpg'}" alt="${product.name}">
      <div class="product-info">
        <span class="product-name">${product.name}</span>
        <span class="product-price">
          ${(product.price * 1000).toLocaleString()} ل.س / ${product.price}$
        </span>
        ${product.shortDisc ? `<span class="product-desc">${product.shortDisc}</span>` : ''}
      </div>
      <div class="color-dots">
        ${product.colors?.slice(0, 5).map(color => `
          <span class="color-dot" 
                style="background-color: ${color.code}" 
                title="${color.name}">
          </span>
        `).join('')}
        ${product.colors?.length > 5 ? `
          <span class="color-dot more-colors" title="المزيد من الألوان">
            +${product.colors.length - 5}
          </span>
        ` : ''}
      </div>
    </div>
  `).join('');

  dropdown.innerHTML = productsHTML || '<div class="no-results">لا توجد نتائج</div>';
}

// معالجة البحث في المنتجات
function handleProductSearch(event) {
  const searchQuery = event.target.value;
  renderProductsList(searchQuery);
}

// اختيار منتج
function selectProduct(productId) {
  const product = finalBaseProducts.find(p => p.id === productId);
  if (!product) return;

  // إخفاء قائمة المنتجات وإظهار اختيار اللون
  document.getElementById("productDropdown").classList.add("hidden");
  document.getElementById("productInput").value = product.name;

  // إنشاء قائمة اختيار اللون
  const colorSelector = document.createElement("div");
  colorSelector.className = "color-selector";
  colorSelector.innerHTML = `
    <h4>اختر اللون المناسب:</h4>
    <div class="color-grid">
      ${product.colors.map(color => `
        <div class="color-option" 
             onclick="selectColor(${productId}, '${color.name}', '${color.code}')"
             style="background-color: ${color.code}"
             title="${color.name}">
        </div>
      `).join('')}
    </div>
  `;

  const bottomSheetContent = document.querySelector(".bottom-sheet-content");
  const existingSelector = bottomSheetContent.querySelector(".color-selector");
  if (existingSelector) {
    existingSelector.remove();
  }
  document.getElementById("productQuantity").parentElement.insertBefore(
    colorSelector,
    document.getElementById("productQuantity")
  );
}

// اختيار اللون
function selectColor(productId, colorName, colorCode) {
  const product = finalBaseProducts.find(p => p.id === productId);
  if (!product) return;

  // تخزين اللون المحدد
  document.getElementById("productInput").dataset.selectedColor = JSON.stringify({
    name: colorName,
    code: colorCode
  });

  // تحديث المظهر المرئي
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach(opt => {
    opt.classList.remove("selected");
    opt.style.borderColor = '';
  });

  // نحاول أن نجد العنصر المطابق ثم نضع له ستايل بوردر مطابق للون المختار
  const selectedOption = Array.from(colorOptions)
    .find(opt => {
      // القيم قد تكون بصيغ مختلفة (rgb/hex) لذلك نطابق الجزء الأخير من الكود إن أمكن
      const bg = (opt.style.backgroundColor || '').toLowerCase();
      const cc = colorCode.toLowerCase();
      return bg === cc || bg.includes(cc.replace('#', '')) || cc.includes(bg.replace(/\s/g, ''));
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
  const quantity = parseInt(document.getElementById("productQuantity").value) || 1;
  const selectedColorData = productInput.dataset.selectedColor;
  
  if (!productName) {
    alert("⚠️ يرجى اختيار منتج");
    return;
  }

  if (!selectedColorData) {
    alert("⚠️ يرجى اختيار لون للمنتج");
    return;
  }

  const product = finalBaseProducts.find(p => p.name === productName);
  if (!product) {
    alert("⚠️ المنتج غير موجود");
    return;
  }

  const selectedColor = JSON.parse(selectedColorData);

  // إضافة المنتج لقائمة المنتجات المحددة
  const selectedProductsList = document.getElementById("selectedProductsList");
  const productElement = document.createElement("div");
  productElement.className = "selected-product";
  productElement.innerHTML = `
    <div class="product-info">
      <span class="product-name">${product.name}</span>
      <span class="product-qty">x${quantity}</span>
      <span class="product-price">${(product.price * 1000).toLocaleString()} ل.س</span>
      <div class="selected-color" style="background-color: ${selectedColor.code}" title="${selectedColor.name}"></div>
    </div>
    <button type="button" class="remove-product" onclick="this.closest('.selected-product').remove(); updateTotals();">
      <i class="fa fa-times"></i>
    </button>
  `;
  selectedProductsList.appendChild(productElement);

  // تحديث الإجماليات
  updateTotals();

  // إغلاق البوتم شيت وإعادة تعيين الحقول
  // تأكد إغلاق البوتم شيت (force-close) لتجنب حالات بقاء الشيت مفتوح
  closeAddProductSheet();
  const addSheet = document.getElementById('addProductSheet');
  const overlay = document.getElementById('productSheetOverlay');
  const dropdown = document.getElementById('productDropdown');
  if (addSheet) addSheet.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  if (dropdown) dropdown.classList.add('hidden');
  productInput.value = "";
  // إزالة الداتا من dataset بدلاً من محاولة إزالة attribute غير موجود
  delete productInput.dataset.selectedColor;
  document.getElementById("productQuantity").value = "";

  // إزالة قائمة اختيار الألوان
  const colorSelector = document.querySelector(".color-selector");
  if (colorSelector) {
    colorSelector.remove();
  }
}

// تحديث إجماليات الفاتورة
function updateTotals() {
  const selectedProducts = Array.from(document.getElementById("selectedProductsList").children).map(item => {
    const nameEl = item.querySelector(".product-name");
    const qtyEl = item.querySelector(".product-qty");
    const colorEl = item.querySelector(".selected-color");
    
    const name = nameEl.textContent;
    const quantity = parseInt(qtyEl.textContent.replace("x", "")) || 1;
    const colorName = colorEl.title;
    const colorCode = colorEl.style.backgroundColor;
    
    // البحث عن المنتج في finalBaseProducts للحصول على الأسعار
    const product = finalBaseProducts.find(p => p.name === name);
    return {
      name,
      quantity,
      color: { name: colorName, code: colorCode },
      priceSYP: product ? product.price * 1000 : 0,
      priceUSD: product ? product.price : 0
    };
  });

  const { totalSYP, totalUSD } = calculateTotals(selectedProducts);
  
  // ✅ إصلاح: استخدام القيم الآمنة
  const safeTotalSYP = totalSYP || 0;
  const safeTotalUSD = totalUSD || 0;
  
  document.getElementById("totalSYP").textContent = safeTotalSYP.toLocaleString();
  document.getElementById("totalUSD").textContent = safeTotalUSD.toString();
}

// معالجة البحث عند الكتابة
document.addEventListener('DOMContentLoaded', function() {
  const productInput = document.getElementById("productInput");
  productInput.removeAttribute("readonly"); // جعل الحقل قابل للكتابة
  productInput.addEventListener("input", handleProductSearch);
  productInput.addEventListener("focus", () => renderProductsList(productInput.value));
});

// يجلب آخر فاتورة من localStorage ويولّد لها الكود
function onGenerateCode() {
  const arr = JSON.parse(localStorage.getItem('invoices')) || [];
  if (!arr.length) return alert('لا توجد فواتير في localStorage');
  const invoice = arr[arr.length - 1];
  try {
    const code = encodeInvoice(invoice); // من invoiceCodec.js
    document.getElementById('generatedInvoiceCode').textContent = code;
  } catch (e) {
    console.error(e);
    alert('خطأ في توليد الكود: ' + (e.message || e));
  }
}

// نسخ الكود من الـ pre
function copyGeneratedCode() {
  const txt = document.getElementById('generatedInvoiceCode').textContent.trim();
  if (!txt) return alert('لا يوجد كود للنسخ');
  navigator.clipboard?.writeText(txt).then(() => alert('تم نسخ الكود'), () => alert('فشل النسخ'));
}


function fillFormWithInvoice(invoice, allInvoices = []) {
  if (!invoice || typeof invoice !== 'object') {
    console.error('fillFormWithInvoice: invoice is invalid', invoice);
    return;
  }

  const form = document.getElementById('invoiceForm');
  if (!form) {
    console.warn('لا يوجد عنصر form بالمعرف invoiceForm');
    return;
  }
  
  // ----------------------------------------------------
  // الحقول الأساسية
  // ----------------------------------------------------
  const buyerNameEl = document.getElementById('buyerName');
  const buyerPhoneEl = document.getElementById('buyerPhone');
  const buyerProvinceEl = document.getElementById('buyerProvince');
  const deliveryTypeEl = document.getElementById('deliveryType');

  // تعبئة الحقول الأساسية مع القيم الآمنة
  if (buyerNameEl) buyerNameEl.value = invoice.customerName || invoice.buyerName || '';
  if (buyerPhoneEl) buyerPhoneEl.value = invoice.phone || invoice.buyerPhone || '';
  if (buyerProvinceEl) buyerProvinceEl.value = invoice.city || invoice.buyerProvince || '';

  // طريقة التسليم (select) - نستخدم قيمة الفاتورة لتحديد 'shipping'/'local'
  let deliveryVal = '';
  // الفاتورة القادمة من السلة تخزن 'shipping' كـ boolean (true/false)
  if (invoice.shipping === true || invoice.shipping === 'shipping') {
    deliveryVal = 'shipping';
  } else if (invoice.shipping === false || invoice.shipping === 'local' || invoice.shipping === 'within-homs') {
    deliveryVal = 'local';
  }
  
  if (deliveryTypeEl) {
    deliveryTypeEl.value = deliveryVal || 'local'; // الافتراضي هو 'local'
    deliveryTypeEl.dispatchEvent(new Event('change'));
    // يجب أن تكون هذه الدالة موجودة لتعرض حقول الشحن أو تخفيها
    if (typeof toggleShippingFields === 'function') {
      toggleShippingFields();
    }
  }

  // ----------------------------------------------------
  // ملء حقول الشحن والتسليم
  // ----------------------------------------------------
  const shippingCompanyEl = document.getElementById('shippingCompany');
  const shippingInfoEl = document.getElementById('shippingInfo');
  const localInfoEl = document.getElementById('localShippingInfo');
  const shippingDateEl = document.getElementById('shippingDate') || document.getElementById('deliveryDate');

  // ملء حقول الشحن بالتفاصيل، حسب ما تم اختياره
  if (shippingCompanyEl) shippingCompanyEl.value = invoice.shippingCompany || '';
  
  // ملء حقل معلومات الشحن/الموقع
  if (invoice.shipping) {
    if (shippingInfoEl) shippingInfoEl.value = invoice.shippingInfo || '';
  } else {
    if (localInfoEl) localInfoEl.value = invoice.shippingInfo || '';
  }
  
  // موعد التسليم
  if (shippingDateEl) {
    shippingDateEl.value = invoice.shippingDate || invoice.deliveryDate || '';
  }

  // ----------------------------------------------------
  // المنتجات (نحتاج أن نعرضها داخل selectedProductsList)
  // ----------------------------------------------------
  const selList = document.getElementById('selectedProductsList');
  if (selList) {
    selList.innerHTML = ''; // تنظيف القائمة
    
    const productsArr = Array.isArray(invoice.products) ? invoice.products : [];
    
    productsArr.forEach(p => {
      const name = p.name || p.productName || '';
      const qty = p.quantity || p.qty || 1;
      // نستخدم priceAtOrder من كائن الطلب إذا وُجد لضمان صحة السعر عند الطلب
      const price = p.priceAtOrder || p.priceSYP || p.price || 0; 
      const colorName = p.selectedColor?.name || p.color?.name || '';
      const colorCode = p.selectedColor?.code || p.color?.code || '';

      // ✅ إصلاح: استخدام القيمة الآمنة للسعر
      const safePrice = price || 0;

      const item = document.createElement('div');
      item.className = 'selected-product';
      item.innerHTML = `
        <div class="selected-product-left">
          <span class="product-name">${name}</span>
          ${colorCode ? `
            <span class="selected-color" 
                  title="${colorName}" 
                  style="background-color:${colorCode};display:inline-block;width:14px;height:14px;border-radius:3px;margin-inline-start:8px;vertical-align:middle">
            </span>
          ` : ''}
        </div>
        <div class="selected-product-right">
          <span class="product-qty">x${qty}</span>
          <span class="product-price">${safePrice.toLocaleString()} ل.س</span>
        </div>
      `;
      selList.appendChild(item);
    });
  }

  // ----------------------------------------------------
  // ملء حالة الدفع والملاحظات
  // ----------------------------------------------------
  const paymentStatusEl = document.getElementById('paymentStatus');
  const paymentAmountEl = document.getElementById('paymentAmountPaid');
  const payment = invoice.payment || { status: 'unpaid', paidSYP: 0, remainingSYP: 0 };

  if (paymentStatusEl) {
    paymentStatusEl.value = payment.status || 'unpaid';
    // تشغيل حدث التغيير لتحديث الحقول المرتبطة
    paymentStatusEl.dispatchEvent(new Event('change'));
  }
  
  // إظهار/إخفاء حقل المبلغ المدفوع (يجب أن تكون هذه الدالة موجودة)
  if (typeof togglePaymentFields === 'function') {
    togglePaymentFields(paymentStatusEl ? paymentStatusEl.value : (payment.status || 'unpaid'));
  }

  if (paymentAmountEl) {
    // ✅ إصلاح: استخدام القيمة الآمنة
    const paidAmount = payment.paidSYP || 0;
    paymentAmountEl.value = paidAmount;
  }

  // حساب وتعبئة الإجمالي في الحقول/العناصر ذات الصلة
  const productsForCalculation = Array.isArray(invoice.products) ? invoice.products : [];
  const { totalSYP, totalUSD } = calculateTotals(productsForCalculation);
  
  // ✅ إصلاح: استخدام القيم الآمنة
  const safeTotalSYP = totalSYP || 0;
  const safeTotalUSD = totalUSD || 0;
  
  const totalDisplay = document.getElementById('totalSYP'); // عنصر عرض الإجمالي
  const totalUSDDisplay = document.getElementById('totalUSD'); // عنصر عرض الدولار
  
  if (totalDisplay) totalDisplay.textContent = safeTotalSYP.toLocaleString();
  if (totalUSDDisplay) totalUSDDisplay.textContent = safeTotalUSD.toString();

  // ملاحظات
  const notesEl = document.getElementById('invoiceNotes');
  if (notesEl) notesEl.value = invoice.notes || '';

  // حفظ المعرف داخل الفورم لتمييز التعديل أو كمعرف مؤقت
  form.dataset.editingId = invoice.id;

  // إظهار زر الحذف فقط في حال كنا نعدل فاتورة محفوظة، وليس فاتورة جديدة مستوردة
  const delBtn = document.getElementById("deleteInvoiceBtn");
  if (delBtn) {
    // ✅ استخدام allInvoices المُمررة للتحقق مما إذا كانت الفاتورة موجودة مسبقاً
    const isExistingInvoice = allInvoices.findIndex(inv => inv.id === invoice.id) !== -1;
    if (isExistingInvoice) {
      delBtn.classList.remove('hidden'); // إظهاره إذا كانت محفوظة
    } else {
      delBtn.classList.add('hidden'); // إخفاءه إذا كانت جديدة
    }
  }

  // أخيراً افتح المودال 
  if (typeof openNewInvoiceModel === 'function') {
    openNewInvoiceModel();
  } else {
    console.warn('الدالة openNewInvoiceModel غير معرفة');
  }
}

function onPasteCode() {
    const codeInput = document.getElementById('pasteInvoiceCodeInput');
    const code = codeInput.value.trim();

    if (!code) {
        alert('ألصق الكود أولاً');
        return;
    }

    try {
        // 1. فك تشفير الكود
        const invoice = decodeInvoice(code);
        if (!invoice) throw new Error('لم يتم فك الكود بشكل صحيح');

        // 2. تجهيز الفاتورة
        let targetInvoice = { ...invoice };
        targetInvoice.id = Date.now(); // معرف جديد

        // 3. جلب جميع الفواتير الحالية
        const allInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
        
        // 4. تعبئة النموذج وفتح المودال
        fillFormWithInvoice(targetInvoice, allInvoices);
        
        // 5. ✅ إصلاح مهم: حذف معرف التعديل لضمان الحفظ كفاتورة جديدة
        const form = document.getElementById('invoiceForm');
        if (form && form.dataset.editingId) {
            delete form.dataset.editingId;
        }
        
        // 6. ✅ إظهار زر الحذف (اختياري - يمكن إزالته)
        const delBtn = document.getElementById("deleteInvoiceBtn");
        if (delBtn) delBtn.classList.add('hidden');
        
        // 7. رسالة توضيحية
        alert('📝 تم تحميل بيانات الفاتورة. يرجى مراجعتها والضغط على "حفظ" لحفظ الفاتورة.');
        
        // 8. مسح حقل الكود وإخفاء المودال
        codeInput.value = '';
        toggleInvoiceCodeInput();

    } catch (e) {
        console.error(e);
        alert('❌ فشل فك الكود — تأكد من أن الكود صحيح\n' + (e.message || e));
    }
}

function toggleInvoiceCodeInput(){
  document.getElementById("invoiceCodeInputModal").classList.toggle("show");
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






















// دالة جلب المتاجر (تستخدم في صفحة الفواتير)
function getStores() {
    try {
        const stores = JSON.parse(localStorage.getItem("pointsOfSale")) || [];
        // يمكنك إبقاء هذا السطر للتصحيح إذا أردت:
        // console.log('🔍 جلب المتاجر من localStorage:', stores);
        return stores;
    } catch (error) {
        console.error('❌ خطأ في جلب المتاجر:', error);
        return [];
    }
}


    // ----------------------------------------------------------------------
// A. قراءة معاملات URL وتنفيذ الإجراء
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // ... (أي تهيئة سابقة لديك لصفحة الفواتير) ...
    
    // 💡 نقوم بفحص رابط URL لتحديد ما إذا كنا قادمين من صفحة المتاجر
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const storeId = urlParams.get('storeId');

    // 1. تنفيذ إجراء 'ADD' (إضافة فاتورة جديدة لمتجر محدد)
    if (action === 'add' && storeId) {
        // نستخدم parseInt لتحويل القيمة إلى رقم لضمان التوافق
        const targetStoreId = parseInt(storeId);
        
        // يجب أن تكون دالة openInvoiceModal() موجودة في هذا الملف
        // (سنعدلها لتستقبل storeId في الخطوة التالية)
        openNewInvoiceModel(targetStoreId);
    }
    
    // 2. تنفيذ إجراء 'FILTER' (عرض فواتير متجر محدد)
    else if (action === 'filter' && storeId) {
        const targetStoreId = parseInt(storeId);
        
        // يجب أن تكون دالة renderInvoices() موجودة في هذا الملف
        // (سنعدلها لتستقبل storeId في الخطوة التالية)
        renderInvoices(targetStoreId); 
        
        // 💡 إظهار رسالة تفيد بأن القائمة مفلترة
        alert(`يتم الآن عرض الفواتير المرتبطة بالمتجر ID: ${targetStoreId}`);
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
    const storeSelect = document.getElementById('linkedStores');
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
    stores.forEach(store => {
        const option = document.createElement('option');
        // نستخدم ID المتجر كقيمة (Value)
        option.value = store.id; 
        option.textContent = `${store.name} (${store.phone || store.location})`; // إضافة تفاصيل للتمييز
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
    const nameInput = document.getElementById('buyerName');
    const phoneInput = document.getElementById('buyerPhone');
    const provinceInput = document.getElementById('buyerProvince');

    // 1. تفريغ الحقول أولاً (يحدث فقط في وضع الإضافة الجديدة)
    nameInput.value = '';
    phoneInput.value = '';
    provinceInput.value = '';

    if (selectedId && selectedId !== "") {
        const stores = getStores();
        // ID المتجر يكون string من الـ HTML، يجب تحويله إلى رقم للمقارنة
        const storeIdNum = parseInt(selectedId); 
        
        const selectedStore = stores.find(s => s.id === storeIdNum);

        if (selectedStore) {
            // 2. تعبئة الحقول ببيانات المتجر
            nameInput.value = selectedStore.name;
            phoneInput.value = selectedStore.phone;
            provinceInput.value = selectedStore.location; // استخدمنا 'location' للمحافظة
        }
    }
}