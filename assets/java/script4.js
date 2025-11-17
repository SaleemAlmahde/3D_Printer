// المتغيرات التي سنحتاجها عالميًا (نقوم بتهيئة قيمتها لاحقًا)
let storeModal;
let storeOverlay;
let storeForm;
let deleteStoreBtn;

function getStores() {
    return JSON.parse(localStorage.getItem("pointsOfSale")) || [];
}

// دالة لحفظ قائمة المتاجر الجديدة في localStorage
function setStores(stores) {
    localStorage.setItem("pointsOfSale", JSON.stringify(stores));
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. تهيئة المتغيرات: الآن فقط يتم البحث عن العناصر بعد تحميلها
    storeModal = document.getElementById('newStoreModal');
    storeOverlay = document.getElementById('newStoreOverlay');
    storeForm = document.getElementById('storeForm');
    deleteStoreBtn = document.getElementById('deleteStoreBtn');

    // 2. التحقق وبدء عرض المتاجر
    if (document.getElementById('storesContainer')) {
        renderStores();
    }
    // 💡 الآن، يمكن لبقية الدوال (مثل openStoreModal) استخدام هذه المتغيرات بشكل آمن.
});

// فتح مودال المتجر
function openStoreModal(store = null) {
    storeModal.classList.remove('hidden-store');
    storeOverlay.classList.remove('hidden-store');
    
    // إعادة تعيين النموذج في كل مرة يفتح فيها
    storeForm.reset();
    delete storeForm.dataset.editingId;
    deleteStoreBtn.classList.add('hidden');

    if (store) {
        // حالة التعديل
        document.querySelector('#newStoreModal h2').textContent = "تعديل بيانات المتجر";
        storeForm.dataset.editingId = store.id;
        document.getElementById('storeName').value = store.name;
        document.getElementById('storePhone').value = store.phone;
        document.getElementById('storeLocation').value = store.location;
        deleteStoreBtn.classList.remove('hidden');
    } else {
        // حالة الإضافة الجديدة
        document.querySelector('#newStoreModal h2').textContent = "إضافة متجر جديد";
    }
}

// إغلاق مودال المتجر
function closeStoreModal() {
    storeModal.classList.add('hidden-store');
    storeOverlay.classList.add('hidden-store');
    // إعادة تعيين حالة التعديل عند الإغلاق
    storeForm.reset();
    delete storeForm.dataset.editingId;
}

// ----------------------------------------------------------------------
// 3. دالة حفظ المتجر (CRUD Save)
// ----------------------------------------------------------------------

