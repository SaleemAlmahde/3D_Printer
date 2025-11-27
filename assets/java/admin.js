const ADMIN_TOKEN_KEY = 'adminToken';

/**
 * التحقق مما إذا كان رمز المدير مفعلاً في localStorage.
 * @returns {boolean} True إذا كان المدير مفعلاً.
 */
function isAdmin() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) === 'active';
}

/**
 * تفعيل وضع المدير (Admin Mode).
 */
function enableAdminMode() {
    localStorage.setItem(ADMIN_TOKEN_KEY, 'active');
    alert("✅ تم تفعيل وضع المدير بنجاح!");
    // يجب إعادة تحميل الصفحة أو تحديث الواجهة بعد هذه الخطوة
}

/**
 * إلغاء تفعيل وضع المدير (Admin Mode).
 */
function disableAdminMode() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    alert("❌ تم إلغاء تفعيل وضع المدير.");
    // يجب إعادة تحميل الصفحة أو تحديث الواجهة بعد هذه الخطوة
}

// enableAdminMode(); ل تفعيل وضع الادمن تكتب بالكونسول وبعدها اف5
// disableAdminMode(); ل الغاء تفعيل وضع الادمن


document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo");
    if (!logo) return;

    let clickCount = 0;
    let clickTimer = null;
    const maxClicks = 10;
    const timeWindow = 5000;

    logo.addEventListener("click", () => {
        clickCount++;
        if (!clickTimer) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
                clickTimer = null;
            }, timeWindow);
        }
        if (clickCount >= maxClicks) {
            if (isAdmin()) {
                disableAdminMode();
            } else {
                enableAdminMode();
            }
            clickCount = 0;
            clearTimeout(clickTimer);
            clickTimer = null;
        }
    });
});
