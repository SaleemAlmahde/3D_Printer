/**
 * إظهار رسالة التوست لفترة محددة بلون خلفية مخصص.
 * @param {string} message - الرسالة المراد عرضها.
 * @param {number} duration - مدة عرض الرسالة بالمللي ثانية (افتراضياً 3000ms).
 * @param {string} bgColor - رمز اللون المراد استخدامه للخلفية (افتراضياً لون النجاح الأخضر).
 */
function showToast(message, duration = 3000, bgColor = '#43a047') {
    const toastElement = document.getElementById('toastNotification');
    const toastMessageElement = document.getElementById('toastMessage');

    if (!toastElement || !toastMessageElement) return; // تحقق من وجود العناصر

    // 1. (تعديل جديد) تعيين لون الخلفية باستخدام متغير CSS
    // يتم تمرير قيمة اللون مباشرة كمتغير CSS للعنصر.
    toastElement.style.setProperty('--toast-bg-color', bgColor);
    
    // 2. تعيين الرسالة الجديدة
    toastMessageElement.textContent = message;

    // 3. إظهار الـ Toast بإضافة الفئة (يتم تطبيق الترانزيشن)
    toastElement.classList.remove('toast-hidden');
    toastElement.classList.add('toast-visible');

    // 4. إعداد مؤقت لإخفاء الـ Toast
    setTimeout(() => {
        // إخفاء الـ Toast بعد انتهاء المدة (يتم تطبيق الترانزيشن)
        toastElement.classList.remove('toast-visible');
        toastElement.classList.add('toast-hidden');
    }, duration);
}