function saveStore() {
    try {
        const name = document.getElementById('storeName').value.trim();
        const phone = document.getElementById('storePhone').value.trim();
        const location = document.getElementById('storeLocation').value.trim();

        if (!name || !phone || !location) {
            alert("⚠️ يرجى ملء جميع حقول المتجر.");
            return;
        }

        let stores = getStores();
        const editingId = storeForm.dataset.editingId;

        if (editingId) {
            // حالة التعديل
            const id = parseInt(editingId);
            const index = stores.findIndex(s => s.id === id);

            if (index !== -1) {
                stores[index] = {
                    ...stores[index],
                    name,
                    phone,
                    location
                };
            }
        } else {
            // حالة الإضافة الجديدة
            const newStore = {
                id: Date.now(),
                name,
                phone,
                location
            };
            stores.push(newStore);
        }

        setStores(stores);
        closeStoreModal();
        renderStores(); // تحديث القائمة المعروضة
        alert("✅ تم حفظ المتجر بنجاح.");
    } catch (e) {
        console.error("خطأ أثناء حفظ المتجر:", e);
        alert("❌ حدث خطأ أثناء الحفظ.");
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
    const allInvoices = getInvoices();
    let totalDebt = 0;

    // فلترة الفواتير المرتبطة بهذا المتجر فقط
    const storeInvoices = allInvoices.filter(inv => inv.posId === storeId);

    storeInvoices.forEach(invoice => {
        // نجمع المتبقي فقط من قسم الدفع
        // يتم التحقق من وجود payment و remainingSYP لتجنب الأخطاء
        const remaining = (invoice.payment && invoice.payment.remainingSYP) || 0;
        totalDebt += remaining;
    });
    
    return totalDebt;
}

// 💡 تذكر أن دالة getStores() و setStores(stores) تم تعريفها مسبقاً

function renderStores() {
    const storesContainer = document.getElementById('storesContainer');
    if (!storesContainer) return;

    const stores = getStores();
    storesContainer.innerHTML = ''; // مسح المحتوى القديم

    if (stores.length === 0) {
        storesContainer.innerHTML = '<p class="empty-list-msg">لا يوجد نقاط بيع مُضافة حالياً.</p>';
        return;
    }

    stores.forEach(store => {
        const totalDebt = calculateStoreDebt(store.id);
        const storeCard = document.createElement('div');
        storeCard.className = 'store-card';
        // 💡 النقر على الكارد يفتح الأوفرلاي بدلاً من التعديل مباشرة
        storeCard.setAttribute('onclick', `showStoreActions(${store.id})`);

        storeCard.innerHTML = `
            <h2>${store.name}</h2>
            
            <div class="bottom-store-card">
                <div class="store-details">
                    <p><strong> <i class="fa fa-phone"></i> الهاتف :</strong> ${store.phone}</p>
                    <p><strong> <i class="fa fa-map-marker"></i> الموقع :</strong> ${store.location}</p>
                    <p class="store-debt-info">
                        <strong> <i class="fa fa-money"></i> المديونية المتبقية :</strong> 
                        <span class="${totalDebt > 0 ? 'debt-due' : 'debt-clear'}">
                            ${totalDebt.toLocaleString()} ل.س
                        </span>
                    </p>
                </div>
            </div>
            
            <div class="store-actions-overlay hidden" data-store-id="${store.id}" 
                 onclick="event.stopPropagation()">
                
                <button class="close-overlay-btn" onclick="hideStoreActions(${store.id})">&times;</button>

                <button class="action-btn add-invoice" onclick="openInvoiceForStore(${store.id}, '${store.name}', '${store.phone}', '${store.location}')">
                    <i class="fa fa-plus-circle"></i> إضافة فاتورة
                </button>
                <button class="action-btn view-invoices" onclick="filterInvoicesByStore(${store.id})">
                    <i class="fa fa-list-alt"></i> عرض الفواتير
                </button>
                <button class="action-btn edit-store" onclick="editStore(${store.id})">
                    <i class="fa fa-pencil"></i> تعديل
                </button>
            </div>
        `;
        storesContainer.appendChild(storeCard);
    });
}

/**
 * تفتح مودال المتجر لغرض التعديل.
 * @param {number} storeId - معرّف المتجر.
 */
function editStore(storeId) {
    const stores = getStores();
    const storeToEdit = stores.find(s => s.id === storeId);

    if (storeToEdit) {
        // دالة openStoreModal تتولى تعبئة الحقول ووضع storeId في dataset.editingId
        openStoreModal(storeToEdit);
    } else {
        alert("❌ لم يتم العثور على المتجر للتعديل.");
    }
}

// ----------------------------------------------------------------------
// 4. دوال الحذف والبحث (مطلوبة للواجهة التفاعلية)
// ----------------------------------------------------------------------

// لفتح نافذة تأكيد حذف المتجر
function showStoreDeleteConfirm() {
    document.getElementById('storeConfirmOverlay').classList.remove('hidden');
    document.getElementById('storeConfirmModal').classList.remove('hidden');
}

// لإلغاء الحذف
function cancelStoreDelete() {
    document.getElementById('storeConfirmOverlay').classList.add('hidden');
    document.getElementById('storeConfirmModal').classList.add('hidden');
}

// لتنفيذ عملية الحذف
function confirmStoreDelete() {
    const stores = getStores();
    const storeIdToDelete = parseInt(storeForm.dataset.editingId);

    // فلترة المتاجر لإزالة المتجر المراد حذفه
    const updatedStores = stores.filter(s => s.id !== storeIdToDelete);

    setStores(updatedStores);
    cancelStoreDelete();
    closeStoreModal();
    renderStores(); // إعادة عرض القائمة
    alert("✅ تم حذف المتجر بنجاح. (ملاحظة: فواتيره المرتبطة لم تُحذف)");
}

// دالة البحث (مطلوبة من حقل البحث في HTML)
function searchStores() {
    // 💡 سنقوم بتعريف منطق البحث هنا، لكن حالياً نتركها فارغة لتجنب أخطاء "الدالة غير معرفة"
    // يمكنك إضافة منطق الفلترة لاحقاً في دالة renderStores()
    renderStores();
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

    /**
 * إظهار أوفرلاي الإجراءات الخاصة بالكارد
 * @param {number} storeId - معرّف المتجر
 */
function showStoreActions(storeId) {
    // إخفاء أي أوفرلاي آخر مفتوح حالياً (إذا كنت تريد فتح واحد فقط في كل مرة)
    document.querySelectorAll('.store-actions-overlay').forEach(overlay => {
        overlay.classList.add('hidden');
    });

    // إظهار الأوفرلاي المطلوب
    const overlay = document.querySelector(`.store-actions-overlay[data-store-id="${storeId}"]`);
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

/**
 * إخفاء أوفرلاي الإجراءات
 * @param {number} storeId - معرّف المتجر
 */
function hideStoreActions(storeId) {
    const overlay = document.querySelector(`.store-actions-overlay[data-store-id="${storeId}"]`);
    if (overlay) {
        // نستخدم stopPropagation في HTML لمنع النقر على الأوفرلاي من إخفائه
        overlay.classList.add('hidden');
    }
